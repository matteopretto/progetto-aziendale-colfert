import { useEffect, useState } from "react";
import { ApiSqlClient } from "../libs/classes";

export default function DynamicTable({ query }) {
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
        } else {
          setColumns([]);
          setData([]);
        }
      } catch (err) {
        console.error("Errore eseguendo la query:", err);
      }
    };
    
    runQuery();
  }, [query]);

  if (data.length === 0) return(
     <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-400 text-sm">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col} className="border px-2 py-1 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col} className="border px-2 py-1">
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
