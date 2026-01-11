import { Phone, Heart, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    id: "emergency",
    icon: Phone,
    title: "Urgences",
    description: "Appeler les secours",
    action: "112",
    variant: "crisis" as const,
  },
  {
    id: "helpline",
    icon: Heart,
    title: "Ligne d'écoute",
    description: "SOS Amitié 24/7",
    action: "09 72 39 40 50",
    variant: "calm" as const,
  },
  {
    id: "crisis-plan",
    icon: Shield,
    title: "Mon plan de crise",
    description: "Stratégies personnalisées",
    action: "Voir",
    variant: "calm" as const,
  },
  {
    id: "support",
    icon: MessageCircle,
    title: "Contacter un proche",
    description: "Alerter votre soutien",
    action: "Envoyer",
    variant: "calm" as const,
  },
];

export function CrisisResources() {
  return (
    <div className="glass-card p-6 border-destructive/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
          <Shield className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Ressources de crise</h2>
          <p className="text-sm text-muted-foreground">Aide immédiate disponible</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Button
              key={resource.id}
              variant={resource.variant}
              className="h-auto flex-col gap-2 p-4 text-left"
            >
              <Icon className="h-5 w-5" />
              <div className="text-center">
                <p className="font-medium text-sm">{resource.title}</p>
                <p className="text-xs opacity-80">{resource.description}</p>
              </div>
            </Button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Vous n'êtes pas seul(e). L'aide est toujours disponible. 💙
      </p>
    </div>
  );
}
