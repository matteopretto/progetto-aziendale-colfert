import React, { useState, useEffect } from "react";

export default function ExportPopup({ visible, onClose, columns, onConfirm }) {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportAll, setExportAll] = useState(true);

  useEffect(() => {
    if (columns && columns.length > 0) {
      setSelectedColumns(columns);
      setExportAll(true);
    }
  }, [columns]);

  if (!visible) return null;

  const handleCheckboxChange = (col) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== col));
      setExportAll(false);
    } else {
      const newSelection = [...selectedColumns, col];
      setSelectedColumns(newSelection);
      setExportAll(newSelection.length === columns.length);
    }
  };

  const handleExportAllChange = () => {
    if (exportAll) {
      setSelectedColumns([]);
      setExportAll(false);
    } else {
      setSelectedColumns(columns);
      setExportAll(true);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedColumns);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-300 p-8 rounded-2xl shadow-2xl w-2/5 max-w-3xl relative text-center animate-scaleIn">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 SELEZIONA COLONNE DA ESPORTARE</h2>

        {/* 🔹 Sezione centrale con grid 2 colonne */}
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-inner max-h-[320px] overflow-y-auto">
          <label className="flex items-center space-x-3 text-gray-900 font-semibold text-sm cursor-pointer hover:text-yellow-600 transition-colors mb-3">
            <input
              type="checkbox"
              className="w-5 h-5 accent-yellow-500 cursor-pointer"
              checked={exportAll}
              onChange={handleExportAllChange}
            />
            <span className="select-none">Esporta tutto</span>
          </label>

          <hr className="w-full border-gray-300 mb-4" />

          <div className="grid grid-cols-2 gap-3">
            {columns.map((col) => (
              <label
                key={col}
                className="flex items-center space-x-3 text-gray-800 text-sm cursor-pointer hover:text-yellow-500 transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-yellow-500 cursor-pointer"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleCheckboxChange(col)}
                />
                <span className="select-none">{col}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleConfirm}
            className="bg-yellow-400 px-6 py-2 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all shadow-md"
          >
            ESPORTA
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 px-6 py-2 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all shadow-sm"
          >
            ANNULLA
          </button>
        </div>
      </div>
    </div>
  );
}
