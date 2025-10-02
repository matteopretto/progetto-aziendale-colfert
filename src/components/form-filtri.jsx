
function FormFiltri({ sezione, setTxt, setShowDashboard }) {


    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target; // il form stesso
        const dataInizio = form["data-inizio"]?.value;
        const dataFine = form["data-fine"]?.value;
        const statoOrdine = form["stato-ordine"]?.value;
        setTxt("Hai selezionato i seguenti filtri: " +
            (dataInizio ? ` Data Inizio: ${dataInizio};` : "??") +
            (dataFine ? ` Data Fine: ${dataFine};` : "??") +
            (statoOrdine ? ` Stato Ordine: ${statoOrdine};` : "??")
        );
        setShowDashboard(true)

    }


    return (
        <div className="bg-white p-6 rounded shadow-md w-full">

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {sezione === "ordini" && (
                    <>
                        <div>
                            <label className="mr-2 text-gray-700 mb-2" htmlFor="data-inizio">Data Inizio:</label>
                            <input className=" p-2 border border-gray-300 rounded mr-8" type="date" id="data-inizio" name="data-inizio" />

                            <label className=" mr-2 text-gray-700 mb-2" htmlFor="data-fine">Data Fine:</label>
                            <input className=" p-2 border border-gray-300 rounded mr-8" type="date" id="data-fine" name="data-fine" />

                            <label className=" mr-2 text-gray-700 mb-2" htmlFor="stato-ordine">Stato Ordine:</label>
                            <select className=" p-2 border border-gray-300 rounded" id="stato-ordine" name="stato-ordine">
                                <option value="">Tutti</option>
                                <option value="completato">Completato</option>
                                <option value="in-lavorazione">In Lavorazione</option>
                                <option value="annullato">Annullato</option>
                            </select>
                        </div>
                    </>
                )}
                {sezione === "clienti" && (
                    <>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="data-registrazione-inizio">Data Registrazione Inizio:</label>
                            <input className="w-full p-2 border border-gray-300 rounded" type="date" id="data-registrazione-inizio" name="data-registrazione-inizio" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="data-registrazione-fine">Data Registrazione Fine:</label>
                            <input className="w-full p-2 border border-gray-300 rounded" type="date" id="data-registrazione-fine" name="data-registrazione-fine" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="tipo-cliente">Tipo Cliente:</label>
                            <select className="w-full p-2 border border-gray-300 rounded" id="tipo-cliente" name="tipo-cliente">
                                <option value="">Tutti</option>
                                <option value="privato">Privato</option>
                                <option value="azienda">Azienda</option>
                            </select>
                        </div>
                    </>
                )}
                {sezione === "prodotti" && (
                    <>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="categoria-prodotto">Categoria Prodotto:</label>
                            <select className="w-full p-2 border border-gray-300 rounded" id="categoria-prodotto" name="categoria-prodotto">
                                <option value="">Tutte</option>
                                <option value="elettronica">Elettronica</option>
                                <option value="abbigliamento">Abbigliamento</option>
                                <option value="casa">Casa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="prezzo-minimo">Prezzo Minimo:</label>
                            <input className="w-full p-2 border border-gray-300 rounded" type="number" id="prezzo-minimo" name="prezzo-minimo" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="prezzo-massimo">Prezzo Massimo:</label>
                            <input className="w-full p-2 border border-gray-300 rounded" type="number" id="prezzo-massimo" name="prezzo-massimo" placeholder="0" />
                        </div>
                    </>
                )}
                <div className="flex justify-end">
                    <button className="w-1/8 bg-gray-400 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center" type="submit">APPLICA</button>
                </div>
            </form>
        </div>
    );
}

export default FormFiltri;
