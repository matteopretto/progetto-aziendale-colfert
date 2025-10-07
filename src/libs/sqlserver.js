// dbmanager.js (ESM)
// npm i mssql
import sql from 'mssql';

/**
 * DBManager – MSSQL pool per-istanza con retry e riconnessione serializzata.
 *
 * Costruttori supportati:
 *  - new DBManager(server, user, password, database?)
 *  - new DBManager({ server, user, password, database, port?, options?, pool?, requestTimeout?, connectionTimeout?, strictErrors? })
 *
 * Note:
 *  - Nessun side-effect globale (non chiude/usa il pool globale di mssql).
 *  - Opzione strictErrors (default: false) per decidere se propagare gli errori.
 */
export class DBManager {
  /**
   * @param {string|object} configOrServer
   * @param {string} [user]
   * @param {string} [password]
   * @param {string} [database="colfert"]
   * @param {object} [legacyOpts]  // supporto opzionale per la vecchia firma
   */
  constructor(configOrServer, user, password, database = 'colfert', legacyOpts = {}) {
    if (typeof configOrServer === 'string') {
      // Vecchia firma: (server, user, password, database?, opts?)
      this.config = {
        server: configOrServer,
        user,
        password,
        database,
        port: 1433,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
          appName: 'DBManager'
        },
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30_000
        },
        requestTimeout: legacyOpts.requestTimeout ?? 30_000,
        connectionTimeout: legacyOpts.connectionTimeout ?? 15_000
      };
      this.strictErrors = !!legacyOpts.strictErrors;
    } else {
      // Nuova firma: oggetto config
      const cfg = configOrServer || {};
      this.config = {
        server: cfg.server,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database ?? 'colfert',
        port: cfg.port ?? 1433,
        options: {
          encrypt: cfg.options?.encrypt ?? false,
          trustServerCertificate: cfg.options?.trustServerCertificate ?? true,
          enableArithAbort: cfg.options?.enableArithAbort ?? true,
          appName: cfg.options?.appName ?? 'DBManager'
        },
        pool: {
          max: cfg.pool?.max ?? 10,
          min: cfg.pool?.min ?? 0,
          idleTimeoutMillis: cfg.pool?.idleTimeoutMillis ?? 30_000
        },
        requestTimeout: cfg.requestTimeout ?? 30_000,
        connectionTimeout: cfg.connectionTimeout ?? 15_000
      };
      this.strictErrors = !!cfg.strictErrors;
    }

    /** @type {sql.ConnectionPool|null} */
    this.pool = null;
    /** @type {Promise<sql.ConnectionPool>|null} */
    this._connecting = null;
    /** @type {Promise<void>|null} */
    this._reconnectPromise = null;

    /** @type {string[]} */
    this.querylist = [];
  }

  // ─────────────────────────────
  // Gestione pool / connessione
  // ─────────────────────────────

  /**
   * Ritorna un pool connesso, creando/ricreando se necessario.
   * @returns {Promise<sql.ConnectionPool>}
   */
  async getPool() {
    if (this.pool?.connected) return this.pool;

    if (!this.pool) {
      this.pool = new sql.ConnectionPool(this.config);
      this._connecting = this.pool.connect();
      this.pool.on('error', (err) => {
        // Invalida subito il pool su errori asincroni
        // (es. "Connection is closed" o socket error dal driver)
        // senza chiudere pool globali.
        // Log facoltativo:
        // console.error('[DB] Pool error:', err);
        this._invalidatePool();
      });
    }

    try {
      await this._connecting;
    } catch (e) {
      // Se la connect fallisce, invalida e rialza
      this._invalidatePool();
      throw e;
    }

    return this.pool;
  }

  /**
   * Invalida e chiude in sicurezza il pool istanza.
   */
  _invalidatePool() {
    try { this.pool?.close(); } catch { /* ignore */ }
    this.pool = null;
    this._connecting = null;
  }

  /**
   * Chiusura esplicita chiamabile dal consumatore.
   */
  async closeConnection() {
    try { await this.pool?.close(); } catch { /* ignore */ }
    this.pool = null;
    this._connecting = null;
  }

  /**
   * True se l'errore è di connessione/rete/stato driver.
   * @param {any} err
   */
  _isConnectionError(err) {
    const code = err?.code || err?.name || err?.originalError?.code || '';
    const msg = (err?.message || '') + ' ' + (err?.originalError?.message || '');
    return /ECONN|ETIMEOUT|ELOGIN|EINVALIDSTATE|ESOCKET|EPIPE|ENOTFOUND|CLOSED/i.test(code + ' ' + msg)
        || /connection\s+is\s+closed/i.test(msg);
  }

  /**
   * Costruisce una Request e applica eventuali parametri.
   * @param {sql.ConnectionPool|sql.Transaction} ctx
   * @param {object|Array<{name:string,type?:any,value:any}>} [params]
   * @returns {sql.Request}
   */
  _buildRequest(ctx, params) {
    const req = new sql.Request(ctx);
    if (!params) return req;

    if (Array.isArray(params)) {
      for (const p of params) {
        if (!p?.name) continue;
        req.input(p.name, p.type || this._inferType(p.value), p.value);
      }
      return req;
    }

    for (const [name, value] of Object.entries(params)) {
      req.input(name, this._inferType(value), value);
    }
    return req;
  }

  /**
   * Inferenza semplice dei tipi SQL.
   * @param {any} value
   */
  _inferType(value) {
    if (value === null || value === undefined) return sql.NVarChar;
    if (Buffer.isBuffer(value)) return sql.VarBinary(sql.MAX);
    if (value instanceof Date) return sql.DateTime;
    const t = typeof value;
    if (t === 'number') return Number.isInteger(value) ? sql.Int : sql.Float;
    if (t === 'bigint') return sql.BigInt;
    if (t === 'boolean') return sql.Bit;
    const len = String(value).length;
    return len > 4000 ? sql.NVarChar(sql.MAX) : sql.NVarChar;
  }

  /**
   * Esegue una query con retry singolo su errori di connessione,
   * serializzando la fase di riconnessione per evitare race.
   * @param {string} query
   * @param {object|Array} [params]
   * @returns {Promise<sql.IResult<any>>}
   */
  async _run(query, params) {
    let pool = await this.getPool();
    try {
      const req = this._buildRequest(pool, params);
      return await req.query(query);
    } catch (err) {
      if (this._isConnectionError(err)) {
        // Riconnessione serializzata
        if (!this._reconnectPromise) {
          this._reconnectPromise = (async () => {
            this._invalidatePool();
            await this.getPool();
          })().finally(() => { this._reconnectPromise = null; });
        }
        await this._reconnectPromise;

        // Secondo tentativo
        pool = await this.getPool();
        const req2 = this._buildRequest(pool, params);
        return await req2.query(query);
      }
      // Errore non-di-connessione: propagalo (verrà gestito dai wrappers)
      throw err;
    }
  }

  _escapeHtml(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─────────────────────────────
  // API pubblica: gestione lista query
  // ─────────────────────────────
  AddToQueries(query) { this.querylist.push(query); }
  ClearQueries() { this.querylist = []; }
  GetQueries() { return this.querylist.slice(); }

  // ─────────────────────────────
  // API pubblica: SELECT helpers
  // ─────────────────────────────

  async RowCount(query, params) {
    try {
      const r = await this._run(query, params);
      return Array.isArray(r.recordset) ? r.recordset.length : 0;
    } catch (e) {
      if (this.strictErrors) throw e;
      return -1;
    }
  }

  async ColCount(query, params) {
    try {
      const r = await this._run(query, params);
      const rows = Array.isArray(r.recordset) ? r.recordset : [];
      return rows.length ? Object.keys(rows[0]).length : 0;
    } catch (e) {
      if (this.strictErrors) throw e;
      return -1;
    }
  }

  async ExistsValue(query, params) {
    try {
      const r = await this._run(query, params);
      return Array.isArray(r.recordset) && r.recordset.length > 0;
    } catch (e) {
      if (this.strictErrors) throw e;
      return false;
    }
  }

  async GetOneValue(query, params) {
    try {
      const r = await this._run(query, params);
      const rows = Array.isArray(r.recordset) ? r.recordset : [];
      if (!rows.length) return '';
      const first = rows[0];
      const col = Object.keys(first)[0];
      const val = first[col];
      return val === null || val === undefined ? '' : String(val);
    } catch (e) {
      if (this.strictErrors) throw e;
      return '';
    }
  }

  async OpenQuery(query, params) {
    try {
      const r = await this._run(query, params);
      return Array.isArray(r.recordset) ? r.recordset : [];
    } catch (e) {
      if (this.strictErrors) throw e;
      return [];
    }
  }

  async OpenTable(query, classe, params) {
    try {
      const r = await this._run(query, params);
      const rows = Array.isArray(r.recordset) ? r.recordset : [];
      const cls = this._escapeHtml(classe || '');
      if (!rows.length) return `<table class="${cls}"></table>`;

      const cols = Object.keys(rows[0]);
      let html = `<table class="${cls}"><thead><tr>`;
      html += cols.map(c => `<th>${this._escapeHtml(c)}</th>`).join('');
      html += `</tr></thead><tbody>`;
      html += rows.map(row =>
        `<tr>${cols.map(c => `<td>${this._escapeHtml(row[c])}</td>`).join('')}</tr>`
      ).join('');
      html += `</tbody></table>`;
      return html;
    } catch (e) {
      if (this.strictErrors) throw e;
      return '';
    }
  }

  // ─────────────────────────────
  // API pubblica: non-SELECT
  // ─────────────────────────────

  async ExecuteQuery(query, params) {
    try {
      const r = await this._run(query, params);
      const affected = Array.isArray(r.rowsAffected)
        ? r.rowsAffected.reduce((a, b) => a + b, 0)
        : (r.rowsAffected || 0);
      return { ok: true, message: `${affected} row(s) affected`, rowsAffected: affected };
    } catch (e) {
      if (this.strictErrors) throw e;
      return { ok: false, message: e?.message || String(e) };
    }
  }

  /**
   * Esegue in sequenza le query accumulate in querylist.
   * @returns {Promise<string[]>} elenco delle query fallite (vuoto se tutte ok)
   */
  async ExecuteQueries() {
    const failed = [];
    for (const q of this.querylist) {
      try { await this._run(q); }
      catch (e) {
        if (this.strictErrors) throw e;
        failed.push(q);
      }
    }
    return failed;
  }

  /**
   * Esegue le query in transazione.
   * @returns {Promise<{ok:boolean, message:string}>}
   */
  async ExecuteTransaction() {
    let tx;
    try {
      const pool = await this.getPool();
      tx = new sql.Transaction(pool);
      await tx.begin();

      for (const q of this.querylist) {
        const req = this._buildRequest(tx);
        await req.query(q);
      }

      await tx.commit();
      return { ok: true, message: 'Transaction committed successfully' };
    } catch (e) {
      try { await tx?.rollback(); } catch { /* ignore */ }
      if (this.strictErrors) throw e;
      return { ok: false, message: e?.message || String(e) };
    }
  }

  // ─────────────────────────────
  // API pubblica: helpers liste
  // ─────────────────────────────

  async ValueList(query, column = 0, params) {
    try {
      const r = await this._run(query, params);
      const rows = Array.isArray(r.recordset) ? r.recordset : [];
      if (!rows.length) return [];
      const colName = Object.keys(rows[0])[column];
      if (!colName) return [];
      return rows.map(x => (x[colName] === null || x[colName] === undefined) ? '' : String(x[colName]));
    } catch (e) {
      if (this.strictErrors) throw e;
      return [];
    }
  }

  async HorizontalValueList(query, rowIndex = 0, params) {
    try {
      const r = await this._run(query, params);
      const rows = Array.isArray(r.recordset) ? r.recordset : [];
      if (!rows.length || rowIndex >= rows.length) return [];
      return Object.values(rows[rowIndex]).map(v => (v === null || v === undefined) ? '' : String(v));
    } catch (e) {
      if (this.strictErrors) throw e;
      return [];
    }
  }

  async CreateDictionary(query, params) {
    try {
      const r = await this._run(query, params);
      const rows = Array.isArray(r.recordset) ? r.recordset : [];
      const dict = {};
      if (!rows.length) return dict;
      const keyCol = Object.keys(rows[0])[0];
      for (const row of rows) dict[row[keyCol]] = row;
      return dict;
    } catch (e) {
      if (this.strictErrors) throw e;
      return {};
    }
  }
}

const db = new DBManager(process.env.DB_SERVER, process.env.DB_USER, process.env.DB_PASSWORD);
if (typeof globalThis !== 'undefined') { globalThis.db = db; }
