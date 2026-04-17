import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  footer,
}) {
  const scrollRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset scroll to top every time the modal opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const sizeMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    xxl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:py-10">
      <div
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeMap[size]} max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-5rem)] flex flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.38)] animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 ${title || subtitle ? "border-b border-slate-100 bg-gradient-to-r from-white via-white to-slate-50/80" : "absolute top-0 right-0 z-10"}`}
        >
          <div>
            {title && (
              <h2 className="text-[15px] font-semibold text-slate-800">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body — ref used to reset scroll on open */}
        <div
          ref={scrollRef}
          className="px-5 py-5 overflow-y-auto overflow-x-hidden scrollbar-none flex-1 bg-gradient-to-b from-white to-slate-50/40"
        >
          {children}
        </div>

        {footer && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white/90 rounded-b-[28px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
