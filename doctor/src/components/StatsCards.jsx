
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { getDoctorAppointments } from "../services/api";

const StatsCards = () => {
  const [stats, setStats] = useState({
    today: 0,
    patients: 0,
    completed: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDoctorAppointments();

        const appointments = data.appointments || [];

        const today = new Date().toLocaleDateString("en-CA");

        // Today's non-cancelled appointments
        const todaysAppointments = appointments.filter(
          (appointment) => {
            const appointmentDate = new Date(
              appointment.date
            ).toLocaleDateString("en-CA");

            const status = appointment.status?.toLowerCase();

            return (
              appointmentDate === today &&
              status !== "cancelled" &&
              status !== "canceled"
            );
          }
        );

        // Unique patients
        const uniquePatients = new Set(
          appointments
            .map((appointment) => appointment.patient?._id)
            .filter(Boolean)
        );

        // Completed appointments
        const completed = appointments.filter(
          (appointment) =>
            appointment.status?.toLowerCase() === "completed"
        );

        // Pending appointments
        const pending = appointments.filter(
          (appointment) =>
            appointment.status?.toLowerCase() === "pending"
        );

        setStats({
          today: todaysAppointments.length,
          patients: uniquePatients.size,
          completed: completed.length,
          pending: pending.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Today's Appointments",
      value: stats.today,
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: Users,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock3,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {loading ? "—" : card.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                  className={card.iconColor}
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

