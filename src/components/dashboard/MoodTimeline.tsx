import { TrendingUp, Loader2 } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const moodColors: Record<number, string> = {
  1: "bg-mood-depression",
  2: "bg-mood-mildDepression",
  3: "bg-mood-stable",
  4: "bg-mood-hypomanic",
  5: "bg-mood-manic",
};

const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function MoodTimeline() {
  const { weekEntries, isLoading } = useMoodEntries();
  const maxHeight = 80;

  if (isLoading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Create a 7-day array with entries or empty slots
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const entry = weekEntries.find(e => {
      const entryDate = new Date(e.created_at).toDateString();
      return entryDate === date.toDateString();
    });
    return {
      date,
      dayLabel: format(date, "EEE", { locale: fr }).slice(0, 3),
      entry,
    };
  });

  const hasData = weekEntries.length > 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Évolution cette semaine</h2>
            <p className="text-sm text-muted-foreground">Visualisez vos tendances</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-32 mt-4">
        {last7Days.map((day, index) => {
          const height = day.entry ? (day.entry.mood_level / 5) * maxHeight : 0;
          const isToday = day.date.toDateString() === today.toDateString();
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: maxHeight }}>
                {day.entry ? (
                  <div 
                    className={`
                      w-full max-w-10 rounded-t-lg transition-all duration-500 
                      ${moodColors[day.entry.mood_level]}
                      ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                    style={{ height: `${height}px` }}
                  />
                ) : (
                  <div 
                    className={`
                      w-full max-w-10 rounded-t-lg bg-muted/30 
                      ${isToday ? 'border-2 border-dashed border-primary/30' : ''}
                    `}
                    style={{ height: "16px" }}
                  />
                )}
              </div>
              <span className={`text-xs capitalize ${isToday ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {day.dayLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-mood-stable" />
          <span className="text-xs text-muted-foreground">Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-mood-hypomanic" />
          <span className="text-xs text-muted-foreground">Énergique</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-mood-mildDepression" />
          <span className="text-xs text-muted-foreground">Fatigué</span>
        </div>
      </div>

      {!hasData && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Commencez vos check-ins pour voir votre évolution
        </p>
      )}
    </div>
  );
}
