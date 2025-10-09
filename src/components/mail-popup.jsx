import React, { useState } from "react";
import { SendMail } from "../libs/clientclasses";
import * as XLSX  from 'xlsx';

export default function MailPopup({ visible, onClose, defaultEmail, tabellaDati }) {
  const [loading, setLoading] = useState(false);
  const messaggio = "Buongiorno, in allegato i dati relativi alle statistiche."
  const oggetto = "Statistiche Colfert ";

  if (!visible) return null;

 const handleSubmit = async (e) => {
  e.preventDefault();

  const from = "noreply@colfert.com";
  const to = e.target.destinatario.value;
  const cc = e.target.cc.value;
  const subject = e.target.subject.value;
  const body = e.target.message.value;

  setLoading(true);

  try {
    // 🔹 Genera il file Excel in memoria
    const ws = XLSX.utils.json_to_sheet(tabellaDati); // tabellaDati passato come prop
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // 🔹 Converte in Base64
    const arrayBufferToBase64 = (buffer) => {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    const excelBase64 = arrayBufferToBase64(excelBuffer);

    // 🔹 Stringa singola formattata per SendMail
    const attachmentString = `statistiche.xlsx;${excelBase64}`;

    // 🔹 Invia
    const result = await SendMail(
      from,
      to,
      cc,
      "",
      subject,
      body,
      attachmentString // 🔹 qui NON va array, ma stringa
    );

    console.log("Risposta server:", result);
    alert("Email inviata con successo!");
    onClose(); // chiude il popup
  } catch (error) {
    console.error("Errore invio mail:", error);
    alert("Errore durante l'invio della mail");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-400 p-6 rounded shadow-lg w-2/5 max-w-3xl relative text-center">
        <h2 className="text-xl font-bold mb-4">COMPILA IL FORM</h2>

        <form className="flex flex-col items-stretch gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-black block mb-1" htmlFor="destinatario" >Destinatario*</label>
            <input
              className="w-full p-2 border bg-gray-100 rounded"
              type="email"
              id="destinatario"
              name="destinatario"
              defaultValue={defaultEmail}
              required
            />
          </div>
          <div>
            <label className="text-black block mb-1" htmlFor="subject" >Oggetto*</label>
            <input
              className="w-full p-2 border bg-gray-100 rounded"
              type="text"
              id="subject"
              name="subject"
              defaultValue={oggetto}
              required
            />
          </div>
          <div>
            <label className="text-black block mb-1" htmlFor="cc">CC</label>
            <input
              className="w-full p-2 border bg-gray-100 rounded"
              type="text"
              id="cc"
              name="cc"
            />
          </div>
          <div>
            <label className="text-black block mb-1" htmlFor="message" >Messaggio*</label>
            <textarea
              className="w-full p-2 border bg-gray-100 rounded"
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
              className="bg-[rgb(255,186,0)] px-4 py-2 text-black rounded hover:bg-blue-600"
              onClick={onClose}
            >
              CHIUDI
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-black ${loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[rgb(255,186,0)] hover:bg-blue-600"
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
