import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";

export default function CustomDropdown({
  value,
  onChange,
  placeholder,
  items,
  className = "",
  multiple = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUp: false,
  });
  const triggerRef = useRef(null);
  const portalRef = useRef(null);

  const filteredItems = items.filter((item) => {
    const label = typeof item === "string" ? item : item.label;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  const getDisplayLabel = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      const selectedItems = items.filter(item => {
        const itemValue = typeof item === "string" ? item : item.value;
        return value.includes(itemValue);
      });
      return selectedItems.map(item => typeof item === "string" ? item : item.label).join(", ");
    } else {
      const selectedItem = items.find((item) => {
        const itemValue = typeof item === "string" ? item : item.value;
        return String(itemValue) === String(value);
      });
      if (!selectedItem) return placeholder;
      return typeof selectedItem === "string" ? selectedItem : selectedItem.label;
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        (!portalRef.current || !portalRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < 250 && rect.top > 250;
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openUp: shouldOpenUp,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelection = (itemValue) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.indexOf(itemValue);
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(itemValue);
      }
      onChange(newValue);
    } else {
      onChange(itemValue);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className={`relative min-w-[160px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`} ref={triggerRef}>
      <div
        className={`px-3.5 py-2.5 min-h-[44px] bg-slate-50/70 border border-slate-200 rounded-2xl text-[13px] text-slate-800 transition-all duration-200 cursor-pointer flex items-center justify-between group hover:border-teal-500 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 ${isOpen ? 'border-teal-500 ring-2 ring-teal-50 shadow-sm' : ''} ${className}`}
        onClick={toggle}
      >
        <span className={`truncate leading-relaxed ${!value || (multiple && value.length === 0) ? 'text-slate-400 font-normal' : 'font-medium text-slate-700'}`}>
          {getDisplayLabel()}
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          {multiple && Array.isArray(value) && value.length > 0 && !disabled && (
            <div 
              className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
            >
              <X size={12} />
            </div>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
          )}
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            className={`fixed z-[11000] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${coords.openUp ? "mb-1" : "mt-1"}`}
            style={{
              top: coords.openUp ? "auto" : coords.top,
              bottom: coords.openUp ? window.innerHeight - coords.top : "auto",
              left: coords.left,
              width: coords.width,
            }}
          >
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <input
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[36px] px-3 text-[12px] border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50/50 transition-all placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <ul className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredItems.length === 0 ? (
                <li className="px-5 py-4 text-[12px] text-slate-400 italic text-center">
                  No options found
                </li>
              ) : (
                filteredItems.map((item, index) => {
                  const itemValue =
                    typeof item === "string" ? item : item.value;
                  const itemLabel =
                    typeof item === "string" ? item : item.label;
                  const isSelected = multiple 
                    ? Array.isArray(value) && value.includes(itemValue)
                    : String(itemValue) === String(value);

                  return (
                    <li
                      key={`${itemValue}-${index}`}
                      className={`px-4 py-2.5 text-[12px] font-medium cursor-pointer transition-all flex items-center justify-between group/item hover:bg-teal-50 ${
                        isSelected
                          ? "bg-teal-50/30 text-teal-700"
                          : "text-slate-600 hover:text-teal-600"
                      }`}
                      onClick={() => handleSelection(itemValue)}
                    >
                      <div className="flex items-center gap-3 truncate">
                        {multiple && (
                          <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${isSelected ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300 group-hover/item:border-teal-400'}`}>
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>
                        )}
                        <span className="truncate">{itemLabel}</span>
                      </div>
                      {!multiple && isSelected && (
                        <Check size={14} className="text-teal-500" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
