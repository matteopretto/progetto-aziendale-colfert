// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Visual
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



const boilerplate = `
<!DOCTYPE html>
<html>
<head>
<title>title</title>
<style>
  body { font-family: <<fontlist>>; font-size: <<dimension>>; }
  table, th, td { border: 1px solid gainsboro; }
  table { width: 100%; border-collapse: collapse; }
</style>
</head>
<body>
<p>

<span style='display:none;'>nexttexthere</span>

</p>
</body>
</html> 
`;

const googleplate = `
<!DOCTYPE html>
<html>
<head>
<title>title</title>
<link rel=""stylesheet"" href=""https://fonts.googleapis.com/css?family=<<googlefont>>"">
<style>
  body { font-family: ""<<googlefont>>"", sans-serif; font-size: <<dimension>>; }
  table, th, td { border: 1px solid gainsboro; }
  table { width: 100%; border-collapse: collapse; }
</style>
</head>
<body>
<p>

<span style='display:none;'>nexttexthere</span>

</p>
</body>
</html> 
`;

const arial     = "Arial, sans-serif";
const verdana   = "Verdana, sans-serif";
const helvetica = "Helvetica, sans-serif";
const tahoma    = "Tahoma, sans-serif";
const trebuchet = "Trebuchet MS, sans-serif";
const times     = "Times New Roman, serif";
const georgia   = "Georgia, serif";
const garamond  = "Garamond, serif";
const courier   = "Courier New, monospace";
const script    = "Brush Script MT, cursive";
const book      = "Book Antiqua, Helvetica, sans-serif";
const consolas  = "Consolas,Courier New, monospace";




export class Visual
{
	constructor() {  }

	static ToStyle(style)
	{
		let res = "";
		if(style != "")
		{
			res = " style=\"" + style + "\" ";
		}
		return res;
	}

	static ToClass(clas)
	{
		let res = "";
		if(clas != "")
		{
			res = " class=\"" + clas + "\" ";
		}
		return res;
	}

	static ToElement(element, text, style, clas)
	{
		let res = "<" + element + " #style# #class# >";
		res = res.replaceAll("#style#", this.ToStyle(style));
		res = res.replaceAll("#class#", this.ToClass(clas));
		res += text;
		res += "</" + element + ">";
		return res;
	}

	static ToTable(datalist)
	{
		let res = "";
		let cols = datalist[0].length;
		res = res + "<table>\r\n";
		res = res + this.GetTableLine(datalist[0], "tr", cols) + "\r\n";
		for(let i = 1; i < datalist.Count; i++)
		{
			res = res + getTableLine(datalist[i], "tr", cols) + "\r\n";
		}
		res = res + "</table>\r\n";
		return res;
	}

	GetTableLine(data, tag, cols)
	{
		let res = "<"+tag+">";
		for(let i = 0; i < cols; i++)
		{
			res = res + "<td>" + data[i] + "</td>";
		}
		res = res + "</"+tag+">";
		return res;
	}


	static ToParagraph(text, style = "", clas = "")
	{
		return this.ToElement("p", text, style, clas);
	}

	static ToSpan(text, style = "", clas = "")
	{
		return this.ToElement("span", text, style, clas);
	}

	static ToPre(text, style = "", clas = "")
	{
		return this.ToElement("pre", text, style, clas);
	}

	static ToH1(text, style = "", clas = "")
	{
		return this.ToElement("h1", text, style, clas);
	}

	static ToH2(text, style = "", clas = "")
	{
		return this.ToElement("h2", text, style, clas);
	}

	static ToH3(text, style = "", clas = "")
	{
		return this.ToElement("h3", text, style, clas);
	}

	static ToH4(text, style = "", clas = "")
	{
		return this.ToElement("h4", text, style, clas);
	}

	static ToH5(text, style = "", clas = "")
	{
		return this.ToElement("h5", text, style, clas);
	}

	static ToH6(text, style = "", clas = "")
	{
		return this.ToElement("h6", text, style, clas);
	}

  static ToLi = function(classval)
  {
    let res = "";
    if(classval == undefined) res = "<li>" + this + "</li>";
    else res = "<li class = '" + classval + "'>" + this + "</li>";
    return res;
  }
  
