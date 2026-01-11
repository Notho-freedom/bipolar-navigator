import { useState } from "react";
import { Check, Clock, Pill, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const initialMedications: Medication[] = [
  { id: "1", name: "Lithium", dosage: "300mg", time: "08:00", taken: false },
  { id: "2", name: "Lamotrigine", dosage: "100mg", time: "08:00", taken: false },
  { id: "3", name: "Quetiapine", dosage: "50mg", time: "22:00", taken: false },
];

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const toggleMedication = (id: string) => {
    setMedications(meds => 
      meds.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const takenCount = medications.filter(m => m.taken).length;
  const progress = (takenCount / medications.length) * 100;

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
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-[hsl(158,60%,50%)] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Medication list */}
      <div className="space-y-3">
        {medications.map((med) => (
          <div 
            key={med.id}
            className={`
              flex items-center justify-between p-4 rounded-xl transition-all duration-200
              ${med.taken 
                ? 'bg-secondary/50 border border-secondary-foreground/10' 
                : 'bg-muted/30 border border-transparent hover:border-border'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleMedication(med.id)}
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200
                  ${med.taken 
                    ? 'bg-mood-stable text-foreground' 
                    : 'border-2 border-muted-foreground/30 hover:border-primary'
                  }
                `}
              >
                {med.taken && <Check className="h-4 w-4" />}
              </button>
              <div>
                <p className={`font-medium ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                  {med.name}
                </p>
                <p className="text-sm text-muted-foreground">{med.dosage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {med.time}
            </div>
          </div>
        ))}
      </div>

      {takenCount === medications.length && (
        <div className="mt-4 p-4 bg-secondary rounded-xl text-center animate-fade-in">
          <p className="text-secondary-foreground font-medium">
            ✨ Tous les médicaments pris ! Excellent travail !
          </p>
        </div>
      )}
    </div>
  );
}
