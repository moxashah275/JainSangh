import React, { useState, useEffect } from "react";
import { Link2, Unlink, Check, AlertTriangle } from "lucide-react";
import { getOrgData, saveOrgData, getTrustName, getSanghName } from "./orgData";
import LinkTrustSanghModal from "./forms/LinkTrustSanghModal";

export default function LinkedSanghTrust({ onDataChange }) {
  const [data, setData] = useState(() => getOrgData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const newData = getOrgData();
    setData(newData);
    if (onDataChange) {
      onDataChange({
        Trusts: newData.trusts.length,
        Sanghs: newData.sanghs.length,
        Linked: newData.links.length,
      });
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleRemoveLink = (id) => {
    const newLinks = data.links.filter((l) => l.id !== id);
    const newData = { ...data, links: newLinks };
    setData(newData);
    saveOrgData(newData);
    showToast("Link Removed Successfully");
    if (onDataChange) onDataChange({ Trusts: data.trusts.length, Sanghs: data.sanghs.length, Linked: newLinks.length });
  };

  const handleCreateLink = (trustId, sanghId) => {
    const exists = data.links.some((l) => l.trustId === Number(trustId) && l.sanghId === Number(sanghId));
    if (exists) {
      showToast("This link already exists!", "error");
      return;
    }
    const newLinks = [...data.links, { 
      id: Date.now(), 
      trustId: Number(trustId), 
      sanghId: Number(sanghId), 
      linkedAt: new Date().toISOString().split('T')[0],
      status: true 
    }];
    const newData = { ...data, links: newLinks };
    setData(newData);
    saveOrgData(newData);
    showToast("Linked Successfully!");
    setIsModalOpen(false);
    if (onDataChange) onDataChange({ Trusts: data.trusts.length, Sanghs: data.sanghs.length, Linked: newLinks.length });
  };

  return (
    <div className="w-full font-sans antialiased text-slate-600">
      {toast.show && (
        <div className="fixed top-8 right-8 z-[999] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === "error" ? "bg-rose-500 border-rose-400" : "bg-emerald-500 border-emerald-400"} text-white`}>
            <div className="p-1.5 rounded-lg bg-white/20">
              {toast.type === "error" ? <AlertTriangle size={18} className="text-white" /> : <Check size={18} strokeWidth={3} className="text-white" />}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] font-medium uppercase tracking-wide leading-none">{toast.message}</span>
              <span className="text-[9px] font-normal opacity-80 uppercase mt-1 tracking-widest">System Notification</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-700 text-sm">Manage Trust-Sangh Relations</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Connect Trusts with Sanghs to establish relationships</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-bold text-[12px] transition-all shadow-sm">
            <Link2 size={14} /> Create New Link
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
                <th className="w-1/3 px-6 py-3 text-left">Trust Name</th>
                <th className="w-1/3 px-6 py-3 text-left">Sangh Name</th>
                <th className="w-1/3 px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.links.length > 0 ? (
                data.links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="w-1/3 px-6 py-3 text-left">
                      <span className="text-sm font-semibold text-slate-700">{getTrustName(link.trustId, data.trusts)}</span>
                    </td>
                    <td className="w-1/3 px-6 py-3 text-left">
                      <span className="text-sm font-medium text-slate-600">{getSanghName(link.sanghId, data.sanghs)}</span>
                    </td>
                    <td className="w-1/3 px-6 py-3 text-center">
                      <button onClick={() => handleRemoveLink(link.id)} className="text-slate-400 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-lg" title="Remove Link">
                        <Unlink size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Link2 size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">No links found</p>
                      <p className="text-[11px] text-slate-300 mt-1">Click "Create New Link" to start</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data.links.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[11px] font-medium text-slate-400">
              Total Linked Relations: <span className="font-bold text-slate-600">{data.links.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">All links are active</span>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <LinkTrustSanghModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trusts={data.trusts}
          sanghs={data.sanghs}
          onLink={handleCreateLink}
        />
      )}
    </div>
  );
}