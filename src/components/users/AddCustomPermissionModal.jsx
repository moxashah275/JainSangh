import React, { useState, useMemo, useEffect } from "react";
import { Check, ShieldCheck } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";

// Import logic and constants from RoleData
import { PERM_GROUPS, hasPerm } from "../../pages/RolesAndPermissions/RoleData";

/**
 * AddCustomPermissionModal allows administrators to grant specific
 * additional permissions to a user that are not part of their base role.
 *
 * @param {boolean} isOpen - Controls modal visibility.
 * @param {Function} onClose - Callback to close the modal.
 * @param {Function} onSave - Callback receiving the updated array of custom permission keys.
 * @param {Object} user - The user object containing current custom permissions.
 * @param {Object} role - The user's assigned role for identifying base permissions.
 */
export default function AddCustomPermissionModal({
  isOpen,
  onClose,
  onSave,
  user,
  role,
}) {
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Reset local state when modal opens to sync with current user data
  useEffect(() => {
    if (isOpen) {
      setSelectedKeys(user?.permissions || []);
      setSearch("");
    }
  }, [isOpen, user?.permissions]);

  // Flattened list of all permissions with role inheritance metadata for easier filtering
  const permissionPool = useMemo(() => {
    return PERM_GROUPS.flatMap((group) =>
      group.perms.map((perm) => {
        const key = `${group.key}_${perm.toLowerCase().replace(/\s+/g, "_")}`;
        const isFromRole = role && hasPerm(role, key);
        return {
          key,
          label: perm,
          groupLabel: group.label,
          groupKey: group.key,
          isFromRole,
          type: group.type,
        };
      }),
    );
  }, [role]);

  // Filtering logic based on user search query
  const filteredPool = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return permissionPool;
    return permissionPool.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.groupLabel.toLowerCase().includes(q),
    );
  }, [permissionPool, search]);

  const togglePermission = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSave = () => {
    onSave(selectedKeys);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Permission"
      subtitle="Selected permissions will be added as unique overrides for this user."
      size="md"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            className="flex-1 rounded-xl"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="flex-1 rounded-xl" onClick={handleSave}>
            Save Overrides
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 pb-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search modules or actions..."
          />
        </div>

        <div className="space-y-6">
          {PERM_GROUPS.map((group) => {
            const matches = filteredPool.filter(
              (p) => p.groupKey === group.key,
            );
            if (matches.length === 0) return null;

            return (
              <div key={group.key} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {group.label}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-300">
                    {group.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {matches.map((p) => {
                    const isSelected = selectedKeys.includes(p.key);
                    const isDisabled = p.isFromRole;

                    return (
                      <div
                        key={p.key}
                        onClick={() => !isDisabled && togglePermission(p.key)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer group
                          ${
                            isDisabled
                              ? "bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed"
                              : isSelected
                                ? "bg-teal-50 border-teal-200 shadow-sm"
                                : "bg-white border-slate-100 hover:border-teal-200"
                          }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-[13px] font-bold ${isSelected ? "text-teal-700" : "text-slate-700"}`}
                          >
                            {p.label}
                          </span>
                          {isDisabled && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                                Included in Role
                              </span>
                            </div>
                          )}
                        </div>

                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
                          ${
                            isDisabled || isSelected
                              ? "bg-teal-600 border-teal-600"
                              : "bg-white border-slate-200 group-hover:border-teal-400"
                          }`}
                        >
                          {(isDisabled || isSelected) && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={4}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredPool.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <p className="text-[13px] font-bold text-slate-400">
                No matching permissions found
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
