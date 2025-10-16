import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MailPopup from './mail-popup';
import DynamicTable from './dynamic-table';
import ExportPopup from './export-popup';
import { Expand, Shrink } from 'lucide-react';

function Dashboard({ isVisible, sezioneAttiva, setSezioneAttiva, filtri, isCompact, onToggleCompact }) {
  const [showPopupMail, setShowPopupMail] = useState(false);
  const [tabellaDati, setTabellaDati] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableColumns, setAvailableColumns] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [showExportPopup, setShowExportPopup] = useState(false);

  const showPopUpMail = () => setShowPopupMail(!showPopupMail);
  const closePopUpMail = () => setShowPopupMail(false);

  const placeholderMap = {
    dadata: "fromdate",
    adata: "todate",
  };

  const buildQueryWithFilters = (queryTemplate, filtri) => {
    if (!queryTemplate) return "";
    let queryFinale = queryTemplate;

    Object.entries(filtri || {}).forEach(([key, value]) => {
      const placeholder = `<${placeholderMap[key] || key}>`;
      if (value !== undefined && value !== null) {
        queryFinale = queryFinale.replaceAll(placeholder, value);
      }
    });

    return queryFinale;
  };


  useEffect(() => {
    if (!sezioneAttiva) return;

    const loadQuery = async () => {
      try {
        const response = await fetch('/id-queries.json');
        const data = await response.json();
        const selectedQuery = data[sezioneAttiva];

        if (selectedQuery) {
          const queryConFiltri = buildQueryWithFilters(selectedQuery, filtri);
          setQuery(queryConFiltri);
        } else {
          setQuery("");
        }
      } catch (error) {
        console.error("Errore nel caricamento di id-queries.json:", error);
      }
    };

    loadQuery();
  }, [sezioneAttiva, filtri]);

  const filteredData = tabellaDati.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(filteredData);
    ws['!cols'] = Object.keys(filteredData[0]).map((col) => {
      const maxLength = Math.max(
        col.length,
        ...filteredData.map((row) => (row[col] ? row[col].toString().length : 0))
      );
      return { wch: maxLength + 5 };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const filename = `export-statistics-${yyyy}_${mm}_${dd}.xlsx`;

    saveAs(blob, filename);
  };


  const handleExport = (selectedColumns) => {
    if (!filteredData || filteredData.length === 0) return;

    const dataToExport = filteredData.map((row) => {
      const filteredRow = {};
      selectedColumns.forEach((col) => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    ws['!cols'] = Object.keys(dataToExport[0]).map((col) => {
      const maxLength = Math.max(
        col.length,
        ...dataToExport.map((row) => (row[col] ? row[col].toString().length : 0))
      );
      return { wch: maxLength + 5 };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const filename = `export-statistics-${yyyy}_${mm}_${dd}.xlsx`;

    saveAs(blob, filename);
  };

  return isVisible ? (
    <div className="flex flex-col">
 
      <ExportPopup
        visible={showExportPopup}
        onClose={() => setShowExportPopup(false)}
        columns={availableColumns}
        onConfirm={(selectedColumns) => handleExport(selectedColumns)}
      />

      <MailPopup
        visible={showPopupMail}
        onClose={closePopUpMail}
        defaultEmail={localStorage.getItem("email")}
        tabellaDati={filteredData}
      />

      <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg bg-white">
        {/* 🔹 Header comandi */}
        <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-gray-300 to-gray-400 border-b border-gray-300">
          <div className="flex space-x-3 items-center">
            <button
              onClick={() => {
                if (tabellaDati.length > 0) {
                  setAvailableColumns(Object.keys(tabellaDati[0]));
                  setShowExportPopup(true);
                }
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 font-medium shadow-sm hover:bg-gray-100 transition-all"
            >
              📊 Esporta
            </button>

            <button
              onClick={showPopUpMail}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 font-medium shadow-sm hover:bg-gray-100 transition-all"
            >
              ✉️ Invia
            </button>

            <input
              type="text"
              placeholder="🔍 Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-white"
            />
          </div>

          {/* 🔹 Totale + pulsante expand/shrink */}
          <div className="flex items-center space-x-2 text-gray-800 text-sm font-semibold bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
            <span className="mr-1">Totale:</span> <span className="text-black font-bold">{filteredData.length}</span>
            <button
              onClick={onToggleCompact}
              className="ml-2 p-1 rounded hover:bg-gray-200 transition-all"
              title={isCompact ? "Mostra sidebar e filtri" : "Compatta tutto"}
            >
              {isCompact ? (
                <Shrink className="w-6 h-5" />
              ) : (
                <Expand className="w-6 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 🔹 Tabella */}
        <div>
          {query ? (
            <DynamicTable
              query={query}
              onDataLoad={(data) => {
                setTabellaDati(data);
                setOriginalData(data); // salvo i dati completi
              }}
              filteredData={filteredData}
            />
          ) : (
            <p className="text-gray-500 mt-4 italic text-center py-10">
              Seleziona una sezione per visualizzare i dati.
            </p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p className="text-gray-500 italic">Setta i filtri e vedrai i risultati.</p>
  );
}

export default Dashboard;
