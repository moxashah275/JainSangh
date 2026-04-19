import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Link2, Unlink } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import Pagination from '../../components/common/Pagination';
import { getOrgData, getSanghName, getTrustName, saveOrgData } from './orgData';
import LinkTrustSanghModal from './forms/LinkTrustSanghModal';

export default function LinkedSanghTrust({ searchTerm = '', onDataChange }) {
  const [data, setData] = useState(() => getOrgData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const showToast = useToast();

  useEffect(() => {
    const nextData = getOrgData();
    setData(nextData);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredLinks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return data.links.filter((link) => {
      const trustName = getTrustName(link.trustId, data.trusts).toLowerCase();
      const sanghName = getSanghName(link.sanghId, data.sanghs).toLowerCase();
      return `${trustName} ${sanghName}`.includes(query);
    });
  }, [data.links, data.sanghs, data.trusts, searchTerm]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredLinks.length / recordsPerPage));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredLinks.length, recordsPerPage]);

  const paginatedLinks = filteredLinks.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleRemoveLink = () => {
    if (!deleteConfirm.id) {
      setDeleteConfirm({ show: false, id: null });
      return;
    }

    const nextData = {
      ...data,
      links: data.links.filter((link) => link.id !== deleteConfirm.id),
    };

    setData(nextData);
    saveOrgData(nextData);
    setDeleteConfirm({ show: false, id: null });
    onDataChange?.();
    showToast('Link removed successfully.', 'delete');
  };

  const handleCreateLink = (trustId, sanghId) => {
    const exists = data.links.some((link) => link.trustId === Number(trustId) && link.sanghId === Number(sanghId));

    if (exists) {
      showToast('This trust and sangh are already linked.', 'delete');
      return;
    }

    const nextData = {
      ...data,
      links: [
        ...data.links,
        {
          id: Date.now(),
          trustId: Number(trustId),
          sanghId: Number(sanghId),
          linkedAt: new Date().toISOString().split('T')[0],
          status: true,
        },
      ],
    };

    setData(nextData);
    saveOrgData(nextData);
    setIsModalOpen(false);
    onDataChange?.();
    showToast('Link created successfully.');
  };

  return (
    <div className="w-full font-sans text-slate-600">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Manage Trust-Sangh Relations</h3>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Link trusts with sanghs and manage relation records from the same table.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-white px-4 py-2 text-[12px] font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-50"
          >
            <Link2 size={14} />
            Create New Link
          </button>
        </div>

        <div className="mb-5 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Linked Relations: <span className="text-slate-700">{filteredLinks.length}</span>
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-emerald-600 bg-emerald-500 text-[12px] font-semibold uppercase text-white">
                <th className="w-[14%] px-6 py-3 text-center">Sr. No.</th>
                <th className="w-[34%] px-6 py-3 text-left">Trust Name</th>
                <th className="w-[34%] px-6 py-3 text-left">Sangh Name</th>
                <th className="w-[18%] px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLinks.length > 0 ? (
                paginatedLinks.map((link, index) => (
                  <tr key={link.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-center text-sm font-medium text-slate-500">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      {getTrustName(link.trustId, data.trusts)}
                    </td>
                    <td className="px-6 py-3 text-left text-sm font-medium text-slate-600">
                      {getSanghName(link.sanghId, data.sanghs)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ show: true, id: link.id })}
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                        title="Remove Link"
                      >
                        <Unlink size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Link2 size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">No links found</p>
                      <p className="mt-1 text-[11px] text-slate-300">Create a new relation to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalRecords={filteredLinks.length}
          recordsPerPage={recordsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={(value) => {
            setRecordsPerPage(value);
            setCurrentPage(1);
          }}
        />
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

      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Delete Link?</h3>
            <p className="mt-1 text-[11px] text-slate-400">This linked relation will be removed permanently.</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-medium text-slate-500 transition-all hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveLink}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-medium text-white shadow-md transition-all hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
