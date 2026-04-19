import { useMemo, useState } from "react";
import { Shield, Users, Landmark, Lock, Pencil, Trash2 } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";
import CommonPageLayout from "../../components/common/CommonPageLayout";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { useToast } from "../../components/common/Toast";
import StatusBadge from "../../components/common/StatusBadge";
import CommonActionButtons from "../../components/common/CommonActionButtons";
import {
  INITIAL_ROLES,
  INITIAL_USERS,
  PERM_GROUPS,
  getCount,
  getUserCount,
} from "./RoleData";

const TYPE_LABELS = ["All", "System", "Trust", "Sangh"];

export default function RolesAndPermissionsPage() {
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [roles, setRoles] = useState(function () {
    try {
      const stored = localStorage.getItem("rp_roles");
      return stored ? JSON.parse(stored) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });
  const [users] = useState(function () {
    try {
      const stored = localStorage.getItem("users_full");
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredRoles = useMemo(
    function () {
      const list = roles.filter(function (role) {
        const query = search.toLowerCase();
        const matchesSearch =
          !query ||
          [role.name, role.type, role.description].some(function (value) {
            return String(value || "")
              .toLowerCase()
              .includes(query);
          });
        const matchesType = typeFilter === "All" || role.type === typeFilter;
        return matchesSearch && matchesType;
      });
      return list;
    },
    [roles, search, typeFilter],
  );

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = useMemo(
    function () {
      const activeRoles = roles.filter(function (role) {
        return role.status === "Active";
      }).length;
      return [
        {
          title: "Role Levels",
          value: roles.length,
          icon: Shield,
          color: "teal",
        },
        {
          title: "Active Roles",
          value: activeRoles,
          icon: Users,
          color: "emerald",
        },
        {
          title: "Permission Sections",
          value: PERM_GROUPS.length,
          icon: Lock,
          color: "sky",
        },
        {
          title: "Assigned Users",
          value: users.length,
          icon: Landmark,
          color: "amber",
        },
      ];
    },
    [roles, users],
  );

  const handleStatusToggle = (roleId, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, status: nextStatus } : r)),
    );
    showToast(
      `Role level ${nextStatus === "Active" ? "activated" : "deactivated"} successfully.`,
    );
  };

  const columns = [
    {
      key: "id",
      label: "Sr. No.",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: "name",
      label: "Role Name",
      render: (val, role) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
            {role.description.substring(0, 40)}...
          </span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${
            val === "System"
              ? "bg-sky-50 text-sky-600 border-sky-100"
              : val === "Trust"
                ? "bg-rose-50 text-rose-600 border-rose-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "users",
      label: "Assigned Users",
      align: "center",
      render: (_, role) => (
        <span className="font-bold text-slate-600">
          {getUserCount(role.id, users)}
        </span>
      ),
    },
    {
      key: "perms",
      label: "Permissions",
      align: "center",
      render: (_, role) => (
        <span className="font-bold text-teal-600">{getCount(role)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (val, role) => (
        <div className="flex flex-col items-center gap-2">
          <StatusBadge status={val} />
          <button
            onClick={() => handleStatusToggle(role.id, val)}
            className={`relative inline-flex h-5 w-9 items-center rounded-xl px-[3px] transition-colors ${val === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span
              className={`h-3.5 w-3.5 rounded-xl bg-white shadow-sm transition-all ${val === "Active" ? "translate-x-[16px]" : "translate-x-0"}`}
            />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, role) => (
        <CommonActionButtons
          actions={[
            { variant: "edit", onClick: () => console.log("Edit", role.id) },
            {
              variant: "delete",
              onClick: () => console.log("Delete", role.id),
              hidden: role.isLocked,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <CommonPageLayout
      title="Roles & Permissions"
      subtitle="Manage system access levels and department-wise permission scopes."
      stats={stats}
      searchValue={search}
      onSearchChange={(v) => {
        setSearch(v);
        setCurrentPage(1);
      }}
      searchPlaceholder="Search role name, type, or description..."
      toolbar={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {TYPE_LABELS.map(function (label) {
            return (
              <button
                key={label}
                type="button"
                onClick={function () {
                  setTypeFilter(label);
                }}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${typeFilter === label ? "bg-teal-600 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      }
      isEmpty={!filteredRoles.length}
      emptyState={
        <EmptyState
          message="No roles found"
          description="Try a different search or filter to view permission levels."
          icon={Shield}
        />
      }
    >
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">
        <Table
          columns={columns}
          data={paginatedRoles}
          rowKey="id"
          variant="emerald"
          emptyMessage="No roles found matching your search"
        />

        <Pagination
          currentPage={currentPage}
          totalRecords={filteredRoles.length}
          recordsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={(v) => {
            setItemsPerPage(v);
            setCurrentPage(1);
          }}
        />
      </div>
    </CommonPageLayout>
  );
}
