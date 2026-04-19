import React from "react";
import UserAvatar from "./UserAvatar";
import StatusBadge from "../common/StatusBadge";
import UserStatusToggle from "./UserStatusToggle";
import CommonActionButtons from "../common/CommonActionButtons";

export const getUserTableColumns = ({ onStatusChange, onView, onEdit, onDelete, onSelect, selectedIds }) => [
  {
    key: "checkbox",
    label: "",
    align: "center",
    width: "w-[4%]",
    render: (_, user) =>
      user.roleName === "Super Admin" ? null : (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          checked={selectedIds?.includes(user.id)}
          onChange={() => onSelect?.(user.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
  },
  {
    key: "name",
    label: "User",
    sortable: true,
    width: "w-[18%]",
    render: (val, user) => (
      <div className="flex items-center gap-2">
        <UserAvatar user={user} size="sm" />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 truncate text-[13px]">{val}</span>
          <span className="text-[11px] text-slate-400 truncate">{user.email}</span>
        </div>
      </div>
    ),
  },
  {
    key: "phone",
    label: "Mobile",
    width: "w-[11%]",
    render: (val) => <span className="text-slate-600 font-medium text-[13px]">{val}</span>,
  },
  {
    key: "roleName",
    label: "Role",
    width: "w-[10%]",
    render: (val) => (
      <span className="inline-flex px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-100">
        {val || "—"}
      </span>
    ),
  },
  {
    key: "trustName",
    label: "Trust",
    width: "w-[10%]",
    render: (val) => <span className="text-slate-500 text-[13px] truncate block">{val || "—"}</span>,
  },
  {
    key: "sanghName",
    label: "Sangh",
    width: "w-[10%]",
    render: (val) => <span className="text-slate-500 text-[13px] truncate block">{val || "—"}</span>,
  },
  {
    key: "deptName",
    label: "Dept",
    width: "w-[9%]",
    render: (val) => <span className="text-slate-500 text-[13px] truncate block">{val || "—"}</span>,
  },
  {
    key: "permCount",
    label: "Perms",
    align: "center",
    width: "w-[6%]",
    render: (val) => <span className="font-bold text-slate-700 text-[13px]">{val || 0}</span>,
  },
  {
    key: "status",
    label: "Status",
    align: "center",
    width: "w-[8%]",
    render: (status, user) => (
      <UserStatusToggle status={status} onChange={(next) => onStatusChange?.(user.id, next)} />
    ),
  },
  {
    key: "approvalStatus",
    label: "Approval",
    align: "center",
    width: "w-[8%]",
    render: (val) => <StatusBadge status={val || "Pending"} />,
  },
  {
    key: "actions",
    label: "Actions",
    align: "center",
    width: "w-[6%]",
    render: (_, user) => (
      <CommonActionButtons
        actions={[
          { variant: "view", onClick: () => onView?.(user) },
          { variant: "edit", onClick: () => onEdit?.(user) },
          { variant: "delete", onClick: () => onDelete?.(user), hidden: user.roleName === "Super Admin" },
        ]}
      />
    ),
  },
];
