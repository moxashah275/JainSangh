import React, { useMemo } from "react";
import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  UserCheck,
  UserPlus,
  DollarSign,
  Award,
  Edit,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";

// Import data and helper functions
import {
  getCount,
  INITIAL_ROLES,
} from "../../pages/RolesAndPermissions/RoleData";
import {
  INITIAL_TRUSTS,
  INITIAL_SANGHS,
  INITIAL_DEPARTMENTS,
} from "../../pages/organization/orgData";
import { getDocCount, INITIAL_USER_DOCS } from "../../pages/users/userData";

// Helper component for individual fields in the two-column layout
function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-slate-400">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-[13px] font-semibold text-slate-700 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

// Helper component for the summary cards at the bottom
function SummaryCard({ title, value, icon: Icon, color = "teal" }) {
  const colorMap = {
    teal: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      iconBg: "bg-teal-100",
      iconText: "text-teal-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-600",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      iconBg: "bg-sky-100",
      iconText: "text-sky-600",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
    },
  };
  const c = colorMap[color] || colorMap.teal;

  return (
    <div
      className={`rounded-2xl border ${c.bg} ${c.text} p-4 flex items-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}
      >
        {Icon && <Icon className={`w-5 h-5 ${c.iconText}`} />}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="text-[16px] font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

export default function UserOverviewTab({ user, allDocs }) {
  // Mock data for demonstration if not provided in user object
  const mockUser = {
    employeeId: "EMP-001",
    designation: "Software Engineer",
    salary: "₹ 75,000 / month",
    createdBy: "Admin User",
    approvedBy: "HR Manager",
    address: "123 Jain Street, Palitana, Gujarat, 364270",
    lastUpdated: "2024-04-07 15:30",
    approvalStatus: "Approved",
    ...user, // Merge actual user data over mocks
  };

  // Resolve related data using useMemo for performance
  const role = useMemo(() => {
    return INITIAL_ROLES.find((r) => r.id === mockUser.roleId) || null;
  }, [mockUser.roleId]);

  const trust = useMemo(() => {
    return INITIAL_TRUSTS.find((t) => t.id === mockUser.trustId) || null;
  }, [mockUser.trustId]);

  const sangh = useMemo(() => {
    return INITIAL_SANGHS.find((s) => s.id === mockUser.sanghId) || null;
  }, [mockUser.sanghId]);

  const department = useMemo(() => {
    return (
      INITIAL_DEPARTMENTS.find((d) => d.id === mockUser.departmentId) || null
    );
  }, [mockUser.departmentId]);

  const totalPermissions = useMemo(() => {
    const basePerms = role ? getCount(role) : 0;
    const extraPerms = Array.isArray(mockUser.permissions)
      ? mockUser.permissions.length
      : 0;
    return basePerms + extraPerms;
  }, [role, mockUser.permissions]);

  const uploadedDocumentsCount = useMemo(() => {
    return getDocCount(mockUser.id, allDocs || INITIAL_USER_DOCS);
  }, [mockUser.id, allDocs]);

  return (
    <div className="space-y-6">
      {/* Two-column overview section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3">
            Personal & Employment Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="Mobile" value={mockUser.phone} icon={Phone} />
            <InfoField label="Email" value={mockUser.email} icon={Mail} />
            <InfoField
              label="Employee ID"
              value={mockUser.employeeId}
              icon={Briefcase}
            />
            <InfoField
              label="Department"
              value={department?.name}
              icon={Building2}
            />
            <InfoField
              label="Designation"
              value={mockUser.designation}
              icon={Award}
            />
            <InfoField
              label="Salary"
              value={mockUser.salary}
              icon={DollarSign}
            />
            <InfoField
              label="Joining Date"
              value={mockUser.joined}
              icon={CalendarDays}
            />
            <InfoField
              label="Created By"
              value={mockUser.createdBy}
              icon={UserPlus}
            />
            <InfoField
              label="Approved By"
              value={mockUser.approvedBy}
              icon={UserCheck}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3">
            Organizational & Status Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="Trust" value={trust?.name} icon={Building2} />
            <InfoField label="Sangh" value={sangh?.name} icon={Users} />
            <InfoField label="Role" value={role?.name} icon={ShieldCheck} />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Approval Status
                </span>
              </div>
              <StatusBadge status={mockUser.approvalStatus || "Pending"} />
            </div>
            <InfoField
              label="Last Login"
              value={mockUser.lastLogin}
              icon={Clock3}
            />
            <InfoField
              label="Last Updated"
              value={mockUser.lastUpdated}
              icon={Edit}
            />
            <div className="sm:col-span-2">
              <InfoField
                label="Address"
                value={mockUser.address}
                icon={MapPin}
              />
            </div>
            <div className="sm:col-span-2">
              <InfoField label="Notes" value={mockUser.notes} icon={FileText} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: 4 small summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Assigned Role"
          value={role?.name || "N/A"}
          icon={ShieldCheck}
          color="teal"
        />
        <SummaryCard
          title="Total Permissions"
          value={`${totalPermissions} Permissions`}
          icon={ShieldCheck}
          color="emerald"
        />
        <SummaryCard
          title="Uploaded Documents"
          value={`${uploadedDocumentsCount} Documents`}
          icon={FileText}
          color="sky"
        />
        <SummaryCard
          title="Last Login"
          value={mockUser.lastLogin || "Never"}
          icon={Clock3}
          color="amber"
        />
      </div>
    </div>
  );
}
