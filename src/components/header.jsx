import { Menu, User, BadgeQuestionMark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoSVG from '../assets/colfert.svg';
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

function Header({ toggleSidebar }) {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const toggleHelp = () => setIsHelpOpen(prev => !prev);

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
        navigate('/');
    }

    const closeHelp = () => setIsHelpOpen(false);

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
                <BadgeQuestionMark className="w-8 h-8 text-gray-800 cursor-pointer" onClick={toggleHelp} />
                <User className="w-8 h-8 text-gray-800 cursor-pointer" onClick={toggleDropdown} />
                <img src={LogoSVG} alt="Colfert Logo" className="w-12 h-12" />

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
