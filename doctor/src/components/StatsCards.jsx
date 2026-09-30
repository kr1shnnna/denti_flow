
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Today's Appointments",
      value: 4,
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Patients",
      value: 128,
      icon: Users,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Completed",
      value: 2,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending",
      value: 2,
      icon: Clock3,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              {/* Text */}
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                  className={stat.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
