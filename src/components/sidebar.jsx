import { buildSidebarTree } from '../utils/sidebar-utils';
import React, { useState, useEffect } from 'react';
import {
  FileText,
  ListVideoIcon,
  SquareChevronRight,
  Play,
  ListChevronsUpDown,
  ListChevronsDownUp,
  LampFloor,
} from "lucide-react";

export const Sidebar = ({
  isOpen,
  setSezioneAttiva,
  setShowDashboard,
  setShowFilter,
  sezioneAttiva,
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

        let filteredMenu;
        if (role === 'admin') {
          filteredMenu = data;
        } else {
          filteredMenu = buildSidebarTree(data, permissions);
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

    const filterRec = (nodes) =>
      nodes
        .map(node => {
          const matches = node.label.toLowerCase().includes(lowerTerm);
          if (node.children) {
            const filteredChildren = filterRec(node.children);
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

    const filtered = filterRec(items);
    return { filtered, openIds };
  };

  useEffect(() => {
    if (!searchTerm) return;
    const { openIds } = filterMenuAndOpen(menu, searchTerm);
    setOpenItems(openIds);
  }, [searchTerm, menu]);

  const renderMenu = (items, level = 0) => (
    <ul className={`${level > 0 ? 'ml-5 mt-1 space-y-1 border-l border-gray-400 pl-3' : ''}`}>
      {items.map(item => {
        const isSelected = sezioneAttiva === item.id;
        const containsSearch = searchTerm && item.label.toLowerCase().includes(searchTerm.toLowerCase());

        return (
          <li key={item.id}>
            {item.children ? (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer 
                ${isSelected
                  ? 'bg-yellow-500 text-white'
                  : 'hover:bg-yellow-100 text-gray-800 transition-colors duration-150'
                }`}
                onClick={() => toggleItem(item)}
              >
                <ListVideoIcon className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            ) : (
              <button
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-left
                ${isSelected
                  ? 'bg-yellow-400 text-black font-semibold'
                  : 'bg-white hover:bg-yellow-50 text-gray-800 transition-all duration-150'
                }`}
              >
                
                <span className="italic text-sm">{item.label}</span>
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
      className={`bg-gradient-to-b from-gray-200 to-gray-300 text-black w-full h-screen px-3 py-2 absolute inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative overflow-y-auto shadow-lg border-r border-gray-400`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-700 tracking-wide">📂 Menu</h2>
        <button
          onClick={toggleAll}
          className="p-2 rounded-md bg-white border border-gray-300 hover:bg-yellow-100 transition-all"
          title={allOpen ? "Chiudi tutto" : "Apri tutto"}
        >
          {allOpen ? (
            <ListChevronsDownUp className="w-5 h-5 text-gray-700" />
          ) : (
            <ListChevronsUpDown className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      <div className="px-2 mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Filtra voci..."
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white placeholder-gray-500 text-sm"
        />
      </div>

      <nav className="text-sm">
        {menu.length > 0 &&
          renderMenu(searchTerm ? filterMenuAndOpen(menu, searchTerm).filtered : menu)}
      </nav>
    </div>
  );
};
