import { Menu, User, BadgeQuestionMark, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoSVG from '../assets/colfert.svg';
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import PopupProfilo from "./profilo-popup";

function Header({ toggleSidebar }) {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isSquarePlusOpen, setIsSquarePlusOpen] = useState(false);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfilo, setShowProfilo] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const tornaLogin = () => {
        ["savedUsername", "savedPassword", "user-role", "email", "permissions", "name"].forEach(k => localStorage.removeItem(k));
        localStorage.setItem('isLoggedIn', false);
        navigate('/');
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
        <header
            className="shadow-md py-3 px-4 flex items-center justify-between transition-all duration-200"
            style={{ backgroundColor: "rgb(255,186,0)" }}
        >
            {/* Pulsante Sidebar */}
            <button
                className="cursor-pointer p-2 rounded-full hover:bg-yellow-400 transition-colors"
                onClick={toggleSidebar}
            >
                <Menu className="w-6 h-6 text-gray-800" />
            </button>

            {/* Icone + Logo */}
            <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
                <SquarePlus
                    className="w-7 h-7 text-gray-800 cursor-pointer hover:text-gray-600 transition"
                    onClick={() => setIsSquarePlusOpen(prev => !prev)}
                />
                <BadgeQuestionMark
                    className="w-7 h-7 text-gray-800 cursor-pointer hover:text-gray-600 transition"
                    onClick={() => setIsHelpOpen(prev => !prev)}
                />
                <User
                    className="w-7 h-7 text-gray-800 cursor-pointer hover:text-gray-600 transition"
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                />
                <img src={LogoSVG} alt="Colfert Logo" className="w-12 h-12 ml-2" />

                {/* Dropdown Profilo */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-44 w-44 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                        <button disabled className="w-full text-left px-4 py-2 text-gray-600 bg-gray-100 font-medium">
                            👋 Ciao {localStorage.getItem("name")?.split(" ")[0] || ""}
                        </button>
                        <button onClick={() => setShowProfilo(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                            Il mio profilo
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 font-semibold" onClick={tornaLogin}>
                            Logout
                        </button>
                    </div>
                )}

                {/* Popup HELP */}
                {isHelpOpen && (
                    <div className="fixed top-[20%]  left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-gray-300 p-8 rounded-2xl shadow-2xl w-[500px] text-center animate-scaleIn">
                            <h3 className="text-xl font-bold mb-3 text-gray-800">HELP</h3>
                            <p className="text-gray-700 mb-6">
                                Scarica il manuale utente contenente tutte le informazioni relative all'utilizzo del sito.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                                    onClick={() => setIsHelpOpen(false)}
                                >
                                    Chiudi
                                </button>
                                <button
                                    className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                                    onClick={downloadPDF}
                                >
                                    Scarica PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Popup Aggiungi Permesso */}
                {isSquarePlusOpen && (
                    <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-gray-300 p-8 rounded-2xl shadow-2xl w-[600px] text-center animate-scaleIn">
                            <h3 className="text-lg font-bold underline mb-4 text-gray-800">
                                Aggiungi nuovo permesso
                            </h3>
                            <div className="flex gap-3 mb-6">
                                <input
                                    type="text"
                                    placeholder="nome.cognome@colfert.com"
                                    value={input1}
                                    onChange={(e) => setInput1(e.target.value)}
                                    className="w-3/4 px-3 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="codice query..."
                                    value={input2}
                                    onChange={(e) => setInput2(e.target.value)}
                                    className="w-1/4 px-3 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
                                />
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                                    onClick={() => setIsSquarePlusOpen(false)}
                                >
                                    Chiudi
                                </button>
                                <button
                                    className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                                    onClick={() => {
                                        console.log('Input1:', input1, 'Input2:', input2);
                                        setIsSquarePlusOpen(false);
                                    }}
                                >
                                    Aggiungi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Popup Profilo */}
            <PopupProfilo visible={showProfilo} onClose={() => setShowProfilo(false)} />
        </header>
    );
}

export default Header;
