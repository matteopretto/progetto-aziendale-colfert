import React, { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import { Sidebar } from "../components/sidebar";
import Dashboard from "../components/dashboard";
import FormFiltri2 from "../components/form-filtri2";

function MainPage() {
  const [sezioneAttiva, setSezioneAttiva] = useState("");
  const [text, setText] = useState("NON HAI SELEZIONATO NULLA PER ORA");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [ordini, setOrdini] = useState([]);
  const [filtri, setFiltri] = useState({});
  const [panelHeight, setPanelHeight] = useState(220);

  const panelRef = useRef(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const MIN_HEIGHT = 50;
  const MAX_HEIGHT = 200;

  const fetchOrdini = async (filters) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:3001/orders?${query}`);
      if (!res.ok) throw new Error("Errore fetch ordini");
      const data = await res.json();
      setOrdini(data);
    } catch (err) {
      console.error("fetchOrdini error:", err);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // --- DRAG ---
  const startDrag = (clientY) => {
    dragging.current = true;
    startY.current = clientY;
    startHeight.current = panelRef.current ? panelRef.current.offsetHeight : panelHeight;
    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";
  };

  const stopDrag = () => {
    dragging.current = false;
    document.body.style.userSelect = "";
    document.body.style.touchAction = "";
  };

  useEffect(() => {
    const onMove = (clientY) => {
      if (!dragging.current) return;
      const delta = clientY - startY.current;
      let newH = startHeight.current + delta;
      newH = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newH));
      setPanelHeight(newH);
    };

    const onMouseMove = (e) => onMove(e.clientY);
    const onTouchMove = (e) => onMove(e.touches[0].clientY);
    const onMouseUp = () => stopDrag();
    const onTouchEnd = () => stopDrag();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const handleMouseDown = (e) => startDrag(e.clientY);
  const handleTouchStart = (e) => startDrag(e.touches[0].clientY);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* HEADER */}
      <Header toggleSidebar={toggleSidebar} />

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`transition-all duration-300 ${isSidebarOpen ? "w-[21%]" : "w-0"} flex-none`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            setSezioneAttiva={setSezioneAttiva}
            setShowDashboard={setShowDashboard}
            setShowFilter={setShowFilter}
            sezioneAttiva={sezioneAttiva}
          />
        </div>

        {/* CONTENUTO */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* PANNELLO FILTRI */}
          <div
            ref={panelRef}
            style={{
              height: showFilter ? `${panelHeight}px` : `${MIN_HEIGHT}px`,
              transition: dragging.current ? "none" : "height 200ms ease",
              display: showFilter ? "block" : "none",
            }}
            className="relative bg-white shadow-lg border border-gray-200 overflow-hidden rounded-b-lg"
          >
            <div className="p-4 h-[calc(100%-1.25rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <FormFiltri2
                showFilter={showFilter}
                sezione={sezioneAttiva}
                setTxt={setText}
                setShowDashboard={setShowDashboard}
                fetchOrdini={fetchOrdini}
                onApplyFilters={setFiltri}
              />
            </div>

            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-300 border border-gray-300 rounded-t-md flex items-center justify-center cursor-ns-resize hover:bg-gray-400 transition"
              role="separator"
              aria-label="Trascina per ridimensionare"
            >
              <div className="w-12 h-[3px] bg-gray-500 rounded-full"></div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-300 w-full"></div>

          {/* DASHBOARD */}
          <div className="flex-1 overflow-x-auto bg-white rounded-xl shadow-lg p-6 min-w-[800px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {showDashboard && (
              <Dashboard
                isVisible={showDashboard}
                sezioneAttiva={sezioneAttiva}
                setSezioneAttiva={setSezioneAttiva}
                filtri={filtri}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
