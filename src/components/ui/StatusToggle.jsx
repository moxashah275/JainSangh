export default function StatusToggle({ status, onToggle }) {
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 focus:outline-none ${
          status ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            status ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}