import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MailPopup from './mail-popup';
import DynamicTable from './dynamic-table';

function Dashboard({ isVisible, sezioneAttiva, setSezioneAttiva, filtri }) {
  const [showPopupMail, setShowPopupMail] = useState(false);
  const [tabellaDati, setTabellaDati] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 stato ricerca

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

  // 🔹 Filtra i risultati già caricati
  const filteredData = tabellaDati.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToExcel = () => {
    // 🔹 usa filteredData per l'export, niente export se ricerca non trova risultati
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

  return isVisible ? (
    <div className="flex flex-col">
      <MailPopup
        visible={showPopupMail}
        onClose={closePopUpMail}
        defaultEmail={localStorage.getItem("email")}
        tabellaDati={filteredData}
      />

      {/* 🔹 Pulsanti, ricerca e totale risultati */}
      <div className="flex justify-between mt-4 items-center">
        <div className="flex space-x-3 items-center">
          <button
            onClick={exportToExcel}
            className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded border border-black hover:bg-blue-600 transition-colors"
          >
            Esporta in Excel
          </button>

          <button
            onClick={showPopUpMail}
            className="bg-[rgb(255,186,0)] mr-8 text-black px-4 py-2 rounded border border-black hover:bg-blue-600 transition-colors"
          >
            Invia
          </button>

          <input
            type="text"
            placeholder="Cerca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-400 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="text-gray-700 font-medium">
          Totale risultati: <span className="text-black font-bold">{filteredData.length}</span>
        </div>
      </div>

      <div>
        {query ? (
          <DynamicTable query={query} onDataLoad={setTabellaDati} filteredData={filteredData} />
        ) : (
          <p className="text-gray-500 mt-4">Seleziona una sezione per visualizzare i dati</p>
        )}
      </div>
    </div>
  ) : (
    <p>Setta i filtri e vedrai i risultati</p>
  );
}

export default Dashboard;
