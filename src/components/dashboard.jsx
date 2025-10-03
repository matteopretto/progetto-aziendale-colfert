import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard({ isVisible, ordini }) {

    const exportToExcel = () => {
        if (!ordini || ordini.length === 0) return; // niente da esportare
        const ws = XLSX.utils.json_to_sheet(ordini);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `ordini.xlsx`);
    };

    return (
        isVisible ? (

            <div className="overflow-x-auto">
                <div className="flex justify-start mt-4">
                    <button
                        onClick={exportToExcel}
                        className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Esporta in Excel
                    </button>
                </div>
                <div className="bg-white rounded shadow p-6 mt-4">
     
                    <table className="min-w-max border border-gray-300 rounded justify-center">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Nome</th>
                                <th className="border px-4 py-2">Stato</th>
                                <th className="border px-4 py-2">Valore</th>
                                <th className="border px-4 py-2">Persona</th>
                                <th className="border px-4 py-2">Data</th>
                                <th className="border px-4 py-2">Prodotto</th>
                                <th className="border px-4 py-2">Quantita</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordini && ordini.length > 0 ? (
                                ordini.map((item) => (
                                    <tr key={item.id} className="text-center">
                                        <td className="border px-4 py-2">{item.id}</td>
                                        <td className="border px-4 py-2">{item.nome}</td>
                                        <td className="border px-4 py-2">{item.stato}</td>
                                        <td className="border px-4 py-2">{item.valore}</td>
                                        <td className="border px-4 py-2">{item.persona}</td>
                                        <td className="border px-4 py-2">{item.data}</td>
                                        <td className="border px-4 py-2">{item.prodotto}</td>
                                        <td className="border px-4 py-2">{item.quantita}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border px-4 py-2 text-center" colSpan="8">Nessun ordine da mostrare</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <p>Setta i filtri e vedrai i risultati</p>
        )
    );
}

export default Dashboard;
