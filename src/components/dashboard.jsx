import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MailPopup from './mail-popup';
import DynamicTable from './dynamic-table';


function Dashboard({ isVisible, ordini }) {
    const [showPopupMail, setShowPopupMail] = useState(false);
    const [tabellaDati, setTabellaDati] = useState([]);
    const showPopUpMail = () => setShowPopupMail(!showPopupMail);
    const closePopUpMail = () => setShowPopupMail(false);
const exportToExcel = () => {
    if (!tabellaDati || tabellaDati.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(tabellaDati);

    // 🔹 larghezza colonne
    ws['!cols'] = Object.keys(tabellaDati[0]).map((col) => {
        const maxLength = Math.max(
            col.length,
            ...tabellaDati.map((row) => (row[col] ? row[col].toString().length : 0))
        );
        return { wch: maxLength + 5 }; // un po' di padding
    });

    const range = XLSX.utils.decode_range(ws['!ref']);

    // 🔹 stile header
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
            fill: { fgColor: { rgb: "FFFF99" } }, // giallo
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" }
        };
    }

    // 🔹 righe alternate
    for (let R = 1; R <= range.e.r; ++R) {
        const bgColor = R % 2 === 0 ? "FFFFFF" : "F2F2F2"; // bianco / grigio chiaro
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellAddress]) continue;
            // Manteniamo eventuali stili già presenti (header)
            ws[cellAddress].s = ws[cellAddress].s || {};
            ws[cellAddress].s.fill = { fgColor: { rgb: bgColor } };
        }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `export-statistics.xlsx`);
};



    const query = `select distinct top 1000 d.CodiceCliente, d.RagioneSociale, d.Indirizzo, d.Localita, d.Cap, d.Provincia, d.CodiceAgente + ' - ' + d.NomeAgente as Agente,
        (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate())-3 and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoTreAnnifa,
        (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate())-2 and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoDueAnnifa,
        (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate())-1 and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoUnAnnofa,
        (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate()) and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoAnnoCorrente
    from stats..consegnato d
    where d.anno >= year(getdate())-3
    group by d.CodiceCliente, d.RagioneSociale, d.CodiceAgente + ' - ' + d.NomeAgente, d.Indirizzo, d.Localita, d.Cap, d.Provincia, d.CodiceFornitore
    order by 1`;

    return isVisible ? (
        <div className="flex flex-col">
            <MailPopup
                visible={showPopupMail}
                onClose={closePopUpMail}
                defaultEmail={localStorage.getItem("email")}
                tabellaDati={tabellaDati}
            />

            {/* Pulsanti sempre visibili */}
           <div className="flex justify-start mt-4 space-x-3"> 
  <button
    onClick={exportToExcel}
    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded border border-black hover:bg-blue-600 transition-colors"
  >
    Esporta in Excel
  </button>
  
  <button
    onClick={showPopUpMail}
    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded border border-black hover:bg-blue-600 transition-colors"
  >
    Invia
  </button>
</div>

            <div>
                <DynamicTable query={query} onDataLoad={setTabellaDati} /> {/* 🔹 passa setTabellaDati */}
            </div>
        </div>
    ) : (
        <p>Setta i filtri e vedrai i risultati</p>
    );
}

export default Dashboard;
