import { Menu, User, BadgeQuestionMark, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoSVG from '../assets/colfert.svg';
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

function Header({ toggleSidebar }) {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [isSquarePlusOpen, setIsSquarePlusOpen] = useState(false);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const toggleHelp = () => setIsHelpOpen(prev => !prev);
    const toggleSquarePlus = () => setIsSquarePlusOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function tornaLogin() {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
        localStorage.removeItem('user-role');
        localStorage.removeItem('email');
        localStorage.removeItem('permissions');
        navigate('/');
    }

    const closeHelp = () => setIsHelpOpen(false);
    const closeSquarePlus = () => setIsSquarePlusOpen(false);

    const handleSend = () => {
        console.log('Input 1:', input1);
        console.log('Input 2:', input2);
        // qui puoi aggiungere la logica per inviare i dati
        closeSquarePlus();
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("HELP DOCUMENT", 20, 20);
        doc.setFontSize(12);
        doc.text("Per accedere utilizza le tue credenziali aziendali.", 20, 40);
        doc.text("Per ogni problema contatta l'ufficio IT.", 20, 50);
        doc.save("help.pdf");
    };

    return (
        <header className="shadow py-4 px-4 flex items-center justify-between" style={{ backgroundColor: "rgb(255,186,0)" }}>
            <button className="cursor-pointer" onClick={toggleSidebar}>
                <Menu className="w-6 h-6 text-gray-800" />
            </button>

            <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
                <SquarePlus className="w-8 h-8 text-gray-800 cursor-pointer" onClick={toggleSquarePlus} />
                <BadgeQuestionMark className="w-8 h-8 text-gray-800 cursor-pointer" onClick={toggleHelp} />
                <User className="w-8 h-8 text-gray-800 cursor-pointer" onClick={toggleDropdown} />
                <img src={LogoSVG} alt="Colfert Logo" className="w-12 h-12" />

                {isSquarePlusOpen && (
                    <div className="fixed inset-0 flex items-start justify-center z-50">
                        <div className="bg-gray-400 p-6 rounded shadow-lg w-1/2 text-center relative mt-[3%]">
                            <h3 className="text-lg font-bold underline mb-4">AGGIUNGI NUOVO PERMESSO</h3>
                            <div className="flex gap-2 mb-4">
                                {/* Primo input */}
                                <input
                                    type="text"
                                    placeholder="nome.cognome@colfert.com"
                                    value={input1}
                                    onChange={(e) => setInput1(e.target.value)}
                                    onFocus={() => setDropdownOpen(false)} // Chiude dropdown se focus su input1
                                    className="w-4/5 px-3 py-2 rounded border border-black bg-white focus:outline-none"
                                />

                                {/* Combobox con ricerca integrata */}
                                {/* Combobox con ricerca integrata */}
                                <div className="w-1/5 relative">
                                    <input
                                        type="text"
                                        placeholder="codice query..."
                                        value={input2}
                                        onChange={async (e) => {
                                            const value = e.target.value;
                                            setInput2(value);

                                   
                                            const perms = JSON.parse(localStorage.getItem("permissions") || "[]");

                                            try {
                                                
                                                const response = await fetch("/sidebar-datas.json");
                                                const sidebarData = await response.json();

                                               i
                                                const getChildren = (items, parentId) => {
                                                    for (const item of items) {
                                                        if (item.id === parentId) {
                                                            // Se il padre è trovato, restituisci tutti i suoi figli (ricorsivamente)
                                                            const collect = (nodes) => {
                                                                let ids = [];
                                                                nodes.forEach((n) => {
                                                                    ids.push(n.id);
                                                                    if (n.children) ids = ids.concat(collect(n.children));
                                                                });
                                                                return ids;
                                                            };
                                                            return item.children ? collect(item.children) : [];
                                                        } else if (item.children) {
                                                            const found = getChildren(item.children, parentId);
                                                            if (found.length > 0) return found;
                                                        }
                                                    }
                                                    return [];
                                                };

                                                // Crea una lista di permessi con i figli inclusi
                                                let expandedPerms = [...perms];
                                                perms.forEach((p) => {
                                                    const children = getChildren(sidebarData, p);
                                                    expandedPerms = [...new Set([...expandedPerms, ...children])];
                                                });

                                                // Filtra i codici che contengono la query
                                                const filtered = expandedPerms.filter((p) =>
                                                    p.toLowerCase().includes(value.toLowerCase())
                                                );

                                                setFilteredPermissions(filtered);
                                                setDropdownOpen(true);
                                            } catch (err) {
                                                console.error("Errore caricamento sidebar:", err);
                                                setFilteredPermissions([]);
                                            }
                                        }}
                                        onFocus={() => {
                                            if (input2) setDropdownOpen(true);
                                        }}
                                        className="w-full px-3 py-2 rounded border border-black bg-white focus:outline-none"
                                    />

                                    {dropdownOpen && filteredPermissions.length > 0 && (
                                        <ul className="absolute z-50 w-full max-h-24 overflow-y-auto bg-white border border-black rounded mt-1 text-left">
                                            {filteredPermissions.map((perm, idx) => (
                                                <li
                                                    key={idx}
                                                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        setInput2(perm);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {perm}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </div>

                            {/* Pulsanti */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={closeSquarePlus}
                                >
                                    CHIUDI
                                </button>
                                <button
                                    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => handleSend(input1, input2)}
                                >
                                    AGGIUNGI
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Dropdown User */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-40 w-40 bg-white shadow-lg rounded border border-gray-200 z-50">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Profilo</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Impostazioni</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={tornaLogin}>Logout</button>
                    </div>
                )}

                {/* Popup HELP */}
                {isHelpOpen && (
                    <div className="fixed inset-0 flex items-start justify-center z-50 ">
                        <div className="bg-gray-400 bg-gray-300 p-6 rounded shadow-lg w-1/2 text-center relative mt-[3%]">
                            <h3 className="text-lg font-bold mb-2">HELP</h3>
                            <p>Scarica il manuale utente contenente tutte le informazioni relative all'utilizzo del sito web.</p>
                            <div className="flex justify-center space-x-4 mt-4">
                                <button
                                    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={closeHelp}
                                >
                                    CHIUDI
                                </button>
                                <button
                                    className="bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={downloadPDF}
                                >
                                    SCARICA
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </header>
    );
}

export default Header;
