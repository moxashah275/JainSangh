import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

/**
 * Premium Custom TimePicker Component
 * Replicates the "spinner/wheel" style with up/down arrows as requested.
 */
export default function TimePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select Time",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const triggerRef = useRef(null);
  const portalRef = useRef(null);

  // Parse internal 24h format (HH:mm) to display parts
  const getTimeParts = () => {
    if (!value) return { hour: 7, minute: 0, period: "AM" };
    const [h, m] = value.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return { hour: displayH, minute: m || 0, period };
  };

  const { hour, minute, period } = getTimeParts();

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
      const shouldOpenUp = spaceBelow < 320 && rect.top > 320;
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: 260,
        openUp: shouldOpenUp,
      });
    }
    setIsOpen(!isOpen);
  };

  const updateTime = (newH, newM, newP) => {
    let h = newH;
    if (newP === "PM" && h < 12) h += 12;
    if (newP === "AM" && h === 12) h = 0;
    const formatted = `${String(h).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
    onChange({ target: { value: formatted } });
  };

  const adjust = (type, direction) => {
    let nh = hour, nm = minute, np = period;
    if (type === "h") {
      nh = direction === "up" ? (hour === 1 ? 12 : hour - 1) : (hour === 12 ? 1 : hour + 1);
    } else if (type === "m") {
      nm = direction === "up" ? (minute === 0 ? 59 : minute - 1) : (minute === 59 ? 0 : minute + 1);
    } else if (type === "p") {
      np = period === "AM" ? "PM" : "AM";
    }
    updateTime(nh, nm, np);
  };

  return (
    <div className={`relative min-w-[140px] ${className}`} ref={triggerRef}>
      <div
        className={`px-4 py-2.5 h-[44px] bg-white border rounded-xl text-[13px] transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm
          ${disabled ? "opacity-50 cursor-not-allowed border-slate-100 bg-slate-50" : "border-slate-200 hover:border-teal-400 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-50"}
        `}
        onClick={toggle}
      >
        <div className="flex items-center gap-2.5">
          <Clock size={16} className={`${isOpen ? "text-teal-500" : "text-slate-400"}`} />
          <span className={`font-bold ${value ? "text-slate-700" : "text-slate-400"}`}>
            {value ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}` : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-teal-500" : ""}`} />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            className={`fixed z-[11000] bg-white border border-slate-100 rounded-[24px] shadow-2xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200 ${coords.openUp ? "mb-2" : "mt-2"}`}
            style={{
              top: coords.openUp ? "auto" : coords.top,
              bottom: coords.openUp ? window.innerHeight - coords.top : "auto",
              left: coords.left,
              width: coords.width,
            }}
          >
            <div className="text-center mb-6">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Select Time</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              {/* Hours */}
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => adjust("h", "up")} className="p-1 hover:bg-teal-50 rounded-lg text-slate-300 hover:text-teal-500 transition-all"><ChevronUp size={20} /></button>
                <span className="text-slate-200 font-bold text-[14px]">{String(hour === 1 ? 12 : hour - 1).padStart(2, "0")}</span>
                <span className="text-slate-800 font-black text-[22px] py-1">{String(hour).padStart(2, "0")}</span>
                <span className="text-slate-200 font-bold text-[14px]">{String(hour === 12 ? 1 : hour + 1).padStart(2, "0")}</span>
                <button onClick={() => adjust("h", "down")} className="p-1 hover:bg-teal-50 rounded-lg text-slate-300 hover:text-teal-500 transition-all"><ChevronDown size={20} /></button>
              </div>

              <div className="text-slate-800 font-black text-[22px] mb-1 px-1">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => adjust("m", "up")} className="p-1 hover:bg-teal-50 rounded-lg text-slate-300 hover:text-teal-500 transition-all"><ChevronUp size={20} /></button>
                <span className="text-slate-200 font-bold text-[14px]">{String(minute === 0 ? 59 : minute - 1).padStart(2, "0")}</span>
                <span className="text-slate-800 font-black text-[22px] py-1">{String(minute).padStart(2, "0")}</span>
                <span className="text-slate-200 font-bold text-[14px]">{String(minute === 59 ? 0 : minute + 1).padStart(2, "0")}</span>
                <button onClick={() => adjust("m", "down")} className="p-1 hover:bg-teal-50 rounded-lg text-slate-300 hover:text-teal-500 transition-all"><ChevronDown size={20} /></button>
              </div>

              <div className="w-4"></div>

              {/* Period */}
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => adjust("p", "up")} className="p-1 hover:bg-teal-50 rounded-lg text-slate-300 hover:text-teal-500 transition-all"><ChevronUp size={20} /></button>
                <span className="text-slate-200 font-bold text-[14px] opacity-0">{period === "AM" ? "PM" : "AM"}</span>
                <span className="text-teal-600 font-black text-[20px] py-1">{period}</span>
                <span className="text-slate-200 font-bold text-[14px]">{period === "AM" ? "PM" : "AM"}</span>
                <button onClick={() => adjust("p", "down")} className="p-1 hover:bg-teal-50 rounded-lg text-slate-300 hover:text-teal-500 transition-all"><ChevronDown size={20} /></button>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-2.5 bg-teal-600 text-white rounded-xl font-bold text-[13px] hover:bg-teal-700 shadow-lg shadow-teal-100 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
