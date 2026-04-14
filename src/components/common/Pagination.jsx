import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function Pagination({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
}) {
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const limitOptions = [10, 20, 30, 50];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLimitOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Custom Records Per Page Selection */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-slate-400">Showing</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsLimitOpen(!isLimitOpen)}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-[13px] font-bold text-slate-500 hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all cursor-pointer min-w-[55px] justify-between shadow-sm"
          >
            <span>{recordsPerPage}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLimitOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLimitOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-slate-100 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
              {limitOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onRecordsPerPageChange(opt);
                    setIsLimitOpen(false);
                  }}
                  className={`w-full text-center py-2 text-[13px] font-bold transition-all ${
                    recordsPerPage === opt 
                    ? 'bg-teal-50 text-teal-600 border-l-2 border-teal-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Record Range Info */}
      <div className="text-[13px] text-slate-400 font-medium order-3 sm:order-2">
        {totalRecords > 0 ? (
          <>Showing {startRecord} to {endRecord} out of {totalRecords} records</>
        ) : (
          "No records found"
        )}
      </div>

      {/* Right: Page Navigation */}
      <div className="flex items-center gap-1 order-2 sm:order-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${
              currentPage === num
                ? "bg-teal-50 text-teal-600 border border-teal-200 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
