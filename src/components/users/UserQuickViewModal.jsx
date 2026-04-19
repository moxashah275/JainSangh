import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Pencil,
  Clock,
  History,
  ShieldCheck,
  FileText,
  LayoutDashboard,
  Activity,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import UserStatusToggle from "./UserStatusToggle";
import UserOverviewTab from "./UserOverviewTab";
import UserPermissionsTab from "./UserPermissionsTab";
import UserDocuments from "./UserDocuments";
import UserActivity from "./UserActivity";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";
import { INITIAL_ROLES } from "../../pages/RolesAndPermissions/RoleData";

const TABS = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Documents", icon: FileText },
  { name: "Shift Details", icon: Clock },
  { name: "Permissions", icon: ShieldCheck },
  { name: "Activity", icon: Activity },
  { name: "Status History", icon: History },
];

/**
 * UserQuickViewModal functions as a right-side drawer (80% width)
 * that provides a comprehensive overview of a user's data and activity.
 */
export default function UserQuickViewModal({
  isOpen,
  onClose,
  user,
  onEdit,
  onStatusChange,
  allDocs = [],
  allActivities = [],
  onDocUpload,
  onDocDelete,
  onAddCustomPermission,
}) {
  const [activeTab, setActiveTab] = useState("Overview");

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Resolve specific data subsets for this user
  const role = useMemo(() => {
    return INITIAL_ROLES.find((r) => r.id === user?.roleId) || null;
  }, [user?.roleId]);

  const userDocs = useMemo(() => {
    return allDocs.filter((d) => d.userId === user?.id);
  }, [allDocs, user?.id]);

  const userActivities = useMemo(() => {
    return allActivities.filter((a) => a.userId === user?.id);
  }, [allActivities, user?.id]);

  const statusHistory = useMemo(() => {
    return userActivities.filter((a) => a.action === "status_change");
  }, [userActivities]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Container (80% Width) */}
      <div className="relative h-full w-[80%] bg-[#f8fafc] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <UserAvatar user={user} size="lg" />
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-[24px] font-bold text-slate-900 leading-tight">
                    {user.name}
                  </h2>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-teal-600 tracking-tight">
                    {role?.name || "No role assigned"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                    {role?.type || "System"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-4 mr-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Account Control
                </span>
                <UserStatusToggle
                  status={user.status}
                  onChange={onStatusChange}
                />
              </div>

              <Button
                variant="secondary"
                icon={Pencil}
                onClick={() => onEdit(user)}
                className="font-bold"
              >
                Edit
              </Button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-8 mt-8">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`pb-4 flex items-center gap-2 text-[13px] font-bold transition-all relative
                    ${isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-600"}
                  `}
                >
                  <tab.icon
                    className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-300"}`}
                  />
                  {tab.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeTab === "Overview" && (
              <UserOverviewTab user={user} allDocs={allDocs} />
            )}

            {activeTab === "Documents" && (
              <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
                <UserDocuments
                  documents={userDocs}
                  onUpload={onDocUpload}
                  onDelete={onDocDelete}
                />
              </div>
            )}

            {activeTab === "Shift Details" && (
              <div className="bg-white rounded-[24px] border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-[17px] font-bold text-slate-800">
                  No shift data available
                </h4>
                <p className="text-[13px] text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                  Working hours, break times, and shift schedules for this user
                  have not been configured in the system yet.
                </p>
                <div className="pt-2">
                  <Button variant="secondary" size="sm">
                    Manage Shifts
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "Permissions" && (
              <UserPermissionsTab
                user={user}
                role={role}
                onAddCustom={onAddCustomPermission}
              />
            )}

            {activeTab === "Activity" && (
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[16px] font-bold text-slate-800 mb-6 uppercase tracking-tight">
                  Timeline Activity
                </h3>
                <UserActivity activities={userActivities} />
              </div>
            )}

            {activeTab === "Status History" && (
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[16px] font-bold text-slate-800 mb-6">
                  Status Change History
                </h3>
                <UserActivity activities={statusHistory} />
              </div>
            )}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `,
        }}
      />
    </div>
  );
}
