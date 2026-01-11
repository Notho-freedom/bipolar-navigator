import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun, Cloud, CloudRain, Zap } from "lucide-react";

const moods = [
  { 
    id: "manic", 
    label: "Très énergique", 
    icon: Zap, 
    color: "bg-mood-manic",
    description: "Énergie très élevée, peu de sommeil"
  },
  { 
    id: "hypomanic", 
    label: "Énergique", 
    icon: Sun, 
    color: "bg-mood-hypomanic",
    description: "Bonne énergie, optimiste"
  },
  { 
    id: "stable", 
    label: "Stable", 
    icon: Sparkles, 
    color: "bg-mood-stable",
    description: "Équilibré, calme"
  },
  { 
    id: "mild-depression", 
    label: "Fatigué", 
    icon: Cloud, 
    color: "bg-mood-mildDepression",
    description: "Énergie basse, motivé(e)"
  },
  { 
    id: "depression", 
    label: "Difficile", 
    icon: CloudRain, 
    color: "bg-mood-depression",
    description: "Journée difficile"
  },
];

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      setIsSubmitted(true);
      // Here you would save to database
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-6 animate-scale-in">
        <div className="text-center py-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
            <Sparkles className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Merci pour votre check-in</h3>
          <p className="text-muted-foreground">
            Votre humeur a été enregistrée. Continuez ainsi ! 💪
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
          >
            Enregistrer mon humeur
          </Button>
        </div>
      )}
    </div>
  );
}
