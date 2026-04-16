import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  UserCheck,
  HandHeart,
  Shield,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Dna,
  Droplets,
  Map,
  Contact,
  Star,
  Clock,
  Zap,
  Heart,
  ChevronDown,
} from "lucide-react";
import CommonPageLayout from "../../../components/common/CommonPageLayout";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import FilterButton from "../../../components/common/FilterButton";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DatePicker from "../../../components/common/DatePicker";

// ─── Initial form shapes ───────────────────────────────────────────────────────
const INITIAL_FAMILY = {
  family_name: "",
  family_head: "",
  members_count: "",
  phone: "",
  email: "",
  birthDate: "",
  gender: "",
  bloodGroup: "",
  city: "",
  address: "",
  status: "Active",
};

const INITIAL_MEMBER = {
  name: "",
  family: "",
  role: "",
  age: "",
  gender: "",
  blood_group: "",
  mobile: "",
  email: "",
  birthDate: "",
  city: "",
  address: "",
  status: "Active",
};

const INITIAL_VOLUNTEER = {
  name: "",
  phones: "",
  skill: "",
  experience: "",
  availability: "",
  interest: "",
  email: "",
  birthDate: "",
  gender: "",
  bloodGroup: "",
  city: "",
  address: "",
  status: "Active",
};

// ─── Dummy seed data ───────────────────────────────────────────────────────────
const SEED_FAMILIES = [
  {
    id: 1,
    family_name: "Shah Family",
    family_head: "Rajesh Shah",
    members_count: 5,
    phone: "9876543210",
    email: "rajesh.shah@example.com",
    birthDate: "12/05/1980",
    gender: "Male",
    bloodGroup: "O+",
    city: "Mumbai",
    address: "123, Jain Society, Borivali West",
    status: "Active",
  },
  {
    id: 2,
    family_name: "Mehta Family",
    family_head: "Suresh Mehta",
    members_count: 4,
    phone: "9825011223",
    email: "suresh.m@example.com",
    birthDate: "22/08/1975",
    gender: "Male",
    bloodGroup: "A+",
    city: "Ahmedabad",
    address: "45, Adarsh Nagar, Satellite",
    status: "Active",
  },
  {
    id: 3,
    family_name: "Jain Family",
    family_head: "Amit Jain",
    members_count: 3,
    phone: "9988776655",
    email: "amit.jain@example.com",
    birthDate: "05/12/1990",
    gender: "Male",
    bloodGroup: "B+",
    city: "Indore",
    address: "12, Mahaveer Marg",
    status: "Inactive",
  },
];

const SEED_MEMBERS = [
  {
    id: 1,
    name: "Anik Shah",
    family: "Rajesh Shah",
    role: "Son",
    age: 24,
    mobile: "9876543211",
    email: "anik.shah@example.com",
    birthDate: "10/03/2000",
    gender: "Male",
    blood_group: "O+",
    city: "Mumbai",
    address: "123, Jain Society, Borivali West",
    status: "Active",
  },
  {
    id: 2,
    name: "Megha Shah",
    family: "Rajesh Shah",
    role: "Daughter",
    age: 21,
    mobile: "9876543212",
    email: "megha.shah@example.com",
    birthDate: "14/07/2003",
    gender: "Female",
    blood_group: "A+",
    city: "Mumbai",
    address: "123, Jain Society, Borivali West",
    status: "Active",
  },
  {
    id: 3,
    name: "Rita Shah",
    family: "Rajesh Shah",
    role: "Wife",
    age: 48,
    mobile: "9876543213",
    email: "rita.shah@example.com",
    birthDate: "20/01/1976",
    gender: "Female",
    blood_group: "B+",
    city: "Mumbai",
    address: "123, Jain Society, Borivali West",
    status: "Active",
  },
];

