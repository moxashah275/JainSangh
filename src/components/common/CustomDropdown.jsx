import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CustomDropdown({
  value,
  onChange,
  placeholder,
  items,
  className = "",
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

  const selectedLabel = items.find((item) => {
    const itemValue = typeof item === "string" ? item : item.value;
    return String(itemValue) === String(value);
  });

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

  return (
    <div className={`relative min-w-[160px] ${className}`} ref={triggerRef}>
      <div
        className={`px-3.5 py-2.5 min-h-[44px] bg-slate-50/70 border border-slate-200 rounded-2xl text-[13px] text-slate-800 transition-all duration-200 cursor-pointer flex items-center justify-between group hover:border-teal-500 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 ${className}`}
        onClick={toggle}
      >
        <span className="truncate">
          {selectedLabel
            ? typeof selectedLabel === "string"
              ? selectedLabel
              : selectedLabel.label
            : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
        )}
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
            <div className="p-2 border-b border-slate-200 bg-slate-50/50">
              <input
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-[12px] border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all"
                autoFocus
              />
            </div>
            <ul className="py-1 max-h-60 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <li className="px-4 py-3 text-[12px] text-slate-500 italic">
                  No options found
                </li>
              ) : (
                filteredItems.map((item, index) => {
                  const itemValue =
                    typeof item === "string" ? item : item.value;
                  const itemLabel =
                    typeof item === "string" ? item : item.label;
                  const selected = String(itemValue) === String(value);
                  return (
                    <li
                      key={`${itemValue}-${index}`}
                      className={`px-4 py-2.5 text-[12px] font-medium cursor-pointer transition-all flex items-center gap-2 hover:bg-teal-50 ${
                        selected
                          ? "bg-teal-50 text-teal-700 font-bold border-l-4 border-teal-500"
                          : "text-slate-700 hover:text-teal-600"
                      }`}
                      onClick={() => {
                        onChange(itemValue);
                        setIsOpen(false);
                        setSearch("");
                      }}
                    >
                      <span className="truncate">{itemLabel}</span>
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
