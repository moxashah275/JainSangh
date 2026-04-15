import React, { useState, useEffect } from "react";
import { Link2, Unlink, Check, AlertTriangle } from "lucide-react";
import { getOrgData, saveOrgData, getTrustName, getSanghName } from "./orgData";
import LinkTrustSanghModal from "./forms/LinkTrustSanghModal";

export default function LinkedSanghTrust({ onDataChange }) {
  const [data, setData] = useState(() => getOrgData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

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
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const handleRemoveLink = (id) => {
    const newLinks = data.links.filter((l) => l.id !== id);
    const newData = { ...data, links: newLinks };
    setData(newData);
    saveOrgData(newData);
    showToast("Link Removed Successfully");
    if (onDataChange)
      onDataChange({
        Trusts: data.trusts.length,
        Sanghs: data.sanghs.length,
        Linked: newLinks.length,
      });
  };

  const handleCreateLink = (trustId, sanghId) => {
    const exists = data.links.some(
      (l) => l.trustId === Number(trustId) && l.sanghId === Number(sanghId),
    );
    if (exists) {
      showToast("This link already exists!", "error");
      return;
    }
    const newLinks = [
      ...data.links,
      {
        id: Date.now(),
        trustId: Number(trustId),
        sanghId: Number(sanghId),
        status: true,
      },
    ];
    const newData = { ...data, links: newLinks };
    setData(newData);
    saveOrgData(newData);
    showToast("Linked Successfully!");
    setIsModalOpen(false);
    if (onDataChange)
      onDataChange({
        Trusts: data.trusts.length,
        Sanghs: data.sanghs.length,
        Linked: newLinks.length,
      });
  };

  return (
    <div>
      {toast.show && (
        <div className="fixed top-8 right-8 z-[999] animate-in fade-in slide-in-from-right-10 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === "error" ? "bg-rose-500 border-rose-400" : "bg-emerald-500 border-emerald-400"} text-white`}
          >
            <div className="p-1.5 rounded-lg bg-white/20">
              {toast.type === "error" ? (
                <AlertTriangle size={18} className="text-white" />
              ) : (
                <Check size={18} strokeWidth={3} className="text-white" />
              )}
            </div>
            <span className="text- font-medium uppercase tracking-wide leading-none">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-700">Manage Relations</h3>
            <p className="text-xs text-slate-500">Connect Trusts and Sanghs</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <Link2 size={16} /> Create New Link
          </button>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Trust Name</th>
                <th className="px-6 py-4 text-left">Sangh Name</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.links.length > 0 ? (
                data.links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                      {getTrustName(link.trustId, data.trusts)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {getSanghName(link.sanghId, data.sanghs)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text- font-bold uppercase">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove Link"
                      >
                        <Unlink size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No links found. Click "Create New Link" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
