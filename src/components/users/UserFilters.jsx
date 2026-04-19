import React from "react";
import { Plus, Search } from "lucide-react";
import SearchBar from "../common/SearchBar";
import Button from "../common/Button";
import FilterButton from "../common/FilterButton";

/**
 * UserFilters component provides a consolidated interface for searching,
 * filtering, and performing actions on the User Management list.
 *
 * @param {string} search - Current search query.
 * @param {Function} onSearchChange - Callback for search input changes.
 * @param {Object} filters - Current active filter values.
 * @param {Function} onFilterChange - Callback when a specific filter is changed.
 * @param {Function} onClearFilters - Callback to reset all filters.
 * @param {Function} onAddUser - Action for the Add User button.
 * @param {Function} onExport - Action for the Export button.
 * @param {Function} onBulkAssign - Action for the Bulk Assign Role button.
 * @param {Object} options - Lists for dropdowns (roles, trusts, sanghs, departments).
 */
export default function UserFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  onAddUser,
  onExport,
  onBulkAssign,
  options = {},
}) {
  // Configuration for the FilterBar module
  const filterOptions = [
    {
      key: "status",
      placeholder: "Status",
      items: ["Active", "Inactive"],
    },
    {
      key: "trustId",
      placeholder: "Trust",
      items: options.trusts || [],
    },
    {
      key: "sanghId",
      placeholder: "Sangh",
      items: options.sanghs || [],
    },
    {
      key: "departmentId",
      placeholder: "Department",
      items: options.departments || [],
    },
    {
      key: "roleId",
      placeholder: "Role",
      items: options.roles || [],
    },
    {
      key: "approvalStatus",
      placeholder: "Approval Status",
      items: ["Approved", "Pending", "Rejected"],
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 font-sans">
      {/* Left side: Search - Location Style */}
      <div className="relative w-full md:w-80 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Right side: Actions & Filter Button */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative">
        <FilterButton
          filters={filters}
          options={filterOptions}
          onChange={onFilterChange}
          onClear={onClearFilters}
        />
        <Button
          variant="primary"
          icon={Plus}
          onClick={onAddUser}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white font-bold px-5 h-[36px] rounded-lg shadow-md text-sm active:scale-95 transition-all"
        >
          ADD USER
        </Button>
      </div>
    </div>
  );
}
