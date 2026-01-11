import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Sparkles, Sun, Cloud, CloudRain, Zap, Loader2, Moon, Battery, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [showDetails, setShowDetails] = useState(false);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(2);
  const [notes, setNotes] = useState("");
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
        notes: notes.trim() || undefined,
        sleep_hours: sleepHours,
        energy_level: energyLevel,
        anxiety_level: anxietyLevel,
      });
      toast({
        title: "Humeur enregistrée ✨",
        description: "Merci pour votre check-in quotidien !",
      });
      // Reset form
      setSelectedMood(null);
      setShowDetails(false);
      setSleepHours(7);
      setEnergyLevel(3);
      setAnxietyLevel(2);
      setNotes("");
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
          <p className="text-muted-foreground mb-4">
            Vous vous sentez "{todayEntry.mood_label}" aujourd'hui. Continuez ainsi ! 💪
          </p>
          {(todayEntry.sleep_hours || todayEntry.energy_level || todayEntry.anxiety_level) && (
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              {todayEntry.sleep_hours && (
                <span className="flex items-center gap-1">
                  <Moon className="h-4 w-4" /> {todayEntry.sleep_hours}h
                </span>
              )}
              {todayEntry.energy_level && (
                <span className="flex items-center gap-1">
                  <Battery className="h-4 w-4" /> {todayEntry.energy_level}/5
                </span>
              )}
              {todayEntry.anxiety_level && (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {todayEntry.anxiety_level}/5
                </span>
              )}
            </div>
          )}
          {todayEntry.notes && (
            <p className="text-sm text-muted-foreground mt-3 italic">
              "{todayEntry.notes}"
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Comment vous sentez-vous ?</h2>
          <p className="text-sm text-muted-foreground mt-1">Check-in quotidien</p>
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
        <div className="animate-fade-in space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {moods.find(m => m.id === selectedMood)?.description}
          </p>

          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                {showDetails ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Masquer les détails
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Ajouter des détails (optionnel)
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-4">
              {/* Sleep */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-400" />
                    Heures de sommeil
                  </Label>
                  <span className="text-sm font-medium">{sleepHours}h</span>
                </div>
                <Slider
                  value={[sleepHours]}
                  onValueChange={([value]) => setSleepHours(value)}
                  min={0}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-yellow-400" />
                    Niveau d'énergie
                  </Label>
                  <span className="text-sm font-medium">{energyLevel}/5</span>
                </div>
                <Slider
                  value={[energyLevel]}
                  onValueChange={([value]) => setEnergyLevel(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Épuisé</span>
                  <span>Normal</span>
                  <span>Très énergique</span>
                </div>
              </div>

              {/* Anxiety */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    Niveau d'anxiété
                  </Label>
                  <span className="text-sm font-medium">{anxietyLevel}/5</span>
                </div>
                <Slider
                  value={[anxietyLevel]}
                  onValueChange={([value]) => setAnxietyLevel(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Calme</span>
                  <span>Modéré</span>
                  <span>Très anxieux</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  📝 Notes (optionnel)
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comment s'est passée votre journée ? Des événements particuliers ?"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

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
