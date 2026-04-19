import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { AlertTriangle, Edit2, Eye, Trash2 } from 'lucide-react';
import StatusToggle from '../../components/common/StatusToggle';
import { useToast } from '../../components/common/Toast';
import TrustFormModal from './forms/TrustFormModal';
import SanghFormModal from './forms/SanghFormModal';
import TrustDetailsModal from './details/TrustDetailsModal';
import SanghDetailsModal from './details/SanghDetailsModal';
import { getOrgData, saveOrgData } from './orgData';

const ITEM_LABELS = {
  trust: 'Trust',
  sangh: 'Sangh',
};

function getItemType(item) {
  if (item?.orgType) {
    return item.orgType.toLowerCase();
  }

  return item?.mainContactPerson ? 'trust' : 'sangh';
}

function withActivity(item, action) {
  return {
    ...item,
    updatedAt: new Date().toISOString(),
    activity: [
      {
        id: Date.now(),
        action,
        timestamp: new Date().toISOString(),
        user: 'Admin',
      },
      ...(item.activity || []),
    ],
  };
}

const OrgTable = forwardRef(function OrgTable(
  {
    activeTab,
    searchTerm,
    filterValues,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    setTotalEntries,
    onDataChange,
  },
  ref
) {
  const [data, setData] = useState(() => getOrgData());
  const [trustModal, setTrustModal] = useState({ isOpen: false, type: 'add', data: null });
  const [sanghModal, setSanghModal] = useState({ isOpen: false, type: 'add', data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, itemType: '', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, itemType: '', name: '' });
  const showToast = useToast();

  useImperativeHandle(ref, () => ({
    openTrustModal: () => setTrustModal({ isOpen: true, type: 'add', data: null }),
    openSanghModal: () => setSanghModal({ isOpen: true, type: 'add', data: null }),
  }));

  const persistData = (nextData) => {
    setData(nextData);
    saveOrgData(nextData);
    onDataChange?.();
  };

  const openDetails = (item) => {
    setDetailsModal({
      isOpen: true,
      itemType: getItemType(item),
      data: item,
    });
  };

  const openEdit = (item) => {
    const itemType = getItemType(item);

    if (itemType === 'trust') {
      setTrustModal({ isOpen: true, type: 'edit', data: item });
      return;
    }

    setSanghModal({ isOpen: true, type: 'edit', data: item });
  };

  const openDelete = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      itemType: getItemType(item),
      name: item.name,
    });
  };

  const handleSaveTrust = (formData) => {
    const duplicate = data.trusts.some(
      (trust) =>
        trust.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        trust.id !== trustModal.data?.id
    );

    if (duplicate) {
      showToast('Trust name already exists.', 'delete');
      return;
    }

    const nextTrusts =
      trustModal.type === 'add'
        ? [
            ...data.trusts,
            withActivity(
              {
                ...formData,
                id: Date.now(),
                createdAt: new Date().toISOString(),
              },
              'Trust Created'
            ),
          ]
        : data.trusts.map((trust) =>
            trust.id === trustModal.data.id
              ? withActivity(
                  {
                    ...trust,
                    ...formData,
                  },
                  'Trust Updated'
                )
              : trust
          );

    persistData({ ...data, trusts: nextTrusts });
    setTrustModal({ isOpen: false, type: 'add', data: null });
    showToast(trustModal.type === 'add' ? 'Trust added successfully.' : 'Trust updated successfully.');
  };

  const handleSaveSangh = (formData) => {
    const duplicate = data.sanghs.some(
      (sangh) =>
        sangh.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        sangh.id !== sanghModal.data?.id
    );

    if (duplicate) {
      showToast('Sangh name already exists.', 'delete');
      return;
    }

    const nextSanghs =
      sanghModal.type === 'add'
        ? [
            ...data.sanghs,
            withActivity(
              {
                ...formData,
                id: Date.now(),
                createdAt: new Date().toISOString(),
              },
              'Sangh Created'
            ),
          ]
        : data.sanghs.map((sangh) =>
            sangh.id === sanghModal.data.id
              ? withActivity(
                  {
                    ...sangh,
                    ...formData,
                  },
                  'Sangh Updated'
                )
              : sangh
          );

    persistData({ ...data, sanghs: nextSanghs });
    setSanghModal({ isOpen: false, type: 'add', data: null });
    showToast(sanghModal.type === 'add' ? 'Sangh added successfully.' : 'Sangh updated successfully.');
  };

  const handleDelete = () => {
    if (!deleteConfirm.id || !deleteConfirm.itemType) {
      setDeleteConfirm({ show: false, id: null, itemType: '', name: '' });
      return;
    }

    const nextData =
      deleteConfirm.itemType === 'trust'
        ? {
            ...data,
            trusts: data.trusts.filter((trust) => trust.id !== deleteConfirm.id),
            links: data.links.filter((link) => link.trustId !== deleteConfirm.id),
          }
        : {
            ...data,
            sanghs: data.sanghs.filter((sangh) => sangh.id !== deleteConfirm.id),
            links: data.links.filter((link) => link.sanghId !== deleteConfirm.id),
          };

    persistData(nextData);
    setDeleteConfirm({ show: false, id: null, itemType: '', name: '' });
    setDetailsModal((current) =>
      current.data?.id === deleteConfirm.id && current.itemType === deleteConfirm.itemType
        ? { isOpen: false, itemType: '', data: null }
        : current
    );
    showToast(`${ITEM_LABELS[deleteConfirm.itemType]} deleted successfully.`, 'delete');
  };

  const toggleStatus = (id, itemType, currentStatus) => {
    const nextStatus = !currentStatus;
    const storageKey = itemType === 'trust' ? 'trusts' : 'sanghs';
    const nextData = {
      ...data,
      [storageKey]: data[storageKey].map((item) =>
        item.id === id
          ? withActivity(
              {
                ...item,
                status: nextStatus,
              },
              `${ITEM_LABELS[itemType]} Status ${nextStatus ? 'Activated' : 'Deactivated'}`
            )
          : item
      ),
    };

    persistData(nextData);
    setDetailsModal((current) =>
      current.data?.id === id && current.itemType === itemType
        ? {
            ...current,
            data: {
              ...current.data,
              status: nextStatus,
            },
          }
        : current
    );
    showToast(`${ITEM_LABELS[itemType]} status set to ${nextStatus ? 'active' : 'inactive'}.`);
  };

  const filteredData = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();
    const matchesStatus = (item) => {
      if (filterValues.status === 'active') return item.status === true;
      if (filterValues.status === 'inactive') return item.status === false;
      return true;
    };

    const trustHasLinkedSangh = (trustId, sanghId) =>
      data.links.some((link) => link.trustId === trustId && link.sanghId === Number(sanghId) && link.status);

    const sanghHasLinkedTrust = (sanghId, trustId) =>
      data.links.some((link) => link.sanghId === sanghId && link.trustId === Number(trustId) && link.status);

    if (activeTab === 'all') {
      return [
        ...data.trusts.map((trust) => ({ ...trust, orgType: 'Trust' })),
        ...data.sanghs.map((sangh) => ({ ...sangh, orgType: 'Sangh' })),
      ].filter((item) => {
        const searchable = [item.name, item.city, item.state, item.orgType].filter(Boolean).join(' ').toLowerCase();
        return searchable.includes(searchValue) && matchesStatus(item);
      });
    }

    if (activeTab === 'trusts') {
      return data.trusts.filter((item) => {
        const searchable = [item.name, item.city, item.state, item.mainContactPerson].filter(Boolean).join(' ').toLowerCase();
        const matchesLinked = filterValues.linkedId === 'all' ? true : trustHasLinkedSangh(item.id, filterValues.linkedId);
        return searchable.includes(searchValue) && matchesStatus(item) && matchesLinked;
      });
    }

    return data.sanghs.filter((item) => {
      const searchable = [item.name, item.city, item.state, item.mainPersonName].filter(Boolean).join(' ').toLowerCase();
      const matchesLinked = filterValues.linkedId === 'all' ? true : sanghHasLinkedTrust(item.id, filterValues.linkedId);
      return searchable.includes(searchValue) && matchesStatus(item) && matchesLinked;
    });
  }, [activeTab, data, filterValues.linkedId, filterValues.status, searchTerm]);

  useEffect(() => {
    setTotalEntries(filteredData.length);
    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredData.length, itemsPerPage, setCurrentPage, setTotalEntries]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = useMemo(() => {
    const renderStatus = (item, itemType) => (
      <div className="flex justify-center">
        <StatusToggle status={item.status} onToggle={() => toggleStatus(item.id, itemType, item.status)} />
      </div>
    );

    const renderActions = (item) => {
      const itemType = getItemType(item);

      return (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openDetails(item)}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            onClick={() => openEdit(item)}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => openDelete(item)}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      );
    };

    if (activeTab === 'all') {
      return [
        { key: 'serial', label: 'Sr. No.', className: 'w-[12%] text-center', render: (_, index) => index + 1 },
        { key: 'name', label: 'Organization Name', className: 'w-[24%] text-center', render: (item) => item.name },
        {
          key: 'type',
          label: 'Type',
          className: 'w-[16%] text-center',
          render: (item) => (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
              {item.orgType}
            </span>
          ),
        },
        {
          key: 'location',
          label: 'Location',
          className: 'w-[18%] text-center',
          render: (item) => [item.city, item.state].filter(Boolean).join(', ') || '---',
        },
        { key: 'status', label: 'Status', className: 'w-[14%] text-center', render: (item) => renderStatus(item, getItemType(item)) },
        { key: 'actions', label: 'Actions', className: 'w-[16%] text-center', render: (item) => renderActions(item) },
      ];
    }

    if (activeTab === 'trusts') {
      return [
        { key: 'serial', label: 'Sr. No.', className: 'w-[12%] text-center', render: (_, index) => index + 1 },
        { key: 'name', label: 'Trust Name', className: 'w-[22%] text-center', render: (item) => item.name },
        { key: 'city', label: 'City', className: 'w-[18%] text-center', render: (item) => item.city || '---' },
        {
          key: 'contact',
          label: 'Main Contact',
          className: 'w-[18%] text-center',
          render: (item) => item.mainContactPerson || '---',
        },
        { key: 'status', label: 'Status', className: 'w-[14%] text-center', render: (item) => renderStatus(item, 'trust') },
        { key: 'actions', label: 'Actions', className: 'w-[16%] text-center', render: (item) => renderActions(item) },
      ];
    }

    return [
      { key: 'serial', label: 'Sr. No.', className: 'w-[12%] text-center', render: (_, index) => index + 1 },
      { key: 'name', label: 'Sangh Name', className: 'w-[22%] text-center', render: (item) => item.name },
      { key: 'city', label: 'City', className: 'w-[18%] text-center', render: (item) => item.city || '---' },
      {
        key: 'members',
        label: 'Total Members',
        className: 'w-[18%] text-center',
        render: (item) => item.totalMembers?.toLocaleString() || '0',
      },
      { key: 'status', label: 'Status', className: 'w-[14%] text-center', render: (item) => renderStatus(item, 'sangh') },
      { key: 'actions', label: 'Actions', className: 'w-[16%] text-center', render: (item) => renderActions(item) },
    ];
  }, [activeTab, data]);

  return (
    <div className="w-full font-sans text-slate-600">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-emerald-600 bg-emerald-500 text-[12px] font-semibold uppercase text-white">
              {columns.map((column) => (
                <th key={column.key} className={`${column.className} px-6 py-3`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr key={`${getItemType(item)}-${item.id}`} className="transition-colors hover:bg-slate-50/50">
                  {columns.map((column) => (
                    <td key={column.key} className={`${column.className} px-6 py-3 text-sm font-medium text-slate-500`}>
                      {column.render(item, (currentPage - 1) * itemsPerPage + rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-slate-400">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {trustModal.isOpen && (
        <TrustFormModal
          isOpen={trustModal.isOpen}
          onClose={() => setTrustModal({ isOpen: false, type: 'add', data: null })}
          initialData={trustModal.data}
          onSave={handleSaveTrust}
        />
      )}

      {sanghModal.isOpen && (
        <SanghFormModal
          isOpen={sanghModal.isOpen}
          onClose={() => setSanghModal({ isOpen: false, type: 'add', data: null })}
          initialData={sanghModal.data}
          onSave={handleSaveSangh}
        />
      )}

      {detailsModal.isOpen && detailsModal.itemType === 'trust' && (
        <TrustDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, itemType: '', data: null })}
          trust={detailsModal.data}
          allData={data}
          onStatusToggle={toggleStatus}
        />
      )}

      {detailsModal.isOpen && detailsModal.itemType === 'sangh' && (
        <SanghDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, itemType: '', data: null })}
          sangh={detailsModal.data}
          allData={data}
          onStatusToggle={toggleStatus}
        />
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Delete {ITEM_LABELS[deleteConfirm.itemType]}?</h3>
            <p className="mt-1 text-[11px] text-slate-400">{deleteConfirm.name || 'This record'} will be removed permanently.</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ show: false, id: null, itemType: '', name: '' })}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-medium text-slate-500 transition-all hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
});

export default OrgTable;
