import { Moon, Footprints, Calendar, Sparkles, Loader2 } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useMedications } from "@/hooks/useMedications";

export function QuickStats() {
  const { entries, isLoading: moodLoading } = useMoodEntries();
  const { medications, getMedicationStatus, isLoading: medLoading } = useMedications();

  const isLoading = moodLoading || medLoading;

  // Calculate real streak (consecutive days with mood entries)
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.toDateString() === dateStr;
      });
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        // Allow missing today but break on other missing days
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  // Calculate medication adherence
  const takenToday = medications.filter(m => getMedicationStatus(m.id)).length;
  const totalMeds = medications.length;
  const adherence = totalMeds > 0 ? Math.round((takenToday / totalMeds) * 100) : 0;

  // Calculate average mood this week
  const weekMoods = entries.slice(0, 7);
  const avgMood = weekMoods.length > 0 
    ? Math.round((weekMoods.reduce((sum, e) => sum + e.mood_level, 0) / weekMoods.length) * 20)
    : 0;

  const stats = [
    {
      id: "streak",
      icon: Calendar,
      label: "Série",
      value: streak.toString(),
      unit: "jours",
      trend: streak > 3 ? "+bonus" : "",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "adherence",
      icon: Sparkles,
      label: "Observance",
      value: adherence.toString(),
      unit: "%",
      trend: adherence === 100 ? "parfait" : adherence > 80 ? "bien" : "",
      color: "text-[hsl(var(--mood-stable))]",
      bgColor: "bg-secondary",
    },
    {
      id: "mood-avg",
      icon: Moon,
      label: "Stabilité",
      value: avgMood.toString(),
      unit: "%",
      trend: avgMood >= 60 ? "stable" : "attention",
      color: avgMood >= 60 ? "text-[hsl(var(--mood-stable))]" : "text-accent-foreground",
      bgColor: avgMood >= 60 ? "bg-secondary" : "bg-accent",
    },
    {
      id: "entries",
      icon: Footprints,
      label: "Check-ins",
      value: entries.length.toString(),
      unit: "total",
      trend: "actif",
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-4 flex items-center justify-center h-24">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

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
            {stat.trend && (
              <span className={`text-xs ${stat.color} mt-1 inline-block`}>
                {stat.trend}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
