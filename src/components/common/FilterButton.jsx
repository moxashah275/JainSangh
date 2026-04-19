import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterButton({ filters, options, onChange, onClear, dataCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const dropdownRef = useRef(null);

  const hasActive = Object.values(filters || {}).some(v => v && v !== "All" && v !== "");

  useEffect(() => {
    if (isOpen) setLocalFilters({ ...filters });
  }, [isOpen, filters]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    Object.keys(localFilters).forEach(key => onChange(key, localFilters[key]));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const isLessData = dataCount !== undefined && dataCount <= 3;
            setOpenUp(isLessData || spaceBelow < 380 ? spaceAbove > spaceBelow : false);
          }
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-bold shadow-sm transition-all ${
          isOpen || hasActive
            ? "bg-emerald-50 border-emerald-500 text-emerald-600"
            : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
        <span>Filter</span>
        {hasActive && (
          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
            {Object.values(filters).filter(v => v && v !== "All" && v !== "").length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-72 bg-white rounded-2xl border border-slate-100 shadow-2xl z-[100] p-5 font-sans ${openUp ? "bottom-full mb-2" : "top-full mt-3"}`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-700">Filter By</h3>
            {hasActive && (
              <button onClick={() => { onClear(); setIsOpen(false); }} className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700">
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(options || []).map(opt => (
              <div key={opt.key} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{opt.placeholder}</label>

                {/* Status key → radio buttons like Location */}
                {opt.key === "status" ? (
                  <div className="flex items-center gap-4">
                    {["", "Active", "Inactive"].map(val => {
                      const label = val === "" ? "All" : val;
                      const checked = (localFilters[opt.key] || "") === val;
                      return (
                        <label key={label} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`filter_${opt.key}`}
                            className="hidden"
                            checked={checked}
                            onChange={() => setLocalFilters(prev => ({ ...prev, [opt.key]: val }))}
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${checked ? "border-emerald-500" : "border-slate-300 group-hover:border-emerald-400"}`}>
                            {checked && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </div>
                          <span className={`text-xs font-bold capitalize ${checked ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <CustomSelect
                    value={localFilters[opt.key] || ""}
                    options={[{ label: `All ${opt.placeholder}`, value: "" }, ...opt.items]}
                    onChange={val => setLocalFilters(prev => ({ ...prev, [opt.key]: val }))}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <button onClick={() => { onClear(); setIsOpen(false); }} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
              Reset
            </button>
            <button onClick={handleApply} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
          isOpen ? "border-emerald-500 bg-white ring-4 ring-emerald-50" : "border-slate-200 bg-white hover:border-emerald-400"
        }`}
      >
        <span className="text-[13px] font-bold text-slate-700">{selected?.label || "Select"}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-emerald-500" : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute left-0 right-0 z-[110] mt-1 py-1 bg-white border border-emerald-500 rounded-xl shadow-2xl max-h-52 overflow-y-auto">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-3 py-2 text-sm font-medium cursor-pointer ${String(value) === String(opt.value) ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-emerald-50"}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
