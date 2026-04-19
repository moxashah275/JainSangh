import React, { useMemo } from "react";
import { ShieldCheck, Plus, Settings } from "lucide-react";
import Button from "../common/Button";
import PermissionChip from "../common/PermissionChip";

// Import logic and constants from RoleData
import {
  PERM_GROUPS,
  getCount,
  hasPerm,
  ICONS,
} from "../../pages/RolesAndPermissions/RoleData";

/**
 * UserPermissionsTab provides a detailed visualization of a user's
 * effective permissions (Role-based + Custom Overrides).
 *
 * @param {Object} user - The user object containing custom permission keys.
 * @param {Object} role - The assigned role object for the user.
 * @param {Function} onAddCustom - Callback to open the custom permission editor.
 */
export default function UserPermissionsTab({ user, role, onAddCustom }) {
  const customPermsCount = useMemo(() => {
    return Array.isArray(user?.permissions) ? user.permissions.length : 0;
  }, [user?.permissions]);

  const basePermsCount = useMemo(() => {
    return role ? getCount(role) : 0;
  }, [role]);

  return (
    <div className="space-y-6">
      {/* Top summary strip */}
      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[12px] font-bold">
                Assigned Role: {role?.name || "None"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[12px] font-semibold px-2">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {basePermsCount} Base Permissions
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                {customPermsCount} Custom Overrides
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={onAddCustom}
            className="rounded-xl font-bold"
          >
            Add Custom Permission
          </Button>
        </div>
      </div>

      {/* Grouped permission cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PERM_GROUPS.map((group) => {
          const Icon = ICONS[group.icon] || Settings;

          // Calculate how many permissions in this specific group are active for the user
          const activeInGroup = group.perms.filter((perm) => {
            const key = `${group.key}_${perm.toLowerCase().replace(/\s+/g, "_")}`;
            return (
              hasPerm(role, key) || (user?.permissions || []).includes(key)
            );
          }).length;

          return (
            <div
              key={group.key}
              className="rounded-[24px] border border-slate-200 bg-white p-5 hover:border-teal-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800">
                      {group.label}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {group.type}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg">
                  {activeInGroup} / {group.perms.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.perms.map((perm) => {
                  const key = `${group.key}_${perm.toLowerCase().replace(/\s+/g, "_")}`;
                  const isGranted =
                    hasPerm(role, key) ||
                    (user?.permissions || []).includes(key);
                  return (
                    <PermissionChip
                      key={key}
                      label={perm}
                      granted={isGranted}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
