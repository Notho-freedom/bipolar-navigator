import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeHero() {
  const hour = new Date().getHours();
  let greeting = "Bonsoir";
  if (hour < 12) greeting = "Bonjour";
  else if (hour < 18) greeting = "Bon après-midi";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-secondary to-accent/30 p-8 md:p-10">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/50 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Dimanche 12 janvier</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {greeting}, <span className="gradient-text">Sophie</span>
        </h1>
        
        <p className="text-muted-foreground text-lg mb-6 max-w-md">
          Vous êtes stable depuis 7 jours. Continuez à prendre soin de vous ! 🌟
        </p>

        <div className="flex flex-wrap gap-3">
          <Button variant="gradient" size="lg">
            Check-in quotidien
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="calm" size="lg">
            Voir mes insights
          </Button>
        </div>
      </div>
    </div>
  );
}
