import { data } from "react-router-dom";
import { useState } from "react";

function FormFiltri({ showFilter, sezione, setTxt, setShowDashboard, fetchOrdini }) {

    const today = new Date();
    const dataInizioDefault = `${today.getFullYear()}-01-01`;
        const dataFineDefault = today.toISOString().split("T")[0];

        const [dataInizio, setDataInizio] = useState(dataInizioDefault);
        const [dataFine, setDataFine] = useState(dataFineDefault);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target; // il form stesso

        const statoOrdine = form["stato-ordine"]?.value;
        const ordinaPer = form["ordina-per"]?.value;

        
        


        setTxt("Hai selezionato i seguenti filtri: " +
            (dataInizio ? ` Data Inizio: ${dataInizio};` : "??") +
            (dataFine ? ` Data Fine: ${dataFine};` : "??") +
            (statoOrdine ? ` Stato Ordine: ${statoOrdine};` : "??")
        );
        setShowDashboard(true)

        if (fetchOrdini) {
            await fetchOrdini({
                dataInizio,
                dataFine,
                stato: statoOrdine,
                sort: ordinaPer,
            });
        }

    }


    return (
        showFilter ? (
            <div className="bg-white p-6 rounded shadow-md w-full">

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {sezione === "ordini" && (
                        <>
                            <div>
                                <label className="mr-2 text-gray-700 mb-2" htmlFor="data-inizio">Data Inizio:</label>
                                <input className=" p-2 border border-gray-300 rounded mr-8" type="date" id="data-inizio" name="data-inizio" value={dataInizio}
                                    onChange={(e) => setDataInizio(e.target.value)} />

                                <label className=" mr-2 text-gray-700 mb-2" htmlFor="data-fine">Data Fine:</label>
                                <input className=" p-2 border border-gray-300 rounded mr-8" type="date" id="data-fine" name="data-fine" value={dataFine}
                                    onChange={(e) => setDataFine(e.target.value)} />

                                <label className=" mr-2 text-gray-700 mb-2" htmlFor="stato-ordine">Stato Ordine:</label>
                                <select className=" p-2 border border-gray-300 rounded mr-8" id="stato-ordine" name="stato-ordine">
                                    <option value="">Tutti</option>
                                    <option value="completato">Completato</option>
                                    <option value="in-lavorazione">In Lavorazione</option>
                                    <option value="annullato">Annullato</option>
                                </select>

                                <label className="mr-2 text-gray-700 mb-2 mr-2" htmlFor="ordina-per">Ordina per:</label>
                                <select
                                    className="p-2 border border-gray-300 rounded"
                                    id="ordina-per"
                                    name="ordina-per"
                                >
                                    <option value="data-desc">Data (più recente)</option>
                                    <option value="data-asc">Data (più vecchia)</option>
                                    <option value="valore-desc">Valore (decrescente)</option>
                                    <option value="valore-asc">Valore (crescente)</option>
                                </select>
                            </div>
                            <div className="flex justify-end">

                                <button className="w-1/8 bg-[rgb(255,186,0)] text-black py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center" type="submit">APPLICA</button>
                            </div>
                        </>
                    )}
                    {sezione === "clienti" && (
                        <>
                            <div>
                                <label className=" text-gray-700 mb-2 mr-2" htmlFor="data-registrazione-inizio">Data Registrazione Inizio:</label>
                                <input className=" p-2 border border-gray-300 rounded mr-8" type="date" id="data-registrazione-inizio" name="data-registrazione-inizio" />

                                <label className=" text-gray-700 mb-2 mr-2" htmlFor="data-registrazione-fine">Data Registrazione Fine:</label>
                                <input className="p-2 border border-gray-300 rounded mr-8" type="date" id="data-registrazione-fine" name="data-registrazione-fine" />

                                <label className=" text-gray-700 mb-2 mr-2" htmlFor="tipo-cliente">Tipo Cliente:</label>
                                <select className=" p-2 border border-gray-300 rounded " id="tipo-cliente" name="tipo-cliente">
                                    <option value="">Tutti</option>
                                    <option value="privato">Privato</option>
                                    <option value="azienda">Azienda</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button className="w-1/8 bg-[rgb(255,186,0)] text-black py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center" type="submit">APPLICA</button>
                            </div>

                        </>
                    )}
                    {sezione === "prodotti" && (
                        <>
                            <div>
                                <label className=" text-gray-700 mb-2 mr-8" htmlFor="categoria-prodotto">Categoria Prodotto:</label>
                                <select className="p-2 border border-gray-300 rounded mr-8" id="categoria-prodotto" name="categoria-prodotto">
                                    <option value="">Tutte</option>
                                    <option value="elettronica">Elettronica</option>
                                    <option value="abbigliamento">Abbigliamento</option>
                                    <option value="casa">Casa</option>
                                </select>


                                <label className=" text-gray-700 mb-2 mr-2" htmlFor="prezzo-minimo">Prezzo Minimo:</label>
                                <input className=" p-2 border border-gray-300 rounded mr-8" type="number" id="prezzo-minimo" name="prezzo-minimo" placeholder="0" />

                                <label className=" text-gray-700 mb-2 mr-2" htmlFor="prezzo-massimo">Prezzo Massimo:</label>
                                <input className=" p-2 border border-gray-300 rounded " type="number" id="prezzo-massimo" name="prezzo-massimo" placeholder="0" />
                            </div>
                            <div className="flex justify-end">
                                <button className="w-1/8 bg-[rgb(255,186,0)] text-black py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center" type="submit">APPLICA</button>
                            </div>
                        </>
                    )}

                </form>
            </div>) :
            (
                <div className="bg-white p-6 rounded shadow-md w-full">
                    <p>Seleziona dalla barra laterale i dati visualizzare.</p>
                </div>
            )

    );
}

export default FormFiltri;