const SEED_VOLUNTEERS = [
  {
    id: 1,
    name: "Vikas Jain",
    phones: "9876543210",
    skill: "Event Management",
    experience: "3 Years",
    availability: "Weekends",
    interest: "Education",
    email: "vikas.jain@example.com",
    birthDate: "15/06/1992",
    gender: "Male",
    bloodGroup: "O+",
    city: "Surat",
    address: "55, Volunteer Colony, Ring Road",
    status: "Active",
  },
  {
    id: 2,
    name: "Pratik Mehta",
    phones: "9825011223",
    skill: "Public Relations",
    experience: "5 Years",
    availability: "Weekdays",
    interest: "Social Work",
    email: "pratik.m@example.com",
    birthDate: "22/02/1988",
    gender: "Male",
    bloodGroup: "A-",
    city: "Rajkot",
    address: "10, Seva Nagar, Station Road",
    status: "Active",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Members() {
  const [activeTab, setActiveTab] = useState("Family");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "" });
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const tabs = ["Family", "Individual Member", "Volunteers"];

  const [families, setFamilies] = useState(SEED_FAMILIES);
  const [individualMembers, setIndividualMembers] = useState(SEED_MEMBERS);
  const [volunteers, setVolunteers] = useState(SEED_VOLUNTEERS);

  const stats = useMemo(
    () => [
      {
        title: "Total Family",
        value: families.length,
        icon: Users,
        color: "teal",
      },
      {
        title: "Total Individual Member",
        value: individualMembers.length,
        icon: UserCheck,
        color: "emerald",
      },
      {
        title: "Volunteers",
        value: volunteers.length,
        icon: HandHeart,
        color: "sky",
      },
      {
        title: "Active Volunteers",
        value: volunteers.filter((v) => v.status === "Active").length,
        icon: Shield,
        color: "amber",
      },
    ],
    [families, individualMembers, volunteers],
  );

  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const getInitialForm = (tab) => {
    if (tab === "Family") return INITIAL_FAMILY;
    if (tab === "Individual Member") return INITIAL_MEMBER;
    return INITIAL_VOLUNTEER;
  };

  const openModal = (type, data = null) => {
    setModal({ type, data });
    setFormData(data || getInitialForm(activeTab));
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {};
    const phoneField =
      activeTab === "Volunteers" ? formData.phones : formData.phone;
    const mobileField = formData.mobile;
    if (activeTab === "Individual Member") {
      if (mobileField && !/^\d{10}$/.test(mobileField))
        newErrors.mobile = "Mobile must be 10 digits";
    } else {
      if (phoneField && !/^\d{10}$/.test(phoneField))
        newErrors.phone = "Phone must be 10 digits";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const isEdit = modal.type === "edit";

    if (activeTab === "Family") {
      setFamilies((prev) =>
        isEdit
          ? prev.map((f) =>
              f.id === modal.data.id ? { ...f, ...formData } : f,
            )
          : [...prev, { ...formData, id: Date.now() }],
      );
    } else if (activeTab === "Individual Member") {
      setIndividualMembers((prev) =>
        isEdit
          ? prev.map((m) =>
              m.id === modal.data.id ? { ...m, ...formData } : m,
            )
          : [...prev, { ...formData, id: Date.now() }],
      );
      // Auto-increment family members_count when adding a new member
      if (!isEdit && formData.family_id) {
        setFamilies((prev) =>
          prev.map((f) =>
            f.id === formData.family_id
              ? { ...f, members_count: (Number(f.members_count) || 0) + 1 }
              : f,
          ),
        );
      }
    } else {
      setVolunteers((prev) =>
        isEdit
          ? prev.map((v) =>
              v.id === modal.data.id ? { ...v, ...formData } : v,
            )
          : [...prev, { ...formData, id: Date.now() }],
      );
    }

    setModal({ type: null, data: null });
    setSaving(false);
  };

  const handleDelete = () => {
    if (activeTab === "Family")
      setFamilies((prev) => prev.filter((f) => f.id !== modal.data.id));
    else if (activeTab === "Individual Member")
      setIndividualMembers((prev) =>
        prev.filter((m) => m.id !== modal.data.id),
      );
    else setVolunteers((prev) => prev.filter((v) => v.id !== modal.data.id));
    setModal({ type: null, data: null });
  };

  const updateStatus = (tab, id) => {
    const flip = (s) => (s === "Active" ? "Inactive" : "Active");
    if (tab === "Family")
      setFamilies((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: flip(f.status) } : f)),
      );
    else if (tab === "Individual Member")
      setIndividualMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: flip(m.status) } : m)),
      );
    else
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: flip(v.status) } : v)),
      );
  };

  const getActiveData = () => {
    if (activeTab === "Family") return families;
    if (activeTab === "Individual Member") return individualMembers;
    return volunteers;
  };

  const filteredData = useMemo(() => {
    let data = getActiveData();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    if (filters.status)
      data = data.filter((item) => item.status === filters.status);
    return data;
  }, [
    activeTab,
    searchQuery,
    filters,
    families,
    individualMembers,
    volunteers,
  ]);

  const paginatedData = useMemo(() => {
    const s = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(s, s + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  // ── Action buttons renderer ──────────────────────────────────────────────
  const actionRender = (_, r) => {
    const styles = {
      teal: "bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white",
      sky: "bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white",
      rose: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white",
    };
    return (
      <div className="flex gap-2 justify-center">
        {[
          { icon: Eye, color: "teal", t: "view" },
          { icon: Edit, color: "sky", t: "edit" },
          { icon: Trash2, color: "rose", t: "delete" },
        ].map((a) => (
          <button
            key={a.t}
            onClick={() => openModal(a.t, r)}
            className={`p-1.5 rounded-xl transition-all duration-200 ${styles[a.color]}`}
            title={a.t.charAt(0).toUpperCase() + a.t.slice(1)}
          >
            <a.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    );
  };

  // ── Status toggle renderer ───────────────────────────────────────────────
  const statusRender = (s, row) => (
    <button
      onClick={() => updateStatus(activeTab, row.id)}
      className={`relative inline-flex h-5 w-9 items-center rounded-xl px-[3px] transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-teal-500/20 ${s === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
    >
      <span
        className={`h-3.5 w-3.5 rounded-xl bg-white shadow-sm transition-all duration-300 ${s === "Active" ? "translate-x-[16px]" : "translate-x-0"}`}
      />
    </button>
  );

  // ── Column definitions ───────────────────────────────────────────────────
  const srNo = {
    key: "sr_no",
    label: "Sr. No",
    align: "center",
    render: (_, __, i) => (
      <span className="text-slate-500 font-semibold">
        {(currentPage - 1) * recordsPerPage + i + 1}
      </span>
    ),
  };

  const columns = {
    Family: [
      srNo,
      {
        key: "family_name",
        label: "Family Name",
        align: "center",
        render: (v) => <span className="font-bold text-teal-700">{v}</span>,
      },
      { key: "family_head", label: "Family Head", align: "center" },
      { key: "members_count", label: "Members", align: "center" },
      { key: "address", label: "Registered Address", align: "center" },
      { key: "status", label: "Status", align: "center", render: statusRender },
      {
        key: "actions",
        label: "Action",
        align: "center",
        render: actionRender,
      },
    ],
    "Individual Member": [
      srNo,
      {
        key: "name",
        label: "Member Name",
        align: "center",
        render: (v) => <span className="font-bold text-teal-700">{v}</span>,
      },
      { key: "family", label: "Family Head", align: "center" },
      { key: "role", label: "Relationship", align: "center" },
      { key: "age", label: "Age", align: "center" },
      { key: "status", label: "Status", align: "center", render: statusRender },
      {
        key: "actions",
        label: "Action",
        align: "center",
        render: actionRender,
      },
    ],
    Volunteers: [
      srNo,
      {
        key: "name",
        label: "Volunteer Name",
        align: "center",
        render: (v) => <span className="font-bold text-teal-700">{v}</span>,
      },
      { key: "phones", label: "Contact Number", align: "center" },
      { key: "skill", label: "Primary Skill", align: "center" },
      { key: "experience", label: "Experience", align: "center" },
      { key: "status", label: "Status", align: "center", render: statusRender },
      {
        key: "actions",
        label: "Action",
        align: "center",
        render: actionRender,
      },
    ],
  };

  // ── Field helpers ────────────────────────────────────────────────────────
  const field = (key) => ({
    value: formData[key] ?? "",
    onChange: (e) => setFormData((p) => ({ ...p, [key]: e.target.value })),
  });

  const clearErr = (k) => setErrors((e) => ({ ...e, [k]: null }));

  // ── Add/Edit form label ──────────────────────────────────────────────────
  const addLabel =
    activeTab === "Individual Member"
      ? "Member"
      : activeTab === "Volunteers"
        ? "Volunteer"
        : "Family";

  return (
    <CommonPageLayout title="Member Management" stats={stats}>
      {/* Tab Switcher */}
      <div className="bg-white rounded-xl border border-slate-100 p-1 mb-5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery("");
              setFilters({ status: "" });
              setCurrentPage(1);
            }}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
              activeTab === tab
                ? "bg-teal-50 text-teal-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeTab}...`}
              className="w-full h-[36px] pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            <FilterButton
              filters={filters}
              options={[
                {
                  key: "status",
                  placeholder: "Status",
                  items: [
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ],
                },
              ]}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
              onClear={() => setFilters({ status: "" })}
            />
            <button
              onClick={() => openModal("add")}
              className="h-[36px] shrink-0 flex items-center gap-2 bg-teal-600 text-white px-4 rounded-xl text-[13px] font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95 border border-teal-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add {addLabel}</span>
            </button>
          </div>
        </div>

        <Table
          columns={columns[activeTab]}
          data={paginatedData}
          loading={loading}
          skipCard
        />
        <Pagination
          currentPage={currentPage}
          totalRecords={filteredData.length}
          recordsPerPage={recordsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={setRecordsPerPage}
        />
      </div>

      {/* ═══ Add / Edit Modal ═══════════════════════════════════════════════════ */}
      <Modal
        isOpen={modal.type === "add" || modal.type === "edit"}
        onClose={() => setModal({ type: null, data: null })}
        size={activeTab === "Individual Member" ? (formData.family_id ? "xl" : "md") : "xxl"}
        title={`${modal.type === "edit" ? "Edit" : "Add"} ${addLabel}`}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setModal({ type: null, data: null })}
            >
              Cancel
            </Button>
            <Button loading={saving} onClick={handleSave}>
              {modal.type === "edit" ? "Update" : "Add"} {addLabel}
            </Button>
          </div>
        }
      >
        <div className="space-y-8 px-1 pb-2">
          {/* ── FAMILY FORM ── */}
          {activeTab === "Family" && (
            <>
              <Section title="Family Info" icon={Users} color="teal">
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Family Name"
                    {...field("family_name")}
                    icon={Users}
                    placeholder="e.g. Shah Family"
                    className="h-[36px]"
                    containerClass="md:col-span-2"
                    required
                  />
                  <Input
                    label="Members Count"
                    {...field("members_count")}
                    icon={Users}
                    placeholder="Number of members"
                    className="h-[36px]"
                  />
                </div>
              </Section>
              <Section title="Family Head Details" icon={Contact} color="sky">
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Family Head Name"
                    {...field("family_head")}
                    icon={Users}
                    placeholder="Enter head's full name"
                    className="h-[36px]"
                    containerClass="md:col-span-2"
                    required
                  />
                  <DatePicker
                    label="Birth Date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, birthDate: e.target.value }))
                    }
                    icon={Calendar}
                    placeholder="Select Date"
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, phone: e.target.value }));
                      clearErr("phone");
                    }}
                    icon={Phone}
                    placeholder="10-digit number"
                    className="h-[36px]"
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }));
                      clearErr("email");
                    }}
                    icon={Mail}
                    placeholder="name@example.com"
                    className="h-[36px]"
                    error={errors.email}
                    containerClass="md:col-span-2"
                  />
                  <CustomSelect
                    label="Gender"
                    value={formData.gender}
                    options={["Male", "Female", "Other"]}
                    onChange={(v) => setFormData((p) => ({ ...p, gender: v }))}
                    icon={Dna}
                    placeholder="Select Gender"
                  />
                  <CustomSelect
                    label="Blood Group"
                    value={formData.bloodGroup}
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, bloodGroup: v }))
                    }
                    icon={Droplets}
                    placeholder="Select Blood Group"
                  />
                </div>
              </Section>
              <Section title="Location" icon={MapPin} color="amber">
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="City"
                    {...field("city")}
                    icon={Map}
                    placeholder="Enter city"
                    className="h-[36px]"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                      Registered Address
                    </label>
                    <input
                      type="text"
                      className="w-full h-[36px] px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all shadow-sm"
                      placeholder="Enter complete address..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ── INDIVIDUAL MEMBER FORM ── */}
          {activeTab === "Individual Member" &&
            (() => {
              const selectedFamily =
                families.find((f) => f.id === formData.family_id) || null;
              const familyLocked = !selectedFamily;

              return (
                <>
                  {/* Select Family */}
                  <Section title="Select Family" icon={Users} color="teal">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <CustomSelect
                          label="Select Family"
                          value={
                            selectedFamily ? selectedFamily.family_name : ""
                          }
                          options={families.map((f) => f.family_name)}
                          onChange={(name) => {
                            const fam = families.find(
                              (f) => f.family_name === name,
                            );
                            setFormData((p) => ({
                              ...p,
                              family_id: fam?.id ?? "",
                              family: fam?.family_head ?? "",
                            }));
                          }}
                          icon={Users}
                          placeholder="— Choose a family —"
                        />
                      </div>
                      {/* Family Head chip — appears once family selected */}
                      {selectedFamily && (
                        <div className="flex flex-col justify-end">
                          <label className="text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                            Family Head
                          </label>
                          <div className="h-[36px] flex items-center gap-2.5 px-4 rounded-xl bg-teal-50 border border-teal-200">
                            <Users className="w-4 h-4 text-teal-500 flex-shrink-0" />
                            <span className="text-[13px] font-bold text-teal-700 truncate">
                              {selectedFamily.family_head}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Locked placeholder when no family selected */}
                    {familyLocked && (
                      <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">
                          Please select a family above to unlock member details.
                        </p>
                      </div>
                    )}
                  </Section>

                  {/* Steps 2 & 3 — unlock once family selected */}
                  {!familyLocked && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                      <Section title="Member Info" icon={Contact} color="sky">
                        <div className="grid md:grid-cols-3 gap-6">
                          <Input
                            label="Member Name"
                            {...field("name")}
                            icon={Users}
                            placeholder="Full Name"
                            className="h-[36px]"
                            containerClass="md:col-span-2"
                            required
                          />
                          <Input
                            label="Relationship"
                            {...field("role")}
                            icon={Heart}
                            placeholder="e.g. Son, Wife"
                            className="h-[36px]"
                          />
                          <Input
                            label="Age"
                            {...field("age")}
                            icon={Calendar}
                            placeholder="Age in years"
                            className="h-[36px]"
                          />
                          <Input
                            label="Mobile"
                            value={formData.mobile}
                            onChange={(e) => {
                              setFormData((p) => ({
                                ...p,
                                mobile: e.target.value,
                              }));
                              clearErr("mobile");
                            }}
                            icon={Phone}
                            placeholder="10-digit number"
                            className="h-[36px]"
                            error={errors.mobile}
                            required
                          />
                          <Input
                            label="Email"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData((p) => ({
                                ...p,
                                email: e.target.value,
                              }));
                              clearErr("email");
                            }}
                            icon={Mail}
                            placeholder="name@example.com"
                            className="h-[36px]"
                            error={errors.email}
                          />
                          <DatePicker
                            label="Birth Date"
                            value={formData.birthDate}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                birthDate: e.target.value,
                              }))
                            }
                            icon={Calendar}
                            placeholder="Select Date"
                          />
                          <CustomSelect
                            label="Gender"
                            value={formData.gender}
                            options={["Male", "Female", "Other"]}
                            onChange={(v) =>
                              setFormData((p) => ({ ...p, gender: v }))
                            }
                            icon={Dna}
                            placeholder="Select Gender"
                          />
                          <CustomSelect
                            label="Blood Group"
                            value={formData.blood_group}
                            options={[
                              "A+",
                              "A-",
                              "B+",
                              "B-",
                              "AB+",
                              "AB-",
                              "O+",
                              "O-",
                            ]}
                            onChange={(v) =>
                              setFormData((p) => ({ ...p, blood_group: v }))
                            }
                            icon={Droplets}
                            placeholder="Select Blood Group"
                          />
                        </div>
                      </Section>
                      <Section title="Location" icon={MapPin} color="amber">
                        <div className="grid md:grid-cols-3 gap-6">
                          <Input
                            label="City"
                            {...field("city")}
                            icon={Map}
                            placeholder="Enter city"
                            className="h-[36px]"
                          />
                          <div className="md:col-span-2">
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                              Address
                            </label>
                            <input
                              type="text"
                              className="w-full h-[36px] px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all shadow-sm"
                              placeholder="Enter complete address..."
                              value={formData.address}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  address: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </Section>
                    </div>
                  )}
                </>
              );
            })()}

          {/* ── VOLUNTEER FORM ── */}
          {activeTab === "Volunteers" && (
            <>
              <Section title="Volunteer Info" icon={HandHeart} color="teal">
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Volunteer Name"
                    {...field("name")}
                    icon={Users}
                    placeholder="Full Name"
                    className="h-[36px]"
                    containerClass="md:col-span-2"
                    required
                  />
                  <Input
                    label="Primary Skill"
                    {...field("skill")}
                    icon={Star}
                    placeholder="e.g. Event Mgmt"
                    className="h-[36px]"
                  />
                  <Input
                    label="Experience"
                    {...field("experience")}
                    icon={Clock}
                    placeholder="e.g. 3 Years"
                    className="h-[36px]"
                  />
                  <Input
                    label="Availability"
                    {...field("availability")}
                    icon={Calendar}
                    placeholder="e.g. Weekends"
                    className="h-[36px]"
                  />
                  <Input
                    label="Area of Interest"
                    {...field("interest")}
                    icon={Zap}
                    placeholder="e.g. Education"
                    className="h-[36px]"
                  />
                </div>
              </Section>
              <Section title="Contact & Identity" icon={Contact} color="sky">
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Phone"
                    value={formData.phones}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, phones: e.target.value }));
                      clearErr("phone");
                    }}
                    icon={Phone}
                    placeholder="10-digit number"
                    className="h-[36px]"
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }));
                      clearErr("email");
                    }}
                    icon={Mail}
                    placeholder="name@example.com"
                    className="h-[36px]"
                    error={errors.email}
                    containerClass="md:col-span-2"
                  />
                  <DatePicker
                    label="Birth Date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, birthDate: e.target.value }))
                    }
                    icon={Calendar}
                    placeholder="Select Date"
                  />
                  <CustomSelect
                    label="Gender"
                    value={formData.gender}
                    options={["Male", "Female", "Other"]}
                    onChange={(v) => setFormData((p) => ({ ...p, gender: v }))}
                    icon={Dna}
                    placeholder="Select Gender"
                  />
                  <CustomSelect
                    label="Blood Group"
                    value={formData.bloodGroup}
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, bloodGroup: v }))
                    }
                    icon={Droplets}
                    placeholder="Select Blood Group"
                  />
                </div>
              </Section>
              <Section title="Location" icon={MapPin} color="amber">
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="City"
                    {...field("city")}
                    icon={Map}
                    placeholder="Enter city"
                    className="h-[36px]"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full h-[36px] px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all shadow-sm"
                      placeholder="Enter complete address..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </Section>
            </>
          )}
        </div>
      </Modal>

      {/* ═══ View Modal ═══════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modal.type === "view"}
        onClose={() => setModal({ type: null, data: null })}
        title={`${addLabel} Details`}
        size="xl"
      >
        {modal.data && (
          <div className="space-y-8">
            {/* ── FAMILY VIEW ── */}
            {activeTab === "Family" && (
              <>
                <Section title="Family Info" icon={Users} color="teal">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="Family Name"
                      value={modal.data.family_name}
                      icon={Users}
                    />
                    <DetailField
                      label="Family Head"
                      value={modal.data.family_head}
                      icon={Users}
                    />
                    <DetailField
                      label="Members Count"
                      value={modal.data.members_count}
                      icon={Users}
                    />
                  </div>
                </Section>
                <Section
                  title="Head Contact & Identity"
                  icon={Contact}
                  color="sky"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="Phone"
                      value={modal.data.phone}
                      icon={Phone}
                    />
                    <DetailField
                      label="Email"
                      value={modal.data.email}
                      icon={Mail}
                      containerClass="md:col-span-2"
                    />
                    <DetailField
                      label="Birth Date"
                      value={modal.data.birthDate}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Gender"
                      value={modal.data.gender}
                      icon={Dna}
                    />
                    <DetailField
                      label="Blood Group"
                      value={modal.data.bloodGroup}
                      icon={Droplets}
                    />
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                        Status
                      </p>
                      <span
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold ${modal.data.status === "Active" ? "bg-emerald-100/50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                      >
                        {modal.data.status}
                      </span>
                    </div>
                  </div>
                </Section>
                <Section title="Location" icon={MapPin} color="amber">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="City"
                      value={modal.data.city}
                      icon={Map}
                    />
                    <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Address
                        </p>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {modal.data.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ── INDIVIDUAL MEMBER VIEW ── */}
            {activeTab === "Individual Member" && (
              <>
                <Section title="Basic Info" icon={Users} color="teal">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="Member Name"
                      value={modal.data.name}
                      icon={Users}
                    />
                    <DetailField
                      label="Family Head"
                      value={modal.data.family}
                      icon={Users}
                    />
                    <DetailField
                      label="Relationship"
                      value={modal.data.role}
                      icon={Heart}
                    />
                    <DetailField
                      label="Age"
                      value={modal.data.age ? `${modal.data.age} yrs` : null}
                      icon={Calendar}
                    />
                  </div>
                </Section>
                <Section title="Contact & Identity" icon={Contact} color="sky">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="Mobile"
                      value={modal.data.mobile}
                      icon={Phone}
                    />
                    <DetailField
                      label="Email"
                      value={modal.data.email}
                      icon={Mail}
                      containerClass="md:col-span-2"
                    />
                    <DetailField
                      label="Birth Date"
                      value={modal.data.birthDate}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Gender"
                      value={modal.data.gender}
                      icon={Dna}
                    />
                    <DetailField
                      label="Blood Group"
                      value={modal.data.blood_group}
                      icon={Droplets}
                    />
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                        Status
                      </p>
                      <span
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold ${modal.data.status === "Active" ? "bg-emerald-100/50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                      >
                        {modal.data.status}
                      </span>
                    </div>
                  </div>
                </Section>
                <Section title="Location" icon={MapPin} color="amber">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="City"
                      value={modal.data.city}
                      icon={Map}
                    />
                    <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Address
                        </p>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {modal.data.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ── VOLUNTEER VIEW ── */}
            {activeTab === "Volunteers" && (
              <>
                <Section title="Volunteer Info" icon={HandHeart} color="teal">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="Volunteer Name"
                      value={modal.data.name}
                      icon={Users}
                    />
                    <DetailField
                      label="Primary Skill"
                      value={modal.data.skill}
                      icon={Star}
                    />
                    <DetailField
                      label="Experience"
                      value={modal.data.experience}
                      icon={Clock}
                    />
                    <DetailField
                      label="Availability"
                      value={modal.data.availability}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Area of Interest"
                      value={modal.data.interest}
                      icon={Zap}
                      containerClass="md:col-span-2"
                    />
                  </div>
                </Section>
                <Section title="Contact & Identity" icon={Contact} color="sky">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="Phone"
                      value={modal.data.phones}
                      icon={Phone}
                    />
                    <DetailField
                      label="Email"
                      value={modal.data.email}
                      icon={Mail}
                      containerClass="md:col-span-2"
                    />
                    <DetailField
                      label="Birth Date"
                      value={modal.data.birthDate}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Gender"
                      value={modal.data.gender}
                      icon={Dna}
                    />
                    <DetailField
                      label="Blood Group"
                      value={modal.data.bloodGroup}
                      icon={Droplets}
                    />
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                        Status
                      </p>
                      <span
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold ${modal.data.status === "Active" ? "bg-emerald-100/50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                      >
                        {modal.data.status}
                      </span>
                    </div>
                  </div>
                </Section>
                <Section title="Location" icon={MapPin} color="amber">
                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailField
                      label="City"
                      value={modal.data.city}
                      icon={Map}
                    />
                    <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Address
                        </p>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {modal.data.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </Section>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: null, data: null })}
        onConfirm={handleDelete}
        title={`Delete ${addLabel}`}
        message="Are you sure you want to remove this record? This action cannot be undone."
      />
    </CommonPageLayout>
  );
}

// ─── Shared sub-components (same as CommitteeMembers) ─────────────────────────
const Section = ({ title, icon: Icon, color, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <div
        className={`p-1.5 rounded-xl ${color === "teal" ? "bg-teal-50 text-teal-600" : color === "sky" ? "bg-sky-50 text-sky-600" : color === "amber" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

function DetailField({ label, value, icon: Icon, containerClass = "" }) {
  return (
    <div
      className={`p-3.5 rounded-xl bg-slate-50 border border-slate-100 ${containerClass}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-[13px] font-semibold text-slate-800 truncate">
        {value || "N/A"}
      </p>
    </div>
  );
}

function CustomSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  placeholder = "Select option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const ref = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (
        ref.current && !ref.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggle = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < 200 && rect.top > 200;
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openUp: shouldOpenUp,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <button
          type="button"
          onClick={toggle}
          className="w-full h-[36px] flex items-center justify-between px-4 bg-slate-50/50 border border-slate-200 rounded-xl transition-all outline-none group hover:border-teal-500 hover:bg-white focus:ring-4 focus:ring-teal-50"
        >
          <span
            className={`text-sm truncate ${value ? "text-slate-700 font-medium" : "text-slate-400"}`}
          >
            {value || placeholder}
          </span>
          <div className="flex items-center gap-1.5">
            {Icon && (
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              className={`fixed z-[9999] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] py-1 animate-in fade-in zoom-in-95 duration-200 ${coords.openUp ? "mb-2" : "mt-2"}`}
              style={{
                top: coords.openUp ? "auto" : coords.top,
                bottom: coords.openUp ? window.innerHeight - coords.top : "auto",
                left: coords.left,
                width: coords.width,
              }}
            >
              <div
                className="overflow-y-auto"
                style={{ maxHeight: `${Math.min(options.length, 6) * 40}px` }}
              >
                {options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-slate-50 hover:text-teal-600 transition-colors ${opt === value ? "bg-teal-50 text-teal-700 font-bold border-l-4 border-teal-500" : "text-slate-600"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
}
