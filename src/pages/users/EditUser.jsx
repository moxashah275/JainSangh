import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserForm from "../../components/users/UserForm";
import Button from "../../components/common/Button";

// Data hooks and logic imports
import { INITIAL_USERS, INITIAL_ACTIVITIES } from "./userData";
import { INITIAL_ROLES } from "../RolesAndPermissions/RoleData";
import {
  INITIAL_TRUSTS,
  INITIAL_SANGHS,
  INITIAL_DEPARTMENTS,
} from "../organization/orgData";

/**
 * EditUser component provides a dedicated page for updating existing user profiles.
 * It loads user data from master state and handles persistence and activity tracking.
 */
export default function EditUser() {
  const { id } = useParams();
  const userId = Number(id);
  const navigate = useNavigate();

  // --- Master Data State (Persisted in LocalStorage to sync with UserList) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users_master");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
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
    localStorage.setItem("user_activities_master", JSON.stringify(activities));
  }, [activities]);

  // Resolve the specific user record
  const user = useMemo(() => {
    return users.find((u) => u.id === userId);
  }, [users, userId]);

  const handleSave = (formData) => {
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");

    // 1. Update user record in state
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...formData } : u)),
    );

    // 2. Record the update activity
    setActivities((prev) => [
      {
        id: Date.now(),
        userId: userId,
        action: "updated",
        description: "User profile details updated via administrative console.",
        doneBy: "Admin",
        date: timestamp,
      },
      ...prev,
    ]);

    // 3. Redirect back to main directory
    navigate("/users/all");
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center p-10 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ArrowLeft className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-[18px] font-bold text-slate-800 mb-2">
            User Not Found
          </h2>
          <p className="text-[13px] text-slate-400 mb-6 max-w-[240px]">
            The profile you are looking for does not exist or has been removed.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/users/all")}
            className="w-full rounded-xl"
          >
            Return to Directory
          </Button>
        </div>
      </div>
    );
  }

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
              Edit User Profile
            </h1>
            <p className="text-[12px] text-slate-400 font-medium">
              Updating information for{" "}
              <span className="text-slate-600 font-bold">{user.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <UserForm
          user={user}
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
