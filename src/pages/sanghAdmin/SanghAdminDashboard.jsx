import { useNavigate } from "react-router-dom";
import { Users, UserPlus, CalendarDays, ShieldCheck } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";

export default function SanghAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-6 pb-8 bg-[#fafafa] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-teal-700 tracking-tight">
              Sangh Admin Portal
            </h1>
            <p className="text-[13px] font-medium text-slate-400 mt-0.5">
              Manage your members, events and day-to-day operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={CalendarDays}
              onClick={() => navigate("/sangh-admin/activities/events")}
            >
              Plan Event
            </Button>
            <Button
              size="sm"
              icon={UserPlus}
              onClick={() => navigate("/sangh-admin/members/individuals")}
            >
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Families"
            value="1,240"
            icon={Users}
            color="teal"
            trend="up"
            trendValue="+14"
          />
          <StatCard
            title="Active Members"
            value="4,850"
            icon={ShieldCheck}
            color="emerald"
            trend="up"
            trendValue="+42"
          />
          <StatCard
            title="Upcoming Events"
            value="3"
            icon={CalendarDays}
            color="rose"
          />
        </div>
      </div>
    </div>
  );
}