  static ToOption = function(separator)
  {
    let res = "";
    res = "<option value='" + this.getLeftOf(separator) + "'>" + this + "</option>";
    return res;
  }
 
  
	static ToAnchor(text, name) { return text.anchor(name)(); };
	static ToBig(text)          { return text.big         (); };
	static ToBlink(text)        { return text.blink       (); };
	static ToBold(text)         { return text.bold        (); };
	static ToFixed(text)        { return text.fixed       (); };
	static ToItalics(text)      { return text.italics     (); };
	static ToSmall(text)        { return text.small       (); };
	static ToStrike(text)       { return text.strike      (); };
	static ToSup(text)          { return text.sup         (); };

	static MicroAnimation(element, classname, delay)
	{
		element.classList.add(classname);
		setTimeout(function() { element.classList.remove(classname); }, delay);
	}

  static ShowLoader(messaggio)
  {
    if(messaggio == undefined) messaggio = "";
    let html = `
    <div id = "loadercontainer">
      <img src = "https://www.giallocolfert.com/libs/v0001/res/loading.gif" ></img>
      <br><h1>${messaggio}</h1>
    </div>
    `;

    $('body').append(html);
  }

  static HideLoader()
  {
    $("#loadercontainer").remove();
  }

  static GenerateColorImageUrl(color) 
  {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 50;  // Set the width of the canvas
    canvas.height = 50; // Set the height of the canvas
  
    // Get the drawing context of the canvas
    const ctx = canvas.getContext('2d');
  
    // Set the fill style to the input color and fill a rectangle
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Convert the canvas content to a data URL
    return canvas.toDataURL();
  }
  
  

}


const visual = new Visual();
if (typeof globalThis !== 'undefined') { globalThis.visual = visual; }




// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ debugger
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// DebugLog.js (versione a classe, con mode 'stack')

export class Debugger
{

	static SKIP_INTERNAL = new Set([
	  'parseStack',
	  'getStackFrames',
	  'getCallerName',
	  'shouldLog',
	  'log',
	  'Debugger.parseStack',
	  'Debugger.getStackFrames',
	  'Debugger.getCallerName',
	  'Debugger.shouldLog',
	  'Debugger.log',
	  'Object.log',
	  'info',
	  'warning',
	  'error'
	]);

	constructor()
	{
	  this._mode = 'none';          // 'all' | 'none' | 'allowlist' | 'stack'
	  this._allow = new Set();      // nomi funzione
	  this._output = console.log;   // funzione di output
	  this._labelPattern = '[{caller}]';
	
	  this._icons = { info: 'ℹ️', warning: '⚠️', error: '⛔' };
	}

	_emitWithPrefix(prefix, caller, args)
	{
	  this._output(`${prefix}${this._formatLabel(caller)}`, ...args);
	}

	setLevelIcons(partial)
	{
	  if (partial && typeof partial === 'object')
	  {
	    this._icons = { ...this._icons, ...partial };
	  }
	  return this;
	}

  // ---------- parsing stack ----------
	static _normalizeName(name)
	{
	  if (!name) return 'anonymous';
	  return String(name)
	    .replace(/^async\s+/, '')     // toglie "async "
	    .replace(/^[^.]+\./, '')      // toglie il primo prefisso "Classe." o "Object."
	    .replace(/^Object\./, '');    // ridondante ma innocuo
	}

