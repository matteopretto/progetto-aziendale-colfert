import { useEffect, useState } from "react";
import { ApiSqlClient } from "../libs/classes";

export default function DynamicTable({ query, onDataLoad }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // null, "asc", "desc"

  const sql = new ApiSqlClient();

  useEffect(() => {
    const runQuery = async () => {
      try {
        const result = await sql.openQuery(query);

        if (result.length > 0) {
          setColumns(Object.keys(result[0]));
          setData(result);
          if (onDataLoad) onDataLoad(result);
        } else {
          setColumns([]);
          setData([]);
          if (onDataLoad) onDataLoad([]);
        }
      } catch (err) {
        console.error("Errore eseguendo la query:", err);
      }
    };

    runQuery();
  }, [query]);

  const handleSort = (col) => {
    let direction = "asc";
    if (sortConfig.key === col && sortConfig.direction === "asc") direction = "desc";
    else if (sortConfig.key === col && sortConfig.direction === "desc") direction = null;

    setSortConfig({ key: col, direction });

    if (!direction) {
      // reset
      setData([...data]);
    } else {
      const sorted = [...data].sort((a, b) => {
        const aVal = a[col] ?? "";
        const bVal = b[col] ?? "";
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setData(sorted);
    }
  };

  if (data.length === 0) return (
    <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="overflow-x-auto mt-4 shadow-md rounded-lg max-h-[600px] overflow-y-auto">
      <table className="min-w-full text-sm rounded-lg overflow-hidden border border-black/50">
        <thead className="bg-[rgb(255,186,0)] text-black sticky top-0 z-10">
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
          {data.map((row, i) => (
            <tr
              key={i}
              className={`${i % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200 transition-colors`}
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
    </div>
  );
}
