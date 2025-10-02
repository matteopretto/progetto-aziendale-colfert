import { Home, FileText, Settings } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ isOpen, setSezioneAttiva, setShowDashboard }) {
     const handleClick = (sezione) => {
        setSezioneAttiva(sezione);
        setShowDashboard(false);
    };
    return (
        <div className={`bg-gray-400 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform transition-transform duration-200 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative`}>

            <nav>       
                <button 
                    onClick={() => handleClick("ordini")}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-lg font-medium">Ordini</span>
                </button>                
                <button 
                    onClick={() => handleClick("prodotti")}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded"
                >
                    <FileText className="w-5 h-5" />
                    <span className="text-lg font-medium">Prodotti</span>        
                </button>
                <button 
                    onClick={() => handleClick("clienti")}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-lg font-medium">Clienti</span>
                </button>
            </nav>
        </div>
    );
}
