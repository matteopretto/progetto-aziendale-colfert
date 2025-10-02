import { Menu } from "lucide-react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoSVG from '../assets/colfert.svg'
import { useState, useRef, useEffect } from "react";

function Header({ toggleSidebar }) {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

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
        navigate('/');
    }

    return (
        <header className="shadow py-4 px-4 flex items-center justify-between" style={{ backgroundColor: "rgb(255,186,0)" }}>

            <button className="cursor-pointer" onClick={toggleSidebar}>
                <Menu className="w-6 h-6 text-gray-800" />
            </button>

            <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
                <User className="w-8 h-8 text-gray-800 cursor-pointer" onClick={toggleDropdown} />
                <img src={LogoSVG} alt="Colfert Logo" className="w-12 h-12" />
                {isDropdownOpen && (

                    <div className="absolute right-0 mt-40 w-40 bg-white shadow-lg rounded border border-gray-200 z-50">

                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Profilo</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Impostazioni</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={tornaLogin}>Logout</button>
                    </div>
                )}
            </div>
        </header>

    );
}

export default Header;