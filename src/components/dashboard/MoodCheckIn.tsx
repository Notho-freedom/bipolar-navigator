import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun, Cloud, CloudRain, Zap, Loader2 } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { 
    id: "manic", 
    level: 5,
    label: "Très énergique", 
    icon: Zap, 
    color: "bg-mood-manic",
    description: "Énergie très élevée, peu de sommeil"
  },
  { 
    id: "hypomanic", 
    level: 4,
    label: "Énergique", 
    icon: Sun, 
    color: "bg-mood-hypomanic",
    description: "Bonne énergie, optimiste"
  },
  { 
    id: "stable", 
    level: 3,
    label: "Stable", 
    icon: Sparkles, 
    color: "bg-mood-stable",
    description: "Équilibré, calme"
  },
  { 
    id: "mild-depression", 
    level: 2,
    label: "Fatigué", 
    icon: Cloud, 
    color: "bg-mood-mildDepression",
    description: "Énergie basse, motivé(e)"
  },
  { 
    id: "depression", 
    level: 1,
    label: "Difficile", 
    icon: CloudRain, 
    color: "bg-mood-depression",
    description: "Journée difficile"
  },
];

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { todayEntry, addEntry } = useMoodEntries();
  const { toast } = useToast();

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    const mood = moods.find(m => m.id === selectedMood);
    if (!mood) return;

    try {
      await addEntry.mutateAsync({
        mood_level: mood.level,
        mood_label: mood.label,
      });
      toast({
        title: "Humeur enregistrée ✨",
        description: "Merci pour votre check-in quotidien !",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre humeur.",
      });
    }
  };

  if (todayEntry) {
    const todayMood = moods.find(m => m.level === todayEntry.mood_level);
    const Icon = todayMood?.icon || Sparkles;
    
    return (
      <div className="glass-card p-6 animate-scale-in">
        <div className="text-center py-8">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${todayMood?.color || 'bg-secondary'} mb-4`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Check-in complété !</h3>
          <p className="text-muted-foreground">
            Vous vous sentez "{todayEntry.mood_label}" aujourd'hui. Continuez ainsi ! 💪
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Comment vous sentez-vous ?</h2>
          <p className="text-sm text-muted-foreground mt-1">Check-in quotidien • 30 secondes</p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Aujourd'hui
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200
                ${isSelected 
                  ? `${mood.color} text-foreground scale-105 shadow-lg` 
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon className={`h-8 w-8 ${isSelected ? 'animate-pulse-soft' : ''}`} />
              <span className="text-xs font-medium text-center leading-tight">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedMood && (
        <div className="animate-fade-in">
          <p className="text-sm text-muted-foreground text-center mb-4">
            {moods.find(m => m.id === selectedMood)?.description}
          </p>
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            variant="gradient"
            size="lg"
            disabled={addEntry.isPending}
          >
            {addEntry.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Enregistrer mon humeur"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
