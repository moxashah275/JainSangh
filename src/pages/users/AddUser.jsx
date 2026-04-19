import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserForm from "../../components/users/UserForm";

// Data hooks and logic imports
import {
  INITIAL_USERS,
  INITIAL_USER_DOCS,
  INITIAL_ACTIVITIES,
} from "./userData";
import { INITIAL_ROLES } from "../RolesAndPermissions/RoleData";
import {
  INITIAL_TRUSTS,
  INITIAL_SANGHS,
  INITIAL_DEPARTMENTS,
} from "../organization/orgData";

/**
 * AddUser component provides a dedicated page for onboarding new users into the system.
 * It features a clean top header and handles logic for data persistence and activity logging.
 */
export default function AddUser() {
  const navigate = useNavigate();

  // --- Master Data State (Persisted in LocalStorage to sync with UserList) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users_master");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [docs, setDocs] = useState(() => {
    const saved = localStorage.getItem("user_docs_master");
    return saved ? JSON.parse(saved) : INITIAL_USER_DOCS;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("user_activities_master");
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Keep LocalStorage in sync with state changes
  useEffect(() => {
    localStorage.setItem("users_master", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("user_docs_master", JSON.stringify(docs));
  }, [docs]);
  useEffect(() => {
    localStorage.setItem("user_activities_master", JSON.stringify(activities));
  }, [activities]);

  const handleSave = (formData) => {
    // Generate unique ID and timestamps
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const joinDate = new Date().toISOString().split("T")[0];

    const newUser = {
      ...formData,
      id: newId,
      joined: joinDate,
      lastLogin: null,
      status: "Active",
      approvalStatus: "Approved", // Defaulting for direct administrative creation
    };

    // 1. Update user records
    setUsers((prev) => [...prev, newUser]);

    // 2. Handle document placeholders if required documents were selected
    if (formData.starterDocuments?.length > 0) {
      const newDocs = formData.starterDocuments.map((type, idx) => ({
        id: Date.now() + idx,
        userId: newId,
        type,
        fileName: `${type.toLowerCase().replace(/\s+/g, "_")}_placeholder.pdf`,
        status: "Pending",
        uploadedDate: joinDate,
        uploadedBy: "Admin",
        notes: "Document requirement initiated during onboarding.",
      }));
      setDocs((prev) => [...newDocs, ...prev]);
    }

    // 3. Record the creation activity
    setActivities((prev) => [
      {
        id: Date.now(),
        userId: newId,
        action: "created",
        description: `User onboarded with role: ${INITIAL_ROLES.find((r) => r.id === formData.roleId)?.name || "Unknown"}`,
        doneBy: "Admin",
        date: timestamp,
      },
      ...prev,
    ]);

    // 4. Redirect to main directory
    navigate("/users/all");
  };

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] animate-in fade-in duration-300">
      {/* Sticky Header Section */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/users/all")}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
              Onboard New User
            </h1>
            <p className="text-[12px] text-slate-400 font-medium">
              Create a detailed system profile with organizational mapping
            </p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <UserForm
          roles={INITIAL_ROLES}
          trusts={INITIAL_TRUSTS}
          sanghs={INITIAL_SANGHS}
          departments={INITIAL_DEPARTMENTS}
          onSave={handleSave}
          onCancel={() => navigate("/users/all")}
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.4s ease-out; }
      `,
        }}
      />
    </div>
  );
}