  static parseStack(stackText)
  {
    const lines = String(stackText || '').split('\n').slice(1); // salta "Error"
    const frames = [];

    for (const line of lines)
    {
      let fn = '';

      // V8/Chromium/Node: "    at fn (file:line:col)" o "    at file:line:col"
      let m = line.match(/^\s*at\s+(.*?)\s+\(/);
      if (m && m[1])
      {
        fn = m[1];
      }
      else
      {
        // Firefox: "fn@file:line:col" o "@file:line:col"
        m = line.match(/^\s*([^@]*)@/);
        if (m)
        {
          fn = (m[1] || '').trim();
        }
      }

      frames.push({ fn: Debugger._normalizeName(fn), raw: line.trim() });
    }
    return frames;
  }

  getStackFrames()
  {
    return Debugger.parseStack(new Error().stack);
  }

  getCallerName()
  {
    const frames = this.getStackFrames();
    for (const fr of frames)
    {
      const name = fr.fn || 'anonymous';
      if (!Debugger.SKIP_INTERNAL.has(name))
      {
        return name;
      }
    }
    return 'anonymous';
  }

  // ---------- policy ----------
  shouldLog()
  {
    if (this._mode === 'none')
    {
      return false;
    }
    if (this._mode === 'all')
    {
      return true;
    }

    const frames = this.getStackFrames();

    if (this._mode === 'allowlist')
    {
      // solo il chiamante diretto (primo frame esterno)
      for (const fr of frames)
      {
        const name = fr.fn || 'anonymous';
        if (Debugger.SKIP_INTERNAL.has(name)) continue;
        return this._allow.has(name);
      }
      return false;
    }

    if (this._mode === 'stack')
    {
      // qualsiasi antenato nello stack
      for (const fr of frames)
      {
        const name = fr.fn || 'anonymous';
        if (Debugger.SKIP_INTERNAL.has(name)) continue;
        if (this._allow.has(name)) return true;
      }
      return false;
    }

    return false;
  }

  // ---------- API pubblica ----------
  setMode(mode)
  {
    if (!['all', 'none', 'allowlist', 'stack'].includes(mode))
    {
      throw new Error("Mode invalido. Usa 'all' | 'none' | 'allowlist' | 'stack'.");
    }
    this._mode = mode;
    return this;
  }

  allow(...fnNames)
  {
    for (const n of fnNames)
    {
      if (n) this._allow.add(String(n));
    }
    return this;
  }

  disallow(...fnNames)
  {
    for (const n of fnNames)
    {
      this._allow.delete(String(n));
    }
    return this;
  }

  clearAllow()
  {
    this._allow.clear();
    return this;
  }

  listAllow()
  {
    return Array.from(this._allow.values());
  }

  setOutput(fn)
  {
    this._output = typeof fn === 'function' ? fn : console.log;
    return this;
  }

	_formatLabel(callerName)
	{
	  const now = new Date();
	
	  const dd   = String(now.getDate()).padStart(2, '0');
	  const mm   = String(now.getMonth() + 1).padStart(2, '0');
	  const yyyy = now.getFullYear();
	
	  const hh   = String(now.getHours()).padStart(2, '0');
	  const min  = String(now.getMinutes()).padStart(2, '0');
	  const ss   = String(now.getSeconds()).padStart(2, '0');
	
	  const timestamp = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
	
	  // prendo anche file e linea dal primo frame esterno
	  const frames = this.getStackFrames();
	  let file = '', line = '';
	  for (const fr of frames)
	  {
	    const name = fr.fn || 'anonymous';
	    if (!Debugger.SKIP_INTERNAL.has(name))
	    {
	      // esempio riga: "at child (http://localhost/index.html:24:3)"
	      const m = fr.raw.match(/:(\d+):\d+\)?$/);
	      if (m) line = m[1];
	      const mf = fr.raw.match(/\((.*):\d+:\d+\)$/);
	      if (mf) file = mf[1];
	      break;
	    }
	  }
	
		let res = this._labelPattern
	    .replace('{caller}', callerName)
	    .replace('{timestamp}', timestamp)
	    .replace('{mode}', this._mode)
	    .replace('{file}', file)
	    .replace('{line}', line);

		if(res == " ") res = "";

	  return res;
	}
	
	setLabelPattern(pattern)
	{
	  this._labelPattern = String(pattern || '[{caller}]');
	  if(pattern == "") this._labelPattern = "";
	  return this;
	}
	
	// nuova funzione comoda
	setLabel(style)
	{
	  switch (style)
	  {
	    case 'none':
	      return this.setLabelPattern('');
	    case 'time':
	      return this.setLabelPattern('[{timestamp}]');
	    case 'standard':
	      return this.setLabelPattern('[{timestamp}] [{caller}]');
	    case 'verbose':
	      return this.setLabelPattern('[{timestamp}] [{mode}] {caller} ({file}:{line})');
	    case 'simple':
	      return this.setLabelPattern('[{caller}]');
	    default:
	      // se non riconosciuto, lo uso diretto come pattern
	      return this.setLabelPattern(style);
	  }
	}

  log(...args)
  {
    const caller = this.getCallerName();
    if (this.shouldLog())
    {
    	let pref = this._formatLabel(caller);
    	if(pref == "") this._output(...args);
      else this._output(this._formatLabel(caller), ...args);
    }
  }

