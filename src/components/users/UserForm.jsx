import React, { useState, useMemo } from "react";
import { Upload, ShieldCheck, Plus, X } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import PermissionChip from "../common/PermissionChip";
import {
  getCount,
  PERM_GROUPS,
} from "../../pages/RolesAndPermissions/RoleData";

const DOC_OPTIONS = ["Aadhaar Card", "PAN Card", "Photo", "ID Card"];

/**
 * createInitialForm prepares the internal state structure for the form.
 *
 * @param {Object} user - The user object for editing, or null for creation.
 */
function createInitialForm(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    employeeId: user?.employeeId || "",
    trustId: user?.trustId || "",
    sanghId: user?.sanghId || "",
    departmentId: user?.departmentId || "",
    roleId: user?.roleId || "",
    status: user?.status || "Active",
    notes: user?.notes || "",
    avatar: user?.avatar || "",
    extraPermissions: Array.isArray(user?.permissions) ? user.permissions : [],
    requiredDocuments: Array.isArray(user?.starterDocuments)
      ? user.starterDocuments
      : [],
  };
}

/**
 * UserForm component handles the creation and editing of user profiles.
 * It features multi-section layout and dependent organizational dropdowns.
 */
export default function UserForm({
  user,
  roles = [],
  trusts = [],
  sanghs = [],
  departments = [],
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(() => createInitialForm(user));
  const [errors, setErrors] = useState({});
  const [permissionToAdd, setPermissionToAdd] = useState("");

  // Dependent Dropdown Logic: Sangh filtered by selected Trust
  const availableSanghs = useMemo(() => {
    if (!form.trustId) return [];
    return sanghs.filter((s) => Number(s.trustId) === Number(form.trustId));
  }, [form.trustId, sanghs]);

  // Dependent Dropdown Logic: Department filtered by selected Sangh
  const availableDepartments = useMemo(() => {
    if (!form.sanghId) return [];
    return departments.filter(
      (d) => Number(d.sanghId) === Number(form.sanghId),
    );
  }, [form.sanghId, departments]);

  // Resolve selected role metadata for count and description display
  const selectedRole = useMemo(() => {
    return roles.find((r) => Number(r.id) === Number(form.roleId)) || null;
  }, [form.roleId, roles]);

  // Filter available permissions for the custom override dropdown
  const availableExtraPermissions = useMemo(() => {
    return PERM_GROUPS.flatMap((group) =>
      group.perms.map((perm) => {
        const key = `${group.key}_${perm.toLowerCase().replace(/\s+/g, "_")}`;
        return { key, label: `${group.label} - ${perm}` };
      }),
    ).filter((opt) => !form.extraPermissions.includes(opt.key));
  }, [form.extraPermissions]);

  const updateField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Cascade reset child dropdowns when parent selection changes
      if (key === "trustId") {
        next.sanghId = "";
        next.departmentId = "";
      }
      if (key === "sanghId") {
        next.departmentId = "";
      }
      return next;
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) =>
      updateField("avatar", String(loadEvent.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const toggleDocument = (doc) => {
    setForm((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter((d) => d !== doc)
        : [...prev.requiredDocuments, doc],
    }));
  };

  const toggleExtraPermission = (permKey) => {
    setForm((prev) => ({
      ...prev,
      extraPermissions: prev.extraPermissions.includes(permKey)
        ? prev.extraPermissions.filter((k) => k !== permKey)
        : [...prev.extraPermissions, permKey],
    }));
  };

  const addPermission = () => {
    if (!permissionToAdd) return;
    toggleExtraPermission(permissionToAdd);
    setPermissionToAdd("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full Name is required";
    if (!form.phone.trim()) errs.phone = "Phone Number is required";
    if (!form.trustId) errs.trustId = "Trust selection is required";
    if (!form.sanghId) errs.sanghId = "Sangh selection is required";
    if (!form.departmentId)
      errs.departmentId = "Department selection is required";
    if (!form.roleId) errs.roleId = "Role assignment is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      permissions: form.extraPermissions,
      starterDocuments: form.requiredDocuments,
    });
  };

  const sectionCls =
    "bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4";
  const labelCls = "block text-[13px] font-bold text-slate-700 mb-1.5 ml-1";
  const selectCls =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all cursor-pointer appearance-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Section 1: Basic Information */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-bold text-slate-800">
            Basic Information
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Section 1/4
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-teal-50/30 border border-teal-100/50">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal-600 text-white text-2xl font-bold">
                  {form.name ? form.name[0].toUpperCase() : "?"}
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-600 rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer shadow-sm hover:bg-teal-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-[14px] font-bold text-slate-800">
              Profile Photo
            </h4>
            <p className="text-[12px] text-slate-400">
              Click the upload icon to set a user avatar. Supported: JPG, PNG.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Bhai"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="ramesh@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
            required
          />
          <Input
            label="Employee ID"
            placeholder="EMP-1234"
            value={form.employeeId}
            onChange={(e) => updateField("employeeId", e.target.value)}
          />
        </div>
      </div>

      {/* Section 2: Organization Mapping */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-bold text-slate-800">
            Organization Mapping
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Section 2/4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className={labelCls}>
              Assign Trust <span className="text-rose-500">*</span>
            </label>
            <select
              className={selectCls}
              value={form.trustId}
              onChange={(e) => updateField("trustId", e.target.value)}
            >
              <option value="">Select Trust</option>
              {trusts.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.trustId && (
              <p className="text-xs text-rose-500 mt-1">{errors.trustId}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>
              Select Sangh <span className="text-rose-500">*</span>
            </label>
            <select
              className={`${selectCls} ${!form.trustId ? "opacity-50 cursor-not-allowed" : ""}`}
              value={form.sanghId}
              onChange={(e) => updateField("sanghId", e.target.value)}
              disabled={!form.trustId}
            >
              <option value="">Select Sangh</option>
              {availableSanghs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.sanghId && (
              <p className="text-xs text-rose-500 mt-1">{errors.sanghId}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              className={`${selectCls} ${!form.sanghId ? "opacity-50 cursor-not-allowed" : ""}`}
              value={form.departmentId}
              onChange={(e) => updateField("departmentId", e.target.value)}
              disabled={!form.sanghId}
            >
              <option value="">Select Dept</option>
              {availableDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.departmentId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Role & Access */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-bold text-slate-800">
            Role & Access
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Section 3/4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={labelCls}>
                Assign Role <span className="text-rose-500">*</span>
              </label>
              <select
                className={selectCls}
                value={form.roleId}
                onChange={(e) => updateField("roleId", e.target.value)}
              >
                <option value="">Select System Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-xs text-rose-500 mt-1">{errors.roleId}</p>
              )}
            </div>

            {selectedRole && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span className="text-[13px] font-bold text-slate-700">
                    {selectedRole.name}
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                  {selectedRole.description}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="text-[11px] font-bold text-slate-400">
                    BASE PERMS:{" "}
                    <span className="text-teal-600 ml-1">
                      {getCount(selectedRole)}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">
                    EXTRA OVERRIDES:{" "}
                    <span className="text-sky-600 ml-1">
                      {form.extraPermissions.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className={labelCls}>Custom Permission Overrides</label>
            <div className="flex gap-2">
              <select
                className={selectCls}
                value={permissionToAdd}
                onChange={(e) => setPermissionToAdd(e.target.value)}
              >
                <option value="">Select extra permission...</option>
                {availableExtraPermissions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                size="sm"
                icon={Plus}
                onClick={addPermission}
                disabled={!permissionToAdd}
                className="rounded-xl px-3"
              />
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
              {form.extraPermissions.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic m-auto">
                  No extra overrides assigned.
                </span>
              ) : (
                form.extraPermissions.map((pk) => (
                  <div key={pk} className="group relative">
                    <PermissionChip
                      label={pk.split("_").slice(1).join(" ")}
                      granted
                    />
                    <button
                      type="button"
                      onClick={() => toggleExtraPermission(pk)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Required Documents */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-bold text-slate-800">
            Required Documents
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Section 4/4
          </span>
        </div>
        <p className="text-[12px] text-slate-500 mb-4 font-medium">
          Select the initial documents required for verification during
          onboarding.
        </p>

        <div className="flex flex-wrap gap-3">
          {DOC_OPTIONS.map((doc) => {
            const isSelected = form.requiredDocuments.includes(doc);
            return (
              <button
                key={doc}
                type="button"
                onClick={() => toggleDocument(doc)}
                className={`px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all border ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {doc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl font-bold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-8 py-2.5 rounded-xl font-bold shadow-lg"
        >
          {user ? "Save Profile Changes" : "Register New User"}
        </Button>
      </div>
    </form>
  );
}
