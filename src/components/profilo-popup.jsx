import React, { useState, useEffect } from "react";

export default function PopupProfilo({ visible, onClose }) {
    // 🔹 Hooks sempre chiamati all'inizio
    const [permissionsData, setPermissionsData] = useState([]);
    const [selectedPermission, setSelectedPermission] = useState("");

    const email = localStorage.getItem("email") || "";
    const name = localStorage.getItem("name") || "";
    const ruolo = localStorage.getItem("user-role") || "";
    const userPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    // 🔹 Funzione ricorsiva per appiattire permessi
    const flattenPermissions = (nodes) => {
        let result = [];
        nodes.forEach(node => {
            if (node.id && node.label) result.push({ id: node.id, label: node.label });
            if (node.children) result = result.concat(flattenPermissions(node.children));
        });
        return result;
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await fetch("/sidebar-datas.json");
                const json = await res.json();
                const flat = flattenPermissions(json);
                setPermissionsData(flat);

                // Imposta permesso iniziale
                if (userPermissions.length > 0) {
                    const found = flat.find(p => p.id === userPermissions[0]);
                    setSelectedPermission(found ? found.id : flat[0].id);
                }
            } catch (err) {
                console.error("Errore caricando i permessi:", err);
            }
        };
        fetchPermissions();
    }, []);

    // 🔹 Se il popup non è visibile, non renderizzare nulla
    if (!visible) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-400 p-6 rounded shadow-lg w-2/5 max-w-3xl relative text-center">
                <h2 className="text-xl font-bold mb-4">IL MIO PROFILO</h2>

                <div className="flex flex-col items-stretch gap-4">
                    <div>
                        <label className="text-black block mb-1" htmlFor="email">Email</label>
                        <input id="email" type="text" className="w-full p-2 border bg-gray-100 rounded text-center" value={email} readOnly />
                    </div>

                    <div>
                        <label className="text-black block mb-1" htmlFor="username">Nome</label>
                        <input id="username" type="text" className="w-full p-2 border bg-gray-100 rounded text-center" value={name} readOnly />
                    </div>

                    <div>
                        <label className="text-black block mb-1" htmlFor="ruolo">Ruolo</label>
                        <input id="ruolo" type="text" className="w-full p-2 border bg-gray-100 rounded text-center" value={ruolo} readOnly />
                    </div>

                    <div>
                        <label className="text-black block mb-1" htmlFor="permissions">Permessi</label>
                        <select
                            id="permissions"
                            className="w-full p-2 border bg-gray-100 rounded text-center"
                            value={selectedPermission}
                            onChange={(e) => setSelectedPermission(e.target.value)}
                        >
                            {permissionsData.map((perm) => (
                                <option key={perm.id} value={perm.id}>
                                    {perm.id} - {perm.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={onClose}
                            className="bg-[rgb(255,186,0)] px-4 py-2 text-black rounded hover:bg-blue-600"
                        >
                            CHIUDI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