	info(...args)
	{
	  const caller = this.getCallerName();
	  if (this.shouldLog())
	  {
	    this._emitWithPrefix(`${this._icons.info} `, caller, args);
	  }
	}
	
	warn(...args)
	{
	  const caller = this.getCallerName();
	  if (this.shouldLog())
	  {
	    this._emitWithPrefix(`${this._icons.warning} `, caller, args);
	  }
	}
	
	error(...args)
	{
	  const caller = this.getCallerName();
//	  if (this.shouldLog())
	  {
	    this._emitWithPrefix(`${this._icons.error} `, caller, args);
	  }
	}

  get state()
  {
    // copia difensiva
    return {
      mode: this._mode,
      allow: new Set(this._allow)
    };
  }
}

// opzionale: istanza globale pronta all'uso
const dbg = new Debugger();
if (typeof globalThis !== 'undefined') { globalThis.dbg = dbg; }

globalThis.log   = (...args) => dbg.log  (...args);
globalThis.info  = (...args) => dbg.info (...args);
globalThis.error = (...args) => dbg.error(...args);
globalThis.warn  = (...args) => dbg.warn (...args);



/*

import fs from 'fs';

dbg.setOutput((...args) =>
{
  const line = args.map(String).join(' ') + '\n';
  fs.appendFileSync('debug.log', line);
});

*/



/* come usarlo:

nelle funzione scrivi log(...), info(...), error(...), warn(...)

questi non scrivono niente perché la classe parte di default in
dbg.setMode('none');

cambi il modo con
dbg.setMode('all');                                      // sempre stampa
dbg.setMode('none');                                     // sempre silenzio
dbg.setMode('stack').clearAllow().allow('function');     // permette solo le funzioni elencate e tutti i loro figli nello stack
dbg.setMode('allowlist').clearAllow().allow('function'); // permette solo le funzioni elencate

stabilisci le etichette con
dbg.setLabel("none");
dbg.setLabel("time");
dbg.setLabel("standard");
dbg.setLabel("verbose");
dbg.setLabel("simple");

altrimenti puoi formarla tu


*/


/*

//tests:

// funzioni di prova

// 1) mode 'stack': abilito 'parent' e loggheranno anche child/grandchild quando discendono da parent
dbg.setMode('stack').clearAllow().allow('parent');
parent();   // → stampa (perché 'parent' è nello stack)
child();    // → non stampa (stack non contiene 'parent')

// 2) mode 'allowlist': solo il chiamante diretto deve essere nella allowlist
dbg.setMode('allowlist').clearAllow().allow('grandchild');
parent();   // → NON stampa (chiamante diretto di dbg.log è 'grandchild'? sì ⇒ stampa)
            // Nota: in questo caso sì, perché dbg.log è chiamato da grandchild.

// 3) mode 'all' / 'none'
dbg.setMode('all');  parent();   // sempre stampa
dbg.setMode('none'); parent();   // sempre silenzio

// 4) personalizzazioni
dbg.setLabelPattern('[DBG:{caller}]');
dbg.setOutput((...a) => console.debug(...a));

*/







// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ mailer API
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Invia una mail tramite POST /api/mail/json/sendmail
 * @param {string} from
 * @param {string|string[]} to
 * @param {string|string[]} cc
 * @param {string|string[]} bcc
 * @param {string} object  // oggetto
 * @param {string} body    // testo/HTML
 * @param {string|string[]} attachment // percorsi file lato server
 * @param {Object} [opts]
 * @param {string} [opts.endpoint]          // default: window.MAIL_API_ENDPOINT || '/api/mail/json/sendmail'
 * @param {string} [opts.token]             // override di user.token (opzionale)
 * @param {string} [opts.authScheme='Bearer'] // usato se il token NON contiene già lo schema
 * @param {number} [opts.timeoutMs=15000]
 * @returns {Promise<{ok:boolean,status:number,headers:Object,data:any,raw:string}>}
 */


