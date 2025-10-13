import { useEffect, useState, useRef } from "react";
import { ApiSqlClient } from "../libs/classes";
import { ArrowRightFromLineIcon, ArrowLeftFromLineIcon, CircleArrowLeft,CircleArrowRight } from "lucide-react";

export default function DynamicTable({ query, onDataLoad, filteredData }) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [loading, setLoading] = useState(false);

    // Paginazione
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 500;

    const sql = new ApiSqlClient();
    const tableContainerRef = useRef(null); // 🔹 ref per scroll

    useEffect(() => {
        if (!query) return;

        const runQuery = async () => {
            setLoading(true);
            try {
                const result = await sql.openQuery(query);

                if (result.length > 0) {
                    setColumns(Object.keys(result[0]));
                    setData(result);
                    if (onDataLoad) onDataLoad(result);
                    setCurrentPage(1);
                } else {
                    setColumns([]);
                    setData([]);
                    if (onDataLoad) onDataLoad([]);
                }
            } catch (err) {
                console.error("Errore eseguendo la query:", err);
            } finally {
                setLoading(false);
            }
        };

        runQuery();
    }, [query]);

    const handleSort = (col) => {
        let direction = "asc";
        if (sortConfig.key === col && sortConfig.direction === "asc") direction = "desc";
        else if (sortConfig.key === col && sortConfig.direction === "desc") direction = null;

        setSortConfig({ key: col, direction });

        let baseData = filteredData && filteredData.length > 0 ? filteredData : data;

        if (!direction) {
            if (onDataLoad) onDataLoad(baseData);
        } else {
            const sorted = [...baseData].sort((a, b) => {
                const aVal = a[col] ?? "";
                const bVal = b[col] ?? "";
                if (aVal < bVal) return direction === "asc" ? -1 : 1;
                if (aVal > bVal) return direction === "asc" ? 1 : -1;
                return 0;
            });
            if (onDataLoad) onDataLoad(sorted);
        }

        setCurrentPage(1);
    };

    const baseData = filteredData !== undefined ? filteredData : data;

    // 🔹 Reset pagina 1 e scroll in cima quando cambia filteredData
    useEffect(() => {
        setCurrentPage(1);
        if (tableContainerRef.current) tableContainerRef.current.scrollTop = 0;
    }, [filteredData]);

    // 🔹 Scroll in cima quando cambia pagina
    useEffect(() => {
        if (tableContainerRef.current) tableContainerRef.current.scrollTop = 0;
    }, [currentPage]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const paginatedRows = baseData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(baseData.length / rowsPerPage);

    if (loading && data.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div
            ref={tableContainerRef} // 🔹 ref per scroll
            className="relative overflow-x-auto mt-4 shadow-md rounded-lg max-h-[600px] overflow-y-auto"
        >
            {loading && data.length > 0 && (
                <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
                </div>
            )}

            {baseData.length === 0 && !loading ? (
                <p className="text-gray-500 p-4">Nessun dato da mostrare.</p>
            ) : (
                <>
                    <table className="min-w-full text-sm rounded-lg overflow-hidden border border-black/50">
                        <thead className="bg-[rgb(255,186,0)] text-black sticky top-0 z-0">
                            <tr>
                                {columns.map((col) => {
                                    const isSorted = sortConfig.key === col;
                                    const direction = sortConfig.direction;

                                    return (
                                        <th
                                            key={col}
                                            className="px-3 py-2 text-left font-semibold uppercase tracking-wide border border-black cursor-pointer select-none"
                                            onClick={() => handleSort(col)}
                                        >
                                            <div className="flex items-center justify-between">
                                                {col}
                                                <span className="ml-1">
                                                    {isSorted
                                                        ? direction === "asc"
                                                            ? "↑"
                                                            : "↓"
                                                        : "↑↓"}
                                                </span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedRows.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`${
                                        i % 2 === 0 ? "bg-white" : "bg-gray-100"
                                    } hover:bg-gray-200 transition-colors`}
                                >
                                    {columns.map((col) => (
                                        <td key={col} className="px-3 py-2 border-b border-gray-300">
                                            {row[col] ?? ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-2 space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(1)}
                                className="px-2 py-1 border rounded disabled:opacity-50"
                            >
                                <ArrowLeftFromLineIcon className="w-5 h-5" />
                            </button>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-2 py-1 border rounded disabled:opacity-50"
                            >
                              <CircleArrowLeft className="w-6 h-6" />
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-2 py-1 border rounded disabled:opacity-50"
                            >
                                <CircleArrowRight className="w-6 h-6" />
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-2 py-1 border rounded disabled:opacity-50"
                            >
                                <ArrowRightFromLineIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
