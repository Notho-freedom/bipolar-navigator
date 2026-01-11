import { Header } from "@/components/layout/Header";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { MoodCheckIn } from "@/components/dashboard/MoodCheckIn";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MedicationTracker } from "@/components/dashboard/MedicationTracker";
import { MoodTimeline } from "@/components/dashboard/MoodTimeline";
import { CrisisResources } from "@/components/dashboard/CrisisResources";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 md:py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="mb-8 animate-fade-in">
          <WelcomeHero />
        </section>

        {/* Quick Stats */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <QuickStats />
        </section>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <MoodCheckIn />
            </section>
            
            <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CrisisResources />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <MedicationTracker />
            </section>
            
            <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <MoodTimeline />
            </section>
          </div>
        </div>

        {/* Footer note */}
        <footer className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            BipolarCare AI • Votre compagnon de bien-être 💙
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Cette application ne remplace pas un suivi médical professionnel.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
