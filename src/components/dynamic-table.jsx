import { useEffect, useState } from "react";
import { ApiSqlClient } from "../libs/classes";

export default function DynamicTable({ query, onDataLoad }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const runQuery = async () => {
      try {
        const result = await sql.openQuery(query);
        console.log("Risultato:", result);

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

  if (data.length === 0) return (
    <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
  );

return (
  <div className="overflow-x-auto mt-4 shadow-md rounded-lg max-h-[600px] overflow-y-auto">
    <table className="min-w-full text-sm rounded-lg overflow-hidden border border-black/50">
      {/* HEADER GIALLO FISSO */}
      <thead className="bg-[rgb(255,186,0)] text-black sticky top-0 z-10">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-3 py-2 text-left font-semibold uppercase tracking-wide border-b border-gray-400"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      {/* RIGHE ALTERNATE */}
      <tbody>
        {data.map((row, i) => (
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
  </div>
);


}
