import { useState, useEffect } from "react";
import FilterComponents from "./filters/index-filters";

function FormFiltri2({ showFilter, sezione, setTxt, setShowDashboard, fetchOrdini, onApplyFilters }) {
    const today = new Date();
    const dataInizioDefault = `${today.getFullYear()}-01-01`;
    const dataFineDefault = today.toISOString().split("T")[0];

    const [filtersList, setFiltersList] = useState([]);
    const [filtersValues, setFiltersValues] = useState({});

    useEffect(() => {
        async function loadFilters() {
            try {
                const res = await fetch("/queries-filters.json");
                const data = await res.json();
                const currentFilters = data[sezione] || [];
                setFiltersList(currentFilters);

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
        if (onApplyFilters) onApplyFilters(filtersValues);
    };


    return (
        <div className="bg-gray-50 p-3 rounded-xl shadow-md w-full overflow-y-auto custom-scroll">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              
                {/* Filtri compatti */}
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {filtersList.length === 0 ? (
                        <p className="italic text-gray-600 text-sm col-span-full">
                            Nessun filtro richiesto.
                        </p>
                    ) : (
                        filtersList.map((filterName) => {
                            const FilterComponent = FilterComponents[filterName];
                            if (!FilterComponent) return null;
                            return (
                                <div
                                    key={filterName}
                                    className="flex flex-col bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition"
                                >
                                    
                                    <FilterComponent
                                        value={filtersValues[filterName] || ""}
                                        onChange={(value) =>
                                            setFiltersValues((prev) => ({
                                                ...prev,
                                                [filterName]: value,
                                            }))
                                        }
                                    />
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pulsante piccolo */}
                <div className="flex justify-end mt-2">
                    <button
                        className="bg-[rgb(255,186,0)] hover:bg-yellow-500 text-black font-medium py-1.5 px-4 rounded-lg text-sm shadow-sm border border-gray-300 transition-all"
                        type="submit"
                    >
                        {filtersList.length > 0 ? "Applica" : "Cerca"}
                    </button>
                </div>
            </form>

            {/* Scrollbar moderna */}
            <style jsx>{`
                .custom-scroll::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background-color: #c1c1c1;
                    border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background-color: #a6a6a6;
                }
            `}</style>
        </div>
    );
}

export default FormFiltri2;
