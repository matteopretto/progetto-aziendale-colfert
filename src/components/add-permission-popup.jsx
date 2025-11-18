import { useState, useEffect, useRef } from "react";
import { ApiSqlClient } from "../libs/classes";

function AddPermissionPopup({ visible, onClose }) {
    const [email, setEmail] = useState("");
    const [emailSuggestions, setEmailSuggestions] = useState([]);
    const [emailDropdown, setEmailDropdown] = useState(false);


    const [allCodes, setAllCodes] = useState([]);
    const [filteredCodes, setFilteredCodes] = useState([]);
    const [codeDropdown, setCodeDropdown] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");


    const dropdownRef = useRef(null);
    const emailRef = useRef(null);

    const ruolo = localStorage.getItem("user-role") || "";

    const [code, setCode] = useState("");

    // --- Fetch codici
    useEffect(() => {
        if (!visible) return;

        const fetchCodes = async () => {
            if (ruolo === "admin") {
                const res = await fetch("/sidebar-datas.json");
                const data = await res.json();

                const extractCodes = (arr) => {
                    let codes = [];
                    arr.forEach(item => {
                        if (item.id) codes.push(item.id);
                        if (item.children) codes.push(...extractCodes(item.children));
                    });
                    return codes;
                };

                const codes = extractCodes(data);
                setAllCodes(codes);
                setFilteredCodes(codes);
            } else {
                const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
                setAllCodes(perms);
                setFilteredCodes(perms);
            }
        };

        fetchCodes();
    }, [visible, ruolo]);

    // --- Filtro codici
    const handleCodeChange = (value) => {
        setCode(value);
        const filtered = allCodes.filter(c =>
            c && typeof c === "string" && c.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCodes(filtered);
        setCodeDropdown(true);
    };

    const handleSelectCode = (c) => {
        setCode(c);
        setCodeDropdown(false);
    };

    // --- Fetch email
    useEffect(() => {
        if (!visible) return;

        const fetchEmails = async () => {
            try {
                const sql = new ApiSqlClient();
                const query2 = `select identifier from dash..users where role !='external' and identifier like'%@%'`;
                const result = await sql.openQuery(query2);
                const emails = Array.isArray(result) ? result.map(r => r.identifier).filter(Boolean) : [];
                setEmailSuggestions(emails);
            } catch (err) {
                console.error("Errore fetch emails:", err);
            }
        };

        fetchEmails();
    }, [visible]);

    const handleEmailChange = (value) => {
        setEmail(value);
        // Mostriamo solo email che contengono il testo digitato
        setEmailDropdown(
            emailSuggestions.filter(e =>
                e.toLowerCase().includes(value.toLowerCase())
            ).length > 0
        );
    };

    const handleSelectEmail = (e) => {
        setEmail(e);
        setEmailDropdown(false);
    };

    const handleAdd = async () => {
        if (!email || !code) {
            setInputErrorMessage("Inserisci mail e codice");
            setTimeout(() => setInputErrorMessage(""), 2500);
            return;
        }


        if (ruolo !== "admin" && !allCodes.includes(code)) {
            alert("Codice non valido");
            return;
        }

        if (!emailSuggestions.includes(email)) {
            setInputErrorMessage("Seleziona una email valida dalla lista");
            setTimeout(() => setInputErrorMessage(""), 2500);
            return;
        }

        const query = `
            INSERT INTO dash..uservalues 
            VALUES ('${email}', 'webstats', '', '${code}','', '', '', '', GETDATE(), GETDATE(), 'create', 'pc')
        `;
        const sql = new ApiSqlClient();
        
        //Decommenta la riga sotto per eseguire l'inserimento
        //await sql.openQuery(query);

        // Mostra messaggio di successo per 2 secondi
        setSuccessMessage("Operazione eseguita con successo!");
        setTimeout(() => setSuccessMessage(""), 2500);


        setCode("");
    };

    // --- Click fuori dropdown chiude
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCodeDropdown(false);
                setEmailDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-300 p-8 rounded-2xl shadow-2xl w-[600px] text-center">
                <h3 className="text-lg font-bold underline mb-4 text-gray-800">
                    Aggiungi nuovo permesso
                </h3>
                <div className="flex gap-3 mb-6 relative" ref={dropdownRef}>
                    {/* Input Email */}
                    <div className="w-3/4 relative">
                        <input
                            type="text"
                            placeholder="nome.cognome@colfert.com"
                            value={email}
                            onChange={e => handleEmailChange(e.target.value)}
                            onFocus={() => setEmailDropdown(true)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
                            required
                        />
                        {emailDropdown && emailSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full max-h-36 overflow-y-auto bg-white border border-gray-400 rounded-md z-50 text-left">
                                {emailSuggestions
                                    .filter(e => e.toLowerCase().includes(email.toLowerCase()))
                                    .slice(0, 100)
                                    .map((e, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => handleSelectEmail(e)}
                                            className="px-2 py-1 hover:bg-yellow-200 cursor-pointer"
                                        >
                                            {e}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>

                    {/* Input Codice */}
                    <div className="w-1/4 relative">
                        <input
                            type="text"

                            value={code}
                            onChange={e => handleCodeChange(e.target.value)}
                            onFocus={() => setCodeDropdown(true)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
                            required
                        />
                        {codeDropdown && filteredCodes.length > 0 && (
                            <ul className="absolute top-full left-0 w-full max-h-36 overflow-y-auto bg-white border border-gray-400 rounded-md z-50 text-left">
                                {filteredCodes.slice(0, 100).map((c, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelectCode(c)}
                                        className="px-2 py-1 hover:bg-yellow-200 cursor-pointer"
                                    >
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Messaggio di successo */}
                {successMessage && (
                    <div className="mb-4 text-green-700 font-semibold">
                        {successMessage}

                    </div>
                )}
                {inputErrorMessage && (
                    <div className="mb-4 text-red-700 font-semibold">
                        {inputErrorMessage}

                    </div>
                )}

                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                        onClick={onClose}
                    >
                        Chiudi
                    </button>
                    <button
                        className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                        onClick={handleAdd}
                    >
                        Aggiungi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddPermissionPopup;
