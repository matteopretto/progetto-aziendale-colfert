import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MailPopup from './mail-popup';
import DynamicTable from './dynamic-table';

 function Dashboard({ isVisible, ordini }) {
    const [showPopupMail, setShowPopupMail] = useState(false);
    const showPopUpMail = () => setShowPopupMail(!showPopupMail);
    const closePopUpMail = () => setShowPopupMail(false);

    

    const exportToExcel = () => {
        if (!ordini || ordini.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(ordini);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `ordini.xlsx`);
    };

    const query = `select top 40 d.CodiceCliente, d.RagioneSociale, d.Indirizzo, d.Localita, d.Cap, d.Provincia, d.CodiceAgente + ' - ' + d.NomeAgente as Agente,\n (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate())-3 and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoTreAnnifa,\n (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate())-2 and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoDueAnnifa,\n (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate())-1 and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoUnAnnofa,\n (select isnull(sum(a.totriga),0) from stats..consegnato a where a.anno = year(getdate()) and d.CodiceCliente = a.CodiceCliente and a.CodiceFornitore = d.CodiceFornitore) as ConsegnatoAnnoCorrente\nfrom stats..consegnato d\nwhere d.anno >= year(getdate())-3\ngroup by d.CodiceCliente, d.RagioneSociale, d.CodiceAgente + ' - ' + d.NomeAgente, d.Indirizzo, d.Localita, d.Cap, d.Provincia, d.CodiceFornitore\norder by 1`;

    return isVisible ? (
        
        <div className="flex flex-col">
            <MailPopup
                visible={showPopupMail}
                onClose={closePopUpMail}
                defaultEmail={localStorage.getItem("email")}
            />

            {/* Pulsanti sempre visibili */}
            <div className="flex justify-start mt-4 space-x-3">
                <button
                    onClick={exportToExcel}
                    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                >
                    Esporta in Excel
                </button>
                <button
                    onClick={showPopUpMail}
                    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                >
                    Invia
                </button>
            </div>

            
           
        </div>
    ) : (
        
        <p>Setta i filtri e vedrai i risultati</p>
    );
}

export default Dashboard;
