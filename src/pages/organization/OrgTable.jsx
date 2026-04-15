import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Eye, Check, AlertTriangle } from "lucide-react";
import StatusToggle from "../../components/common/StatusToggle";
import Pagination from "../../components/common/Pagination";
import TrustFormModal from "./forms/TrustFormModal";
import SanghFormModal from "./forms/SanghFormModal";
import TrustDetailsModal from "./details/TrustDetailsModal";
import SanghDetailsModal from "./details/SanghDetailsModal";
import { getOrgData, saveOrgData } from "./orgData";

export default function OrgTable({
  activeTab,
  searchTerm,
  statusFilter,
  onDataChange,
  refresh,
}) {
  const [data, setData] = useState(() => getOrgData());
  const [trustModal, setTrustModal] = useState({
    isOpen: false,
    type: "add",
    data: null,
  });
  const [sanghModal, setSanghModal] = useState({
    isOpen: false,
    type: "add",
    data: null,
  });
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
    type: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    setData(getOrgData());
    setCurrentPage(1);
  }, [refresh]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const handleSaveTrust = (formData) => {
    const newTrusts = [...data.trusts];
    if (trustModal.type === "add") {
      if (
        newTrusts.some(
          (t) => t.name.toLowerCase() === formData.name.toLowerCase(),
        )
      ) {
        showToast("Trust Name Already Exists", "error");
        return;
      }
      newTrusts.push({ ...formData, id: Date.now(), status: true });
      showToast("Trust Added Successfully");
    } else {
      const idx = newTrusts.findIndex((t) => t.id === trustModal.data.id);
      if (idx > -1) newTrusts[idx] = { ...newTrusts[idx], ...formData };
      showToast("Trust Updated Successfully");
    }
    const newData = { ...data, trusts: newTrusts };
    setData(newData);
    saveOrgData(newData);
    setTrustModal({ isOpen: false, type: "add", data: null });
    onDataChange();
  };

  const handleSaveSangh = (formData) => {
    const newSanghs = [...data.sanghs];
    if (sanghModal.type === "add") {
      if (
        newSanghs.some(
          (s) => s.name.toLowerCase() === formData.name.toLowerCase(),
        )
      ) {
        showToast("Sangh Name Already Exists", "error");
        return;
      }
      newSanghs.push({
        ...formData,
        id: Date.now(),
        status: true,
        members: formData.members || 0,
      });
      showToast("Sangh Added Successfully");
    } else {
      const idx = newSanghs.findIndex((s) => s.id === sanghModal.data.id);
      if (idx > -1) newSanghs[idx] = { ...newSanghs[idx], ...formData };
      showToast("Sangh Updated Successfully");
    }
    const newData = { ...data, sanghs: newSanghs };
    setData(newData);
    saveOrgData(newData);
    setSanghModal({ isOpen: false, type: "add", data: null });
    onDataChange();
  };

  const handleDelete = () => {
    let updatedData = { ...data };
    if (deleteConfirm.type === "trust") {
      updatedData.trusts = updatedData.trusts.filter(
        (t) => t.id !== deleteConfirm.id,
      );
      updatedData.links = updatedData.links.filter(
        (l) => l.trustId !== deleteConfirm.id,
      );
    } else {
      updatedData.sanghs = updatedData.sanghs.filter(
        (s) => s.id !== deleteConfirm.id,
      );
      updatedData.links = updatedData.links.filter(
        (l) => l.sanghId !== deleteConfirm.id,
      );
    }
    setData(updatedData);
    saveOrgData(updatedData);
    setDeleteConfirm({ show: false, id: null, type: "" });
    showToast("Deleted Successfully");
    onDataChange();
  };

  const toggleStatus = (id, type, currentStatus) => {
    const key = type === "trust" ? "trusts" : "sanghs";
    const list = [...data[key]];
    const idx = list.findIndex((i) => i.id === id);
    if (idx > -1) {
      list[idx].status = !currentStatus;
      const newData = { ...data, [key]: list };
      setData(newData);
      saveOrgData(newData);
      showToast("Status Changed");
      onDataChange();
    }
  };

  // All Organizations combined data
  const allOrganizations = [
    ...data.trusts.map((item) => ({
      ...item,
      orgType: "Trust",
    })),
    ...data.sanghs.map((item) => ({
      ...item,
      orgType: "Sangh",
    })),
  ];

  let currentList =
    activeTab === "All Trusts"
      ? data.trusts
      : activeTab === "All Sanghs"
        ? data.sanghs
        : allOrganizations;

  const filteredData = currentList.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (activeTab === "All Organizations") {
      return matchSearch;
    }
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.status) ||
      (statusFilter === "inactive" && !item.status);
    return matchSearch && matchStatus;
  });

  const totalRecords = filteredData.length;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  const isAllOrganizations = activeTab === "All Organizations";

  return (
    <div className="w-full font-sans antialiased text-slate-600">
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
            <span className="text-sm font-medium uppercase tracking-wide leading-none">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mb-4">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-xs font-semibold">
                <th className="w-16 px-6 py-3 text-center">Sr No</th>
                {!isAllOrganizations && (
                  <>
                    <th className="px-6 py-3 text-left w-1/4">
                      {activeTab === "All Trusts" ? "Trust Name" : "Sangh Name"}
                    </th>
                    <th className="px-6 py-3 text-left w-1/4">
                      {activeTab === "All Trusts"
                        ? "Admin / City"
                        : "City / Members"}
                    </th>
                    <th className="w-32 px-6 py-3 text-center">Status</th>
                    <th className="w-40 px-6 py-3 text-center">Actions</th>
                  </>
                )}
                {isAllOrganizations && (
                  <>
                    <th className="px-6 py-3 text-left w-2/5">
                      Organization Name
                    </th>
                    <th className="px-6 py-3 text-left w-1/5">Type</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-500 align-middle">
                      {(currentPage - 1) * recordsPerPage + idx + 1}
                    </td>
                    {isAllOrganizations ? (
                      <>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 align-middle">
                          {row.name}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold align-middle">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              row.orgType === "Trust"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {row.orgType}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 align-middle">
                          {row.name}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 align-middle">
                          {activeTab === "All Trusts" ? (
                            <div>
                              <div className="font-bold text-slate-700">
                                {row.admin}
                              </div>
                              <div className="mt-1">{row.city}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold text-slate-700">
                                {row.city}
                              </div>
                              <div className="mt-1 text-xs uppercase tracking-wider">
                                {row.members} Members
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <div className="flex items-center justify-center">
                            <StatusToggle
                              status={row.status}
                              onToggle={() =>
                                toggleStatus(
                                  row.id,
                                  activeTab === "All Trusts"
                                    ? "trust"
                                    : "sangh",
                                  row.status,
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() =>
                                setDetailsModal({
                                  isOpen: true,
                                  type:
                                    activeTab === "All Trusts"
                                      ? "trust"
                                      : "sangh",
                                  data: row,
                                })
                              }
                              className="text-slate-400 hover:text-emerald-600 transition-all p-2 hover:bg-emerald-50 rounded-lg"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() =>
                                activeTab === "All Trusts"
                                  ? setTrustModal({
                                      isOpen: true,
                                      type: "edit",
                                      data: row,
                                    })
                                  : setSanghModal({
                                      isOpen: true,
                                      type: "edit",
                                      data: row,
                                    })
                              }
                              className="text-slate-400 hover:text-emerald-600 transition-all p-2 hover:bg-emerald-50 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  show: true,
                                  id: row.id,
                                  type:
                                    activeTab === "All Trusts"
                                      ? "trust"
                                      : "sangh",
                                })
                              }
                              className="text-slate-400 hover:text-rose-500 transition-all p-2 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isAllOrganizations ? "3" : "5"}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        onPageChange={setCurrentPage}
        onRecordsPerPageChange={setRecordsPerPage}
      />

      {trustModal.isOpen && (
        <TrustFormModal
          isOpen={trustModal.isOpen}
          onClose={() =>
            setTrustModal({ isOpen: false, type: "add", data: null })
          }
          initialData={trustModal.data}
          onSave={handleSaveTrust}
        />
      )}
      {sanghModal.isOpen && (
        <SanghFormModal
          isOpen={sanghModal.isOpen}
          onClose={() =>
            setSanghModal({ isOpen: false, type: "add", data: null })
          }
          initialData={sanghModal.data}
          onSave={handleSaveSangh}
        />
      )}
      {detailsModal.isOpen && detailsModal.type === "trust" && (
        <TrustDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false })}
          trust={detailsModal.data}
          allData={data}
        />
      )}
      {detailsModal.isOpen && detailsModal.type === "sangh" && (
        <SanghDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false })}
          sangh={detailsModal.data}
          allData={data}
        />
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              Confirm Delete?
            </h3>
            <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest">
              This action is permanent
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() =>
                  setDeleteConfirm({ show: false, id: null, type: "" })
                }
                className="flex-1 py-3 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-xs font-bold text-white bg-rose-500 rounded-xl shadow-lg hover:bg-rose-600"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
