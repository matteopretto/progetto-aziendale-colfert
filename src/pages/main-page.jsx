import Header from "../components/header";
import {Sidebar} from "../components/sidebar";
import FormFiltri from "../components/form-filtri";
import { useState } from "react";
import Dashboard from "../components/dashboard";


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
  {/* HEADER FISSO */}
  <Header toggleSidebar={toggleSidebar} />

  {/* MAIN CONTENT */}
  <div className="flex flex-1 overflow-hidden">
    {/* SIDEBAR FISSA */}
    <div className={`transition-all duration-300 ${isSidebarOpen ? "w-[21%]" : "w-0"} flex-none`}>
      <Sidebar
        isOpen={isSidebarOpen}
        setSezioneAttiva={setSezioneAttiva}
        setShowDashboard={setShowDashboard}
        setShowFilter={setShowFilter}
        sezioneAttiva={sezioneAttiva}
      />
    </div>

    {/* CONTENUTO PRINCIPALE */}
    <div className="flex-1 flex flex-col overflow-hidden">
  {/* Form filtri */}
  <FormFiltri
    showFilter={showFilter}
    sezione={sezioneAttiva}
    setTxt={setText}
    setShowDashboard={setShowDashboard}
    fetchOrdini={fetchOrdini}
  />

  {/* Linea nera SEPARATA e SEMPRE visibile */}
  <div className="h-[0.1em] bg-black w-full"></div>

  {/* Contenuto scrollabile (solo qui l’overflow) */}
  <div className="flex-1 overflow-x-auto bg-white rounded shadow p-6 min-w-[800px]">
    {showDashboard && <Dashboard isVisible={showDashboard} ordini={ordini} />}
  </div>
</div>
  </div>
</div>

    );
}

export default MainPage;
