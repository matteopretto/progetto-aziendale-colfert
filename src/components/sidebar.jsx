import { Home, FileText, Settings, Play } from "lucide-react";

export default function Sidebar({ isOpen, setSezioneAttiva, setShowDashboard, setShowFilter }) {
    const handleClick = (sezione) => {
        setSezioneAttiva(sezione);
        setShowDashboard(false);
        setShowFilter(true);
    };

    return (
        <div
            className={`bg-gray-400 text-black w-64 h-full space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative`}
        >
            <nav>
                {/* Ordini */}
                 <div>
                    <div className="flex items-center space-x-2 px-4 py-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-lg font-bold">ORDINI</span>
                    </div>

                    {/* Submenu sempre visibile */}
                    <div className="ml-8 mt-1 space-y-1">

                        <button
                            onClick={() => handleClick("ordini")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-1</span>
                        </button>
                        <button
                            onClick={() => handleClick("categoria2")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-2</span>
                        </button>
                        <button
                            onClick={() => handleClick("categoria3")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-3</span>
                        </button>
                    </div>
                </div>


                {/* Prodotti con sottosezione SEMPRE APERTA */}
                <div>
                    <div className="flex items-center space-x-2 px-4 py-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-lg font-bold">PRODOTTI</span>
                    </div>

                    {/* Submenu sempre visibile */}
                    <div className="ml-8 mt-1 space-y-1">

                        <button
                            onClick={() => handleClick("prodotti")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-1</span>
                        </button>
                        <button
                            onClick={() => handleClick("categoria2")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-2</span>
                        </button>
                        <button
                            onClick={() => handleClick("categoria3")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-3</span>
                        </button>
                    </div>
                </div>

                {/* Clienti */}
                <div>
                    <div className="flex items-center space-x-2 px-4 py-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-lg font-bold">CLIENTI</span>
                    </div>

                    {/* Submenu sempre visibile */}
                    <div className="ml-8 mt-1 space-y-1">

                        <button
                            onClick={() => handleClick("clienti")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-1</span>
                        </button>
                        <button
                            onClick={() => handleClick("categoria2")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-2</span>
                        </button>
                        <button
                            onClick={() => handleClick("categoria3")}
                            className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-gray-500 rounded"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-lg font-medium">Categoria-3</span>
                        </button>
                    </div>
                </div>

            </nav>
        </div>
    );
}
