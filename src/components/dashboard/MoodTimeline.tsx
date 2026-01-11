import { TrendingUp } from "lucide-react";

interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale (1=depression, 5=manic)
  label: string;
}

const mockData: MoodEntry[] = [
  { date: "Lun", mood: 3, label: "Stable" },
  { date: "Mar", mood: 3, label: "Stable" },
  { date: "Mer", mood: 2, label: "Fatigué" },
  { date: "Jeu", mood: 2, label: "Fatigué" },
  { date: "Ven", mood: 3, label: "Stable" },
  { date: "Sam", mood: 4, label: "Énergique" },
  { date: "Dim", mood: 3, label: "Stable" },
];

const moodColors: Record<number, string> = {
  1: "bg-mood-depression",
  2: "bg-mood-mildDepression",
  3: "bg-mood-stable",
  4: "bg-mood-hypomanic",
  5: "bg-mood-manic",
};

export function MoodTimeline() {
  const maxHeight = 80;

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
        {mockData.map((entry, index) => {
          const height = (entry.mood / 5) * maxHeight;
          const isToday = index === mockData.length - 1;
          
          return (
            <div key={entry.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: maxHeight }}>
                <div 
                  className={`
                    w-full max-w-10 rounded-t-lg transition-all duration-500 
                    ${moodColors[entry.mood]}
                    ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  style={{ height: `${height}px` }}
                />
              </div>
              <span className={`text-xs ${isToday ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {entry.date}
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
    </div>
  );
}
