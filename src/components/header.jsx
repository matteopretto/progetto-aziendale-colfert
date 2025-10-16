import { ApiSqlClient } from "../libs/classes";
import { Menu, User, BadgeQuestionMark, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoSVG from "../assets/colfert.svg";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import PopupProfilo from "./profilo-popup";
import AddPermissionPopup from "./add-permission-popup";

function Header({ toggleSidebar }) {
    const navigate = useNavigate();

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [showProfilo, setShowProfilo] = useState(false);
    const [showPopupAdd, setShowPopupAdd] = useState(false);
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfilo(false);
                setShowPopupAdd(false);
                setShowHelpPopup(false);
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const tornaLogin = () => {
        ["savedUsername", "savedPassword", "user-role", "email", "permissions", "name"].forEach(k => localStorage.removeItem(k));
        localStorage.setItem("isLoggedIn", false);
        navigate("/");
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
            className="shadow-lg py-3 px-5 flex items-center justify-between bg-yellow-400 border-b border-yellow-300 transition-all duration-300"
        >
            {/* Pulsante Sidebar */}
            <button
                className="p-2 rounded-full hover:bg-yellow-300 active:scale-95 transition-all"
                onClick={toggleSidebar}
            >
                <Menu className="w-6 h-6 text-gray-800" />
            </button>

            {/* Icone + Logo */}
            <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
                {/* Aggiungi */}
                <SquarePlus
                    className="w-7 h-7 text-gray-800 cursor-pointer hover:text-gray-700 hover:scale-110 transition-all"
                    onClick={() => setShowPopupAdd(true)}
                />

                {/* Help */}
                <BadgeQuestionMark
                    className="w-7 h-7 text-gray-800 cursor-pointer hover:text-gray-700 hover:scale-110 transition-all"
                    onClick={() => setShowHelpPopup(prev => !prev)}
                />

                {/* Profilo */}
                <User
                    className="w-7 h-7 text-gray-800 cursor-pointer hover:text-gray-700 hover:scale-110 transition-all"
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                />

                {/* Logo */}
                <img
                    src={LogoSVG}
                    alt="Colfert Logo"
                    className="w-12 h-12 ml-2 drop-shadow-md hover:scale-105 transition-transform"
                />

                {/* Popup Add Permission */}
                <AddPermissionPopup visible={showPopupAdd} onClose={() => setShowPopupAdd(false)} />

                {/* Dropdown Profilo */}
                {isDropdownOpen && (
                    <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                        <button
                            disabled
                            className="w-full text-left px-4 py-2 text-gray-600 bg-gray-100 font-semibold cursor-default"
                        >
                            👋 Ciao {localStorage.getItem("name")?.split(" ")[0] || ""}
                        </button>
                        <button
                            onClick={() => setShowProfilo(true)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                        >
                            Il mio profilo
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold transition"
                            onClick={tornaLogin}
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Popup Profilo */}
                <PopupProfilo visible={showProfilo} onClose={() => setShowProfilo(false)} />

                {/* Popup Help */}
                {showHelpPopup && (
                    <div className="fixed top-[18%] left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-[420px] text-center  border bg-gray-300 border-gray-200 animate-fadeIn">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📘 Guida Web App</h3>
                            <p className="mb-6 text-gray-600">Vuoi scaricare la guida della web app?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 transition"
                                    onClick={() => setShowHelpPopup(false)}
                                >
                                    Chiudi
                                </button>
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold bg-yellow-400 hover:bg-yellow-500 transition"
                                    onClick={downloadPDF}
                                >
                                    Scarica
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
