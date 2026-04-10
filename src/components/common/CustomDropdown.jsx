import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CustomDropdown({ value, onChange, placeholder, items, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const filteredItems = items.filter(item => {
    const label = typeof item === 'string' ? item : item.label;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  const selectedLabel = items.find(item => {
    const itemValue = typeof item === 'string' ? item : item.value;
    return String(itemValue) === String(value);
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative min-w-[160px] ${className}`} ref={dropdownRef}>
      <div
        className="px-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-[12px] text-slate-600 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50 transition-all cursor-pointer flex items-center justify-between group hover:border-slate-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedLabel ? (typeof selectedLabel === 'string' ? selectedLabel : selectedLabel.label) : placeholder}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" /> : <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />}
      </div>

      {isOpen && (
        <div className="absolute z-[1100] w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-200">
            <input
              type="text"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-50"
              autoFocus
            />
          </div>
          <ul className="py-1">
            {filteredItems.length === 0 ? (
              <li className="px-4 py-3 text-[12px] text-slate-500">No options found</li>
            ) : (
              filteredItems.map((item, index) => {
                const itemValue = typeof item === 'string' ? item : item.value;
                const itemLabel = typeof item === 'string' ? item : item.label;
                const selected = itemValue === value;
                return (
                  <li
                    key={`${itemValue}-${index}`}
                    className={`px-4 py-3 text-[12px] font-medium cursor-pointer transition-all flex items-center gap-2 hover:bg-teal-50 ${
                      selected
                        ? 'bg-teal-600 text-white border-2 border-teal-700 shadow-sm rounded-xl mx-1'
                        : 'hover:border-l-4 hover:border-teal-400 text-slate-700'
                    }`}
                    onClick={() => {
                      onChange(itemValue);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                    <span className="truncate">{itemLabel}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
