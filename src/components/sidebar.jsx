import { buildSidebarTree } from '../utils/sidebar-utils';
import React, { useState, useEffect } from 'react';
import { FileText, ListVideoIcon, SquareChevronRight, Play, ListChevronsUpDown, ListChevronsDownUp, LampFloor } from "lucide-react";


export const Sidebar = ({
    isOpen,
    setSezioneAttiva,
    setShowDashboard,
    setShowFilter,
    sezioneAttiva
}) => {
    const [menu, setMenu] = useState([]);
    const [openItems, setOpenItems] = useState(new Set());
    const [allOpen, setAllOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('/sidebar-datas.json')
            .then(res => res.json())
            .then(data => {
                const role = localStorage.getItem('user-role');
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                console.log("ORAAA", permissions);

                let filteredMenu;
                if (role === 'admin') {
                    // Admin vede tutto
                    filteredMenu = data;
                } else {
                    // Usa la funzione esterna per filtrare
                    filteredMenu = buildSidebarTree(data, permissions);
                    console.log(filteredMenu);
                }

                setMenu(filteredMenu);

                setOpenItems(new Set());
            })
            .catch(err => console.error('Errore caricamento sidebar:', err));
    }, []);

    const toggleItem = (item) => {
        setOpenItems(prev => {
            const newOpen = new Set(prev);

            if (newOpen.has(item.id)) {
                const removeDescendants = (node) => {
                    newOpen.delete(node.id);
                    if (node.children) node.children.forEach(removeDescendants);
                };
                removeDescendants(item);

                const isDescendant = (node) => {
                    if (!node.children) return false;
                    if (node.children.some(child => child.id === sezioneAttiva)) return true;
                    return node.children.some(isDescendant);
                };
                if (isDescendant(item) || item.id === sezioneAttiva) {
                    setSezioneAttiva(null);
                }
            } else {
                newOpen.add(item.id);
            }

            return newOpen;
        });
    };

    const handleClick = (sezione) => {
        setSezioneAttiva(sezione);
        setShowDashboard(false);
        setShowFilter(true);
    };

    const toggleAll = () => {
        if (allOpen) {
            setOpenItems(new Set());
            setAllOpen(false);
        } else {
            const collectIds = (items) => {
                let ids = [];
                items.forEach(item => {
                    ids.push(item.id);
                    if (item.children) ids = ids.concat(collectIds(item.children));
                });
                return ids;
            };
            setOpenItems(new Set(collectIds(menu)));
            setAllOpen(true);
        }
        setSezioneAttiva(null);
    };

    const filterMenuAndOpen = (items, term) => {
        let openIds = new Set();
        const lowerTerm = term.toLowerCase();

        const filterRec = (nodes, ancestors = []) => {
            return nodes
                .map(node => {
                    const matches = node.label.toLowerCase().includes(lowerTerm);

                    if (node.children) {
                        const filteredChildren = filterRec(node.children, [...ancestors, node.id]);

                        if (matches) {

                            return { ...node, children: node.children };
                        } else if (filteredChildren.length > 0) {

                            openIds.add(node.id);
                            return { ...node, children: filteredChildren };
                        }
                        return null;
                    }

                    return matches ? node : null;
                })
                .filter(Boolean);
        };

        const filtered = filterRec(items);
        return { filtered, openIds };
    };



    useEffect(() => {
        if (!searchTerm) return;
        const { openIds } = filterMenuAndOpen(menu, searchTerm);
        setOpenItems(openIds);
    }, [searchTerm, menu]);

    const renderMenu = (items, level = 0) => (
        <ul className={`${level > 0 ? 'ml-8 mt-1 space-y-1' : ''}`}>
            {items.map(item => {
                const isSelected = sezioneAttiva === item.id;
                const containsSearch = searchTerm && item.label.toLowerCase().includes(searchTerm.toLowerCase());
                const iconColor = containsSearch ? 'text-white' : (isSelected ? 'text-white' : 'text-black');

                return (
                    <li key={item.id}>
                        {item.children ? (
                            <div
                                className={`flex items-center space-x-2 px-2 py-1 cursor-pointer font-bold rounded
                                ${isSelected ? 'text-white' : 'hover:bg-gray-500'}`}
                                onClick={() => toggleItem(item)}
                            >
                                <ListVideoIcon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                                <span className="text-lg whitespace-normal  break-words">{item.label}</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleClick(item.id)}
                                className={`w-full flex items-center space-x-2 px-2 py-1 rounded
                                ${isSelected ? 'text-white' : 'hover:bg-gray-500'}`}
                            >
                                <SquareChevronRight className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                                <div className="px-2 py-1 italic rounded-md border border-black bg-gray-400 whitespace-normal break-words">
                                  {item.label}
                                </div>
                            </button>
                        )}

                        {item.children && openItems.has(item.id) && renderMenu(item.children, level + 1)}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div
            className={`bg-gray-400 text-black w-full h-screen px-2 absolute inset-y-0 left-0 transform transition-transform duration-200 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative overflow-y-auto scrollbar scrollbar-thin`}
        >
            <div className="flex items-center justify-end mb-1">
                <button onClick={toggleAll} className="p-2 rounded hover:bg-gray-500">
                    {allOpen ? <ListChevronsDownUp className="w-6 h-6" /> : <ListChevronsUpDown className="w-6 h-6" />}
                </button>
            </div>

            <div className="px-2 mb-1">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Filtra..."
                    className="w-full px-2 py-1 rounded border border-black focus:outline-none"
                />
            </div>



            <nav>{menu.length > 0 && renderMenu(searchTerm ? filterMenuAndOpen(menu, searchTerm).filtered : menu)}</nav>
        </div>
    );
};