//async function SendMail(from, to, cc, bcc, object, body, attachment, opts = {}) 
export async function SendMail(from, to, cc, bcc, object, body, attachment) 
{
  let opts = {endpoint: "https://giallocolfert.com:3000/api/mail/json/sendmail", token: "Bearer pippopippo", authScheme: "Bearer", timeoutMs: 30000 };
  to = to.replaceAll(';',',');
  cc = cc.replaceAll(';',',');
  bcc = bcc.replaceAll(';',',');
  attachment = attachment.replaceAll(';',',');
//  let opts = {endpoint: "http://localhost:3000/api/mail/json/sendmail", token: "Bearer pippopippo", authScheme: "Bearer", timeoutMs: 30000 };
  const endpoint = (opts.endpoint ?? (typeof window !== 'undefined' && window.MAIL_API_ENDPOINT)) || '/api/mail/json/sendmail';

  const headers = { 'Content-Type': 'application/json' };

  // Token da user.token (globale) a meno che non venga passato in opts
  const rawToken = opts.token ?? ((typeof user !== 'undefined' && user && user.token) ? user.token : undefined);
  if (rawToken) {
    // Se il token contiene già uno schema (es. "Bearer x" o "Token x"), lo uso così com'è
    // altrimenti applico lo schema di default
    const hasScheme = /\s/.test(rawToken);
    const scheme = opts.authScheme ?? 'Bearer';
    headers['Authorization'] = hasScheme ? rawToken : `${scheme} ${rawToken}`;
  }

  const normalizeList = (v) => {
    if (Array.isArray(v)) {
      v = v.join(',');
    }
    return String(v ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      // deduplica preservando l'ordine
      .filter((item, idx, arr) => arr.indexOf(item) === idx);
  };

  const payload = {
    from: (from ?? '').trim(),
    to: normalizeList(to),
    cc: normalizeList(cc),
    bcc: normalizeList(bcc),
    object: (object ?? '').trim(),
    body: body ?? '',
    attachment: normalizeList(attachment)
  };

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const tmo = setTimeout(() => controller && controller.abort(), opts.timeoutMs ?? 15000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      ...(controller ? { signal: controller.signal } : {})
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    // Ritorno sempre un oggetto strutturato (non lancio eccezione su HTTP error) // anche no
/*
    return {
      ok: res.ok,
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      data,
      raw: text
    };
*/
    return data;
  } catch (err) {
    return {
      ok: false,
      status: 0,
      headers: {},
      data: `Network error: ${err && err.message ? err.message : String(err)}`,
      raw: ''
    };
  } finally {
    clearTimeout(tmo);
  }
}

// (facoltativo) esportazione o aggancio al global
if (typeof globalThis !== 'undefined') globalThis.SendMail = SendMail;






/*


// opzionale: endpoint custom
window.MAIL_API_ENDPOINT = 'http://localhost:3000/api/mail/json/sendmail';

// altrove, dopo il login:
user = { token: 'abc123' }; // o 'Bearer abc123' se vuoi forzare lo schema

const res = await SendMail(
  'mittente@dominio.it',
  ['dest1@dom.it', 'dest2@dom.it'],          // to
  'cc1@dom.it, cc2@dom.it',                  // cc anche come stringa
  [],                                        // bcc
  'Oggetto di prova',
  '<b>Hello</b> world',
  'C:\\docs\\file1.pdf, /var/data/file2.txt' // attachment misto
);

if (res.ok) {
  console.log('OK', res.data);
} else {
  console.error('Errore', res.status, res.data);
}

*/









// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ user API
// ------------------------------------------------------------------------------------------------------------------------------------------------------------


/**
 * Esegue il login contro POST /api/colfert/login.
 * - Usa un token "di applicazione" nell'header Authorization (se fornito)
 * - Se la risposta contiene un token utente, lo imposta in user.token
 *
 * @param {string} name      // id/email/username (mappato su "id")
 * @param {string} password
 * @param {string} app       // es. "colfertapitest"
 * @param {Object} [opts]
 * @param {string} [opts.endpoint]     // default: window.LOGIN_API_ENDPOINT || '/api/colfert/login'
 * @param {string} [opts.token]        // token per Authorization della rotta di login (app token)
 * @param {string} [opts.authScheme='Token'] // schema usato se opts.token non lo include già
 * @param {number} [opts.timeoutMs=15000]
 * @param {boolean} [opts.setGlobal=true]    // se true, scrive user.token con il token restituito
 * @returns {Promise<{ok:boolean,status:number,headers:Object,data:any,raw:string,token?:string}>}
 */
export async function Login(name, password, app) 
{
  let opts = {endpoint: "https://giallocolfert.com:3000/api/colfert/login", token: "Token J5y8e2a5ivcUAS4hRnO6PwiQnX5DR0tH", authScheme: "Token", timeoutMs: 15000, setGlobal: false};
//  let opts = {endpoint: "http://localhost:3000/api/colfert/login", token: "Token J5y8e2a5ivcUAS4hRnO6PwiQnX5DR0tH", authScheme: "Token", timeoutMs: 15000, setGlobal: false};
  const endpoint = (opts.endpoint ?? (typeof window !== 'undefined' && window.LOGIN_API_ENDPOINT)) || '/api/colfert/login';

  const headers = { 'Content-Type': 'application/json' };

  // Token "di applicazione" per la LOGIN route (se previsto dal backend)
  const appToken =
    opts.token ??
    ((typeof window !== 'undefined' && window.LOGIN_APP_TOKEN) || undefined) ??
    ((typeof user !== 'undefined' && user && user.appToken) || undefined);

  if (appToken) {
    const hasScheme = /\s/.test(appToken);      // se contiene già "Token " o "Bearer "
    const scheme = opts.authScheme ?? 'Token';  // nel tuo esempio era "Token ..."
    headers['Authorization'] = hasScheme ? appToken : `${scheme} ${appToken}`;
  }

  const payload = {
    id: (name ?? '').trim(),     // il backend si aspetta "id"
    password: password ?? '',
    app: (app ?? '').trim()
  };

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const tmo = setTimeout(() => controller && controller.abort(), opts.timeoutMs ?? 15000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      ...(controller ? { signal: controller.signal } : {})
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    // prova a ricavare un token dalla risposta (nomi comuni)
    let returnedToken;
    if (data && typeof data === 'object') {
      returnedToken = data.token || data.access_token || data.jwt || data.id_token;
    }

    // imposta user.token se richiesto
    if ((opts.setGlobal ?? true) && returnedToken) {
      // non forzo lo schema: se la risposta lo include, lo mantengo;
      // altrimenti user.token sarà solo il valore raw (SendMail aggiungerà lo schema se serve).
      if (typeof window !== 'undefined') {
        window.user = window.user || {};
        window.user.token = returnedToken;
      } else if (typeof globalThis !== 'undefined') {
        globalThis.user = globalThis.user || {};
        globalThis.user.token = returnedToken;
      }
    }
/*
    return {
      ok: res.ok,
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      data,
      raw: text,
      token: returnedToken
    };
*/
    return data;
  } catch (err) {
    return {
      ok: false,
      status: 0,
      headers: {},
      data: `Network error: ${err && err.message ? err.message : String(err)}`,
      raw: ''
    };
  } finally {
    clearTimeout(tmo);
  }
}

// (facoltativo) export/aggancio globale
if (typeof globalThis !== 'undefined') globalThis.LoginApi = Login;


// Logout locale: non naviga, non cambia pagina.
export function logoutLocal() 
{
  try 
  {
    localStorage.removeItem('juggler.remember'); // credenziali remember
    localStorage.removeItem('user');             // se salvi uno user persistente
  } catch (e) 
  {
    // opzionale: logga o ignora
    console.warn('logoutLocal:', e);
  }
  globalThis.user = null; // azzera la globale
  return true;            // semplice esito
}
if (typeof globalThis !== 'undefined') globalThis.logoutLocal = logoutLocal;


/*

<script>
  // Token "di applicazione" richiesto dalla rotta di login:
  window.LOGIN_APP_TOKEN = "Token J5y8e2a5ivcUAS4hRnO6PwiQnX5DR0tH";
  window.LOGIN_API_ENDPOINT = "http://localhost:3000/api/colfert/login";

  async function DoLogin() {
    const id = document.getElementById('par_id').value;
    const pw = document.getElementById('par_password').value;

    const res = await Login(id, pw, 'colfertapitest'); // usa endpoint e token globali di cui sopra
    setResult(res.data);

    // Se tutto ok, da ora user.token è valorizzato e puoi usare SendMail(...)
    console.log('user.token:', (window.user && window.user.token) || '(non impostato)');
  }
</script>


*/











