import { Check, Clock, Pill, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedications } from "@/hooks/useMedications";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function MedicationTracker() {
  const { medications, getMedicationStatus, logMedication, addMedication, isLoading } = useMedications();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", scheduled_time: "08:00" });
  const { toast } = useToast();

  const handleToggleMedication = async (medicationId: string) => {
    const status = getMedicationStatus(medicationId);
    if (status) return; // Already taken today

    try {
      await logMedication.mutateAsync({ medication_id: medicationId });
      toast({
        title: "Médicament pris ✅",
        description: "Bien joué ! Continuez votre routine.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la prise.",
      });
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dosage) return;

    try {
      await addMedication.mutateAsync(newMed);
      toast({
        title: "Médicament ajouté",
        description: `${newMed.name} a été ajouté à votre liste.`,
      });
      setNewMed({ name: "", dosage: "", scheduled_time: "08:00" });
      setDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le médicament.",
      });
    }
  };

  const takenCount = medications.filter(m => getMedicationStatus(m.id)).length;
  const progress = medications.length > 0 ? (takenCount / medications.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <Pill className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Médicaments</h2>
            <p className="text-sm text-muted-foreground">
              {takenCount}/{medications.length} pris aujourd'hui
            </p>
          </div>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un médicament</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMedication} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="medName">Nom</Label>
                <Input
                  id="medName"
                  placeholder="ex: Lithium"
                  value={newMed.name}
                  onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medDosage">Dosage</Label>
                <Input
                  id="medDosage"
                  placeholder="ex: 300mg"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medTime">Heure de prise</Label>
                <Input
                  id="medTime"
                  type="time"
                  value={newMed.scheduled_time}
                  onChange={(e) => setNewMed(prev => ({ ...prev, scheduled_time: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={addMedication.isPending}>
                {addMedication.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress bar */}
      {medications.length > 0 && (
        <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-[hsl(158,60%,50%)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Medication list */}
      {medications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Pill className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Aucun médicament configuré</p>
          <p className="text-sm">Cliquez sur + pour en ajouter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => {
            const isTaken = !!getMedicationStatus(med.id);
            return (
              <div 
                key={med.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl transition-all duration-200
                  ${isTaken 
                    ? 'bg-secondary/50 border border-secondary-foreground/10' 
                    : 'bg-muted/30 border border-transparent hover:border-border'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleMedication(med.id)}
                    disabled={isTaken || logMedication.isPending}
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200
                      ${isTaken 
                        ? 'bg-mood-stable text-foreground' 
                        : 'border-2 border-muted-foreground/30 hover:border-primary'
                      }
                    `}
                  >
                    {isTaken && <Check className="h-4 w-4" />}
                  </button>
                  <div>
                    <p className={`font-medium ${isTaken ? 'line-through text-muted-foreground' : ''}`}>
                      {med.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {med.scheduled_time.slice(0, 5)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {takenCount === medications.length && medications.length > 0 && (
        <div className="mt-4 p-4 bg-secondary rounded-xl text-center animate-fade-in">
          <p className="text-secondary-foreground font-medium">
            ✨ Tous les médicaments pris ! Excellent travail !
          </p>
        </div>
      )}
    </div>
  );
}
