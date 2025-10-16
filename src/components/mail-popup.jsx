import React, { useState } from "react";
import * as XLSX from 'xlsx';

export default function MailPopup({ visible, onClose, defaultEmail, tabellaDati }) {
  const [loading, setLoading] = useState(false);
  const messaggio = "Buongiorno, in allegato i dati relativi alle statistiche.";
  const oggetto = "Statistiche Colfert ";

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Genera file Excel
      const ws = XLSX.utils.json_to_sheet(tabellaDati);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Converte in base64
      const arrayBufferToBase64 = (buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };
      const excelBase64 = arrayBufferToBase64(excelBuffer);
      const attachmentString = `statistiche.xlsx;${excelBase64}`;

      // Chiamata API al backend
 const response = await fetch("http://localhost:3001/mail/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: e.target.destinatario.value,
    cc: e.target.cc.value,
    bcc: "",
    subject: e.target.subject.value,
    body: e.target.message.value,
    attachments: [
      { filename: "statistiche.xlsx", contentBase64: excelBase64 }
    ]
  }),
});


      const result = await response.json();
      console.log("Risposta server:", result);
      alert("Email inviata con successo!");
      onClose();
    } catch (error) {
      console.error("Errore invio mail:", error);
      alert("Errore durante l'invio della mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      <div className="bg-gray-300 p-8 rounded-2xl shadow-2xl w-[600px] max-w-[90%] relative z-10 text-center">
        <h2 className="text-lg font-bold underline mb-4 text-gray-800">
          COMPILA IL FORM
        </h2>

        <form className="flex flex-col items-stretch gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-800 block mb-1" htmlFor="destinatario">Destinatario*</label>
            <input
              className="w-full px-3 text-center py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
              type="email"
              id="destinatario"
              name="destinatario"
              defaultValue={defaultEmail}
              required
            />
          </div>
          <div>
            <label className="text-gray-800 block mb-1" htmlFor="subject">Oggetto*</label>
            <input
              className="w-full px-3 py-2 text-center rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
              type="text"
              id="subject"
              name="subject"
              defaultValue={oggetto}
              required
            />
          </div>
          <div>
            <label className="text-gray-800 block mb-1" htmlFor="cc">CC</label>
            <input
              className="w-full px-3 py-2 text-center rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
              type="text"
              id="cc"
              name="cc"
            />
          </div>
          <div>
            <label className="text-gray-800 block mb-1" htmlFor="message">Messaggio*</label>
            <textarea
              className="w-full px-3 py-2 text-center rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
              id="message"
              name="message"
              rows="4"
              defaultValue={messaggio}
              required
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
              onClick={onClose}
            >
              CHIUDI
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg font-semibold text-black ${loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 transition"
              }`}
            >
              {loading ? "INVIO IN CORSO..." : "INVIA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
