import { useState, useEffect } from "react";
import FilterComponents from "./filters/index-filters";

function FormFiltri2({ showFilter, sezione, setTxt, setShowDashboard, fetchOrdini }) {
    const today = new Date();
    const dataInizioDefault = `${today.getFullYear()}-01-01`;
    const dataFineDefault = today.toISOString().split("T")[0];

    const [filtersList, setFiltersList] = useState([]);
    const [filtersValues, setFiltersValues] = useState({});
    let yes=false;

    useEffect(() => {
        async function loadFilters() {
            try {
                const res = await fetch("/queries-filters.json");
                const data = await res.json();
                const currentFilters = data[sezione] || [];
                setFiltersList(currentFilters);

                // Inizializza valori di default
                const defaultValues = {};
                currentFilters.forEach(f => {
                    if (f === "dadata") defaultValues[f] = dataInizioDefault;
                    else if (f === "adata") defaultValues[f] = dataFineDefault;
                    else defaultValues[f] = "";
                });
                setFiltersValues(defaultValues);
            } catch (err) {
                console.error("Errore caricamento filtri:", err);
            }
        }

        loadFilters();
    }, [sezione]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setTxt("Hai selezionato i seguenti filtri: " + JSON.stringify(filtersValues));
        setShowDashboard(true);

        if (fetchOrdini) {
            await fetchOrdini(filtersValues);
        }
    };

    // 🔸 Dispatcher che disegna dinamicamente ogni filtro
    function renderFilter(filterName, value) {
        const handleChange = (e) =>
            setFiltersValues((prev) => ({ ...prev, [filterName]: e.target.value }));

        switch (filterName) {
            case "anno":
                return (
                    <div key={filterName}>
                        <label className="mr-2 text-gray-700">Anno:</label>
                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            className="p-2 border border-gray-300 rounded"
                            value={value || ""}
                            onChange={handleChange}
                        />
                    </div>
                );

            case "mese":
                return (
                    <div key={filterName}>
                        <label className="mr-2 text-gray-700">Mese:</label>
                        <select
                            className="p-2 border border-gray-300 rounded"
                            value={value || ""}
                            onChange={handleChange}
                        >
                            <option value="">Tutti</option>
                            {[
                                "Gennaio", "Febbraio", "Marzo", "Aprile",
                                "Maggio", "Giugno", "Luglio", "Agosto",
                                "Settembre", "Ottobre", "Novembre", "Dicembre"
                            ].map((m, i) => (
                                <option key={i + 1} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                );

            case "dadata":
            case "adata":
                return (
                    <div key={filterName}>
                        <label className="mr-2 text-gray-700">
                            {filterName === "dadata" ? "Data Inizio:" : "Data Fine:"}
                        </label>
                        <input
                            type="date"
                            className="p-2 border border-gray-300 rounded"
                            value={value || ""}
                            onChange={handleChange}
                        />
                    </div>
                );

            case "provincia":
            case "agente":
            case "classecliente":
            case "Listino":
            case "Articolo":
            case "codiceCliente":
            case "utente":
            case "settore":
            case "azienda":
            case "iban":
            case "daArticolo":
            case "adArticolo":
            case "sede":
                return (
                    <div key={filterName}>
                        <label className="mr-2 text-gray-700 capitalize">
                            {filterName}:
                        </label>
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded"
                            value={value || ""}
                            onChange={handleChange}
                        />
                    </div>
                );

            default:
                return null;
        }
    }

    if (!showFilter) {
        return (
            <div className="bg-white p-6 rounded shadow-md w-full">
                <p>Seleziona dalla barra laterale i dati da visualizzare.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded shadow-md w-full">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    <div className="flex flex-wrap gap-4">
        {filtersList.map((filterName) => {
            const FilterComponent = FilterComponents[filterName];
            if (!FilterComponent) return ( <p className="italic">Questa ricerca non necessita di filtri</p>);

            return (
                <div key={filterName} className="w-1/3">
                    <FilterComponent
                        value={filtersValues[filterName] || ""}
                        onChange={(value) =>
                            setFiltersValues((prev) => ({ ...prev, [filterName]: value }))
                        }
                    />
                </div>
            );
        })}
    </div>

    <div className="flex justify-end mt-4">
        <button
            className="w-1/8 bg-[rgb(255,186,0)] text-black py-2 px-4 rounded border border-black  hover:bg-blue-600 transition-colors text-center"
            type="submit"
        >
            {filtersList.length > 0 ? "APPLICA" : "CERCA"}
        </button>
    </div>
</form>

        </div>
    );
}

export default FormFiltri2;
