import Header from "../components/header";
import Sidebar from "../components/sidebar";
import FormFiltri from "../components/form-filtri";
import { useState } from "react";
import Dashboard from "../components/dashboard";
import { Sidebar2 } from "../components/sidebar2";

function MainPage() {
    const [sezioneAttiva, setSezioneAttiva] = useState("ordini");
    const [text, setText] = useState("NON HAI SELEZIONATO NULLA PER ORA");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showDashboard, setShowDashboard] = useState(false);
    const [showFilter, setShowFilter]= useState(false);

    const [ordini, setOrdini] = useState([]);

    const fetchOrdini = async (filters) => {
      const query = new URLSearchParams(filters).toString();
      console.log("Query string:", query);
      const res = await fetch(`http://localhost:3001/orders?${query}`);
      const data = await res.json();
      setOrdini(data);
    };

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev)


    return (
        <div className="flex flex-col h-screen bg-gray-100">
           
          
                <Header toggleSidebar={toggleSidebar} />
           
            <div className="flex flex-1 min-h-[calc(100vh-64px)]">
                <div className={`transition-all duration-300 ${isSidebarOpen ? "w-[21%]" : "w-0"} overflow-hidden flex flex-col`}>
                   {/* <Sidebar isOpen={isSidebarOpen} setSezioneAttiva={setSezioneAttiva} setShowDashboard={setShowDashboard} setShowFilter={setShowFilter} /> */}
                   <Sidebar2 isOpen={isSidebarOpen} setSezioneAttiva={setSezioneAttiva} setShowDashboard={setShowDashboard} setShowFilter={setShowFilter} sezioneAttiva={sezioneAttiva} />
                </div>

                <div className="flex-1 transition-all duration-300 flex flex-col">
                    <div className=" w-full">
                        <FormFiltri showFilter={showFilter} sezione={sezioneAttiva} setTxt={setText} setShowDashboard={setShowDashboard} fetchOrdini={fetchOrdini}/>
                    </div>
                    <div className="h-0.5 bg-black"></div>
                    <div className="bg-white rounded shadow p-6 flex-1">

                        {showDashboard && <Dashboard  isVisible={showDashboard} ordini={ordini} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
