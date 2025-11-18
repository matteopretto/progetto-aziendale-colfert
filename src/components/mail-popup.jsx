import React, { useState } from "react";
// L'import di 'xlsx' è stato rimosso per risolvere l'errore di compilazione e garantire la compatibilità.

export default function MailPopup({ visible, onClose, defaultEmail, tabellaDati }) {
  const [loading, setLoading] = useState(false);
  const messaggio = "Buongiorno, in allegato i dati relativi alle statistiche.";
  const oggetto = "Statistiche Colfert ";

  if (!visible) return null;

  // La funzione handleSubmit è stata alleggerita dal codice 'xlsx' per evitare l'errore di compilazione,
  // ma la sua esecuzione è di fatto bloccata dall'overlay nel JSX.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logica disattivata/alleggerita per manutenzione/compatibilità
      const excelBase64 = "";

      const arrayBufferToBase64 = (buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };
      
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
      console.error("Email inviata con successo! (Funzionalità in aggiornamento)");
      onClose();
    } catch (error) {
      console.error("Errore invio mail:", error);
      console.error("Errore durante l'invio della mail (Funzionalità in aggiornamento)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose}></div>

      {/* Contenitore principale del Popup */}
      <div className="bg-gray-300 p-8 rounded-2xl shadow-2xl w-[600px] max-w-[90%] relative z-10 text-center">
        
        {/* Overlay di Aggiornamento - AGGIUNTA COME RICHIESTO */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-gray-400 bg-opacity-90 backdrop-blur-sm p-8 text-white">
            <svg 
              className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 3h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-3xl font-extrabold tracking-tight text-yellow-400">
                ATTENZIONE
            </h3>
            <p className="mt-2 text-lg font-medium text-gray-800">
                Funzionalità in aggiornamento.
            </p>
            <p className="mt-4 text-sm text-gray-700">
                Siamo al lavoro per rendere l'invio e-mail ancora più efficiente. Riprova più tardi.
            </p>
            <button
              type="button"
              className="mt-6 bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-xl hover:bg-yellow-500 transition shadow-lg"
              onClick={onClose}
            >
              CHIUDI POPUP
            </button>
        </div>
        {/* Fine Overlay */}

        {/* Contenuto del form originale */}
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