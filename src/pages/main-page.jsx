import Header from "../components/header";
import Sidebar from "../components/sidebar";
import FormFiltri from "../components/form-filtri";
import { useState } from "react";
import Dashboard from "../components/dashboard";

function MainPage() {
    const [sezioneAttiva, setSezioneAttiva] = useState("ordini");
    const [text, setText] = useState("NON HAI SELEZIONATO NULLA PER ORA");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showDashboard, setShowDashboard] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev)


    return (
        <div className=" bg-gray-100 min-h-screen">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 min-h-[calc(100vh-64px)]">
                <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"} overflow-hidden flex flex-col`}>
                    <Sidebar isOpen={isSidebarOpen} setSezioneAttiva={setSezioneAttiva} setShowDashboard={setShowDashboard} />
                </div>

                <div className="flex-1 transition-all duration-300 flex flex-col">
                    <div className=" w-full">
                        <FormFiltri sezione={sezioneAttiva} setTxt={setText} setShowDashboard={setShowDashboard} />
                    </div>
                    <div className="h-0.5 bg-black"></div>
                    <div className="bg-white rounded shadow p-6 flex-1">

                        {showDashboard && <Dashboard isVisible={showDashboard} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
