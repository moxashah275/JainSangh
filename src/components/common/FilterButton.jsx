import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterButton({ filters, options, onChange, onClear, dataCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const dropdownRef = useRef(null);

  const hasActive = Object.values(filters || {}).some(
    (v) => v && v !== "All" && v !== "",
  );

  useEffect(() => {
    if (isOpen) setLocalFilters({ ...filters });
  }, [isOpen, filters]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    Object.keys(localFilters).forEach((key) => {
      onChange(key, localFilters[key]);
    });
    setIsOpen(false);
  };

  const handleLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            // Heuristic for "less data" as requested by user
            // If dataCount is low (<= 3) or space below is tight (< 380px),
            // we open UP if there's more space above than below.
            const isLessData = dataCount !== undefined && dataCount <= 3;
            if (isLessData || spaceBelow < 380) {
              setOpenUp(spaceAbove > spaceBelow);
            } else {
              setOpenUp(false);
            }
          }
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 px-3 h-[36px] rounded-xl border transition-all duration-200 text-[13px] font-bold shadow-sm
          ${
            hasActive
              ? "bg-teal-50 border-teal-200 text-teal-700"
              : "bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
      >
        <SlidersHorizontal
          className={`w-3.5 h-3.5 ${hasActive ? "text-teal-600" : "text-slate-400"}`}
        />
        <span>Filter</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-64 bg-white rounded-xl border border-slate-100 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 p-3.5 ${openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}>
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-50">
            <h3 className="text-[13px] font-bold text-slate-800">Filter By</h3>
            {hasActive && (
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-[10px] font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(options || []).map((opt) => (
              <div key={opt.key} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  {opt.placeholder}
                </label>

                {/* Custom Styled Select Trigger */}
                <CustomSelect
                  value={localFilters[opt.key] || ""}
                  options={[
                    { label: `All ${opt.placeholder}`, value: "" },
                    ...opt.items,
                  ]}
                  onChange={(val) => handleLocalChange(opt.key, val)}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="flex-1 px-3 py-2 bg-slate-100/80 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 bg-teal-600 text-white text-[12px] font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-md shadow-teal-50"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Custom Select Sub-Component ──

function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(
    (opt) => (typeof opt === "string" ? opt : opt.value) === value,
  );
  const selectedLabel =
    typeof selectedOption === "string" ? selectedOption : selectedOption?.label;

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => {
          if (!isOpen && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            setOpenUp(window.innerHeight - rect.bottom < 200);
          }
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg text-[13px] text-slate-700 font-medium hover:bg-slate-50 transition-all text-left"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute left-0 right-0 bg-white border border-slate-100 rounded-lg shadow-xl z-[60] py-1 max-h-48 overflow-y-auto custom-scrollbar ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
          {options.map((opt, i) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;
            const isSelected = val === value;

            return (
              <button
                key={i}
                onClick={() => {
                  onChange(val);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-[13px] transition-colors
                  ${
                    isSelected
                      ? "bg-teal-600 text-white font-bold"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
