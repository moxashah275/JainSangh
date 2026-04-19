export default function UserStatusToggle({ status, onChange }) {
  const active = status === 'Active';
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={() => onChange(active ? 'Inactive' : 'Active')}
        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 focus:outline-none ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
