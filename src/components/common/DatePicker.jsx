import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function DatePicker({ label, value, onChange, icon: Icon = Calendar, placeholder = "Select date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOpenUp(window.innerHeight - rect.bottom < 320); // 320px is calendar height approx
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (day, monthIndex, year) => {
    const monthDigit = String(monthIndex + 1).padStart(2, '0');
    const dayDigit = String(day).padStart(2, '0');
    const formattedDate = `${dayDigit}/${monthDigit}/${year}`;
    onChange({ target: { name: "date", value: formattedDate } }); 
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">{label}</label>}
      <button 
        type="button"
        onClick={handleToggle}
        className="w-full h-[46px] bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between group hover:border-teal-500 hover:bg-white transition-all outline-none focus:ring-4 focus:ring-teal-50"
      >
        <span className={value ? "text-slate-700 font-medium" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <Icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-teal-500 transition-colors" />
      </button>

      {isOpen && (
        <div className={`absolute left-0 z-[60] w-72 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200 ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}>
           <CalendarGrid onSelect={handleSelect} initialValue={value} />
        </div>
      )}
    </div>
  );
}

// ── Internal Calendar Component ──

function CalendarGrid({ onSelect, initialValue }) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYearNow = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYearNow - i);
  
  const [viewState, setViewState] = useState("days"); 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (initialValue && typeof initialValue === 'string') {
       // Parse DD/MM/YYYY
       if (initialValue.includes('/')) {
         const parts = initialValue.split('/');
         if (parts.length === 3) {
            setSelectedDay(parseInt(parts[0]));
            setCurrentMonth(parseInt(parts[1]) - 1);
            setCurrentYear(parseInt(parts[2]));
         }
       } else {
         // Fallback for old space-separated month name format
         const parts = initialValue.split(' ');
         if (parts.length >= 3) {
           setSelectedDay(parseInt(parts[0]));
           const mIdx = months.indexOf(parts[1]);
           if (mIdx !== -1) setCurrentMonth(mIdx);
           const yVal = parseInt(parts[2]);
           if (!isNaN(yVal)) setCurrentYear(yVal);
         }
       }
    }
  }, [initialValue]);

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const days = Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-1.5">
            <button 
                onClick={() => setViewState(viewState === "months" ? "days" : "months")}
                className="text-[13px] font-bold text-slate-700 hover:text-teal-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all"
            >
                {months[currentMonth]}
            </button>
            <button 
                onClick={() => setViewState(viewState === "years" ? "days" : "years")}
                className="text-[13px] font-bold text-slate-700 hover:text-teal-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all"
            >
                {currentYear}
            </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(prev => prev - 1);
              } else {
                setCurrentMonth(prev => prev - 1);
              }
            }} 
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <button 
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(prev => prev + 1);
              } else {
                setCurrentMonth(prev => prev + 1);
              }
            }} 
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {viewState === "days" && (
        <div className="grid grid-cols-7 gap-1 animate-in fade-in duration-300">
          {["S", "m", "t", "w", "t", "f", "s"].map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-300 text-center py-2 uppercase">{d}</div>
          ))}
          {emptyDays.map(i => <div key={`e-${i}`} />)}
          {days.map(d => (
            <button
              key={d}
              onClick={() => onSelect(d, currentMonth, currentYear)}
              className={`w-8.5 h-8.5 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {viewState === "months" && (
        <div className="grid grid-cols-3 gap-2 py-2 animate-in slide-in-from-top-2 duration-300">
          {months.map((m, i) => (
            <button 
              key={m} 
              onClick={() => { setCurrentMonth(i); setViewState("days"); }}
              className={`text-[11px] font-bold py-2.5 rounded-xl border transition-all ${currentMonth === i ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-teal-200'}`}
            >
              {m.substring(0, 3)}
            </button>
          ))}
        </div>
      )}

      {viewState === "years" && (
        <div className="grid grid-cols-4 gap-2 py-2 max-h-52 overflow-y-auto no-scrollbar animate-in slide-in-from-top-2 duration-300">
          {years.map(y => (
            <button 
              key={y} 
              onClick={() => { setCurrentYear(y); setViewState("days"); }}
              className={`text-[11px] font-bold py-2.5 rounded-xl border transition-all ${currentYear === y ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-teal-200'}`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
