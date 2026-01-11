import { Moon, Footprints, Calendar, Sparkles } from "lucide-react";

const stats = [
  {
    id: "streak",
    icon: Calendar,
    label: "Série",
    value: "7",
    unit: "jours",
    trend: "+2",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "sleep",
    icon: Moon,
    label: "Sommeil",
    value: "7.5",
    unit: "heures",
    trend: "optimal",
    color: "text-[hsl(var(--mood-stable))]",
    bgColor: "bg-secondary",
  },
  {
    id: "activity",
    icon: Footprints,
    label: "Activité",
    value: "6,230",
    unit: "pas",
    trend: "actif",
    color: "text-accent-foreground",
    bgColor: "bg-accent",
  },
  {
    id: "stability",
    icon: Sparkles,
    label: "Stabilité",
    value: "85",
    unit: "%",
    trend: "excellent",
    color: "text-[hsl(var(--mood-stable))]",
    bgColor: "bg-secondary",
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
            <span className={`text-xs ${stat.color} mt-1 inline-block`}>
              {stat.trend}
            </span>
          </div>
        );
      })}
    </div>
  );
}
