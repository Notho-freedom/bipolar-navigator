import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useMedications } from "@/hooks/useMedications";
import { Loader2, Brain, TrendingUp, BarChart3, Lightbulb, Moon, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Insights = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { entries, isLoading: moodLoading } = useMoodEntries();
  const { medications, todayLogs, isLoading: medLoading } = useMedications();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || moodLoading || medLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate real streak (consecutive days with entries)
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.toDateString() === dateStr;
      });
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break; // Stop counting if we miss a day (except today)
      }
    }
    
    return streak;
  };

  // Calculate mood distribution
  const moodDistribution = () => {
    const dist = { low: 0, mid: 0, high: 0 };
    entries.forEach(e => {
      if (e.mood_level <= 2) dist.low++;
      else if (e.mood_level === 3) dist.mid++;
      else dist.high++;
    });
    const total = entries.length || 1;
    return {
      low: Math.round((dist.low / total) * 100),
      mid: Math.round((dist.mid / total) * 100),
      high: Math.round((dist.high / total) * 100),
    };
  };

  // Calculate stability score (how stable mood has been)
  const calculateStability = () => {
    if (entries.length < 2) return 100;
    
    let variations = 0;
    for (let i = 1; i < Math.min(entries.length, 14); i++) {
      const diff = Math.abs(entries[i].mood_level - entries[i - 1].mood_level);
      if (diff > 1) variations++;
    }
    
    const maxVariations = Math.min(entries.length - 1, 13);
    return Math.round((1 - variations / maxVariations) * 100);
  };

  // Get sleep average
  const avgSleep = () => {
    const withSleep = entries.filter(e => e.sleep_hours != null);
    if (withSleep.length === 0) return null;
    return (withSleep.reduce((sum, e) => sum + (e.sleep_hours || 0), 0) / withSleep.length).toFixed(1);
  };

  // Get energy average
  const avgEnergy = () => {
    const withEnergy = entries.filter(e => e.energy_level != null);
    if (withEnergy.length === 0) return null;
    return (withEnergy.reduce((sum, e) => sum + (e.energy_level || 0), 0) / withEnergy.length).toFixed(1);
  };

  const streak = calculateStreak();
  const distribution = moodDistribution();
  const stability = calculateStability();
  const sleepAvg = avgSleep();
  const energyAvg = avgEnergy();

  // Generate personalized insights
  const insights = [];
  
  if (streak >= 7) {
    insights.push({
      icon: TrendingUp,
      title: "Excellente régularité !",
      description: `Vous avez enregistré votre humeur ${streak} jours de suite. La constance est clé pour comprendre vos cycles.`,
      type: "success",
    });
  } else if (streak < 3 && entries.length > 0) {
    insights.push({
      icon: Lightbulb,
      title: "Conseil",
      description: "Essayez d'enregistrer votre humeur chaque jour, même brièvement. Cela aide à identifier les patterns.",
      type: "tip",
    });
  }

  if (stability < 50) {
    insights.push({
      icon: Heart,
      title: "Période de variation",
      description: "Vos humeurs ont beaucoup varié récemment. Pensez à en parler avec votre médecin lors de votre prochain rendez-vous.",
      type: "warning",
    });
  } else if (stability > 80) {
    insights.push({
      icon: Brain,
      title: "Bonne stabilité",
      description: "Vos humeurs sont relativement stables. Continuez vos bonnes habitudes !",
      type: "success",
    });
  }

  if (distribution.low > 40) {
    insights.push({
      icon: Heart,
      title: "Humeurs basses fréquentes",
      description: "Plus de 40% de vos entrées indiquent une humeur basse. N'hésitez pas à solliciter du soutien.",
      type: "warning",
    });
  }

  if (distribution.high > 50) {
    insights.push({
      icon: Zap,
      title: "Énergie élevée",
      description: "Beaucoup d'entrées à haute énergie. Surveillez les signes d'hypomanie et maintenez un bon rythme de sommeil.",
      type: "info",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 md:py-8 max-w-6xl">
        {/* Page Header */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Insights</h1>
          <p className="text-muted-foreground">
            Analyses et tendances basées sur vos données.
          </p>
        </section>

        {entries.length < 3 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Pas encore assez de données</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Continuez à enregistrer votre humeur quotidiennement. 
                Les insights seront disponibles après au moins 3 entrées.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{streak}</p>
                    <p className="text-sm text-muted-foreground mt-1">Jours consécutifs</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{stability}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Stabilité</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{entries.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Entrées totales</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{medications.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Médicaments suivis</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Mood Distribution */}
            <section className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Distribution de l'humeur
                  </CardTitle>
                  <CardDescription>Répartition de vos états émotionnels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>😊 Bonne humeur</span>
                      <span>{distribution.high}%</span>
                    </div>
                    <Progress value={distribution.high} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>😐 Humeur neutre</span>
                      <span>{distribution.mid}%</span>
                    </div>
                    <Progress value={distribution.mid} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>😔 Humeur basse</span>
                      <span>{distribution.low}%</span>
                    </div>
                    <Progress value={distribution.low} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    Données complémentaires
                  </CardTitle>
                  <CardDescription>Sommeil et énergie moyens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sleepAvg ? (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Moon className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="font-medium">Sommeil moyen</p>
                          <p className="text-sm text-muted-foreground">Sur vos entrées récentes</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">{sleepAvg}h</span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/50 text-center text-muted-foreground">
                      Ajoutez vos heures de sommeil pour voir cette stat
                    </div>
                  )}

                  {energyAvg ? (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Zap className="h-8 w-8 text-yellow-400" />
                        <div>
                          <p className="font-medium">Énergie moyenne</p>
                          <p className="text-sm text-muted-foreground">Sur vos entrées récentes</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">{energyAvg}/5</span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/50 text-center text-muted-foreground">
                      Ajoutez votre niveau d'énergie pour voir cette stat
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Personalized Insights */}
            {insights.length > 0 && (
              <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recommandations personnalisées
                </h2>
                <div className="grid gap-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <Card 
                        key={index} 
                        className={`glass-card border-l-4 ${
                          insight.type === "success" ? "border-l-green-500" :
                          insight.type === "warning" ? "border-l-orange-500" :
                          insight.type === "tip" ? "border-l-blue-500" :
                          "border-l-purple-500"
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              insight.type === "success" ? "bg-green-500/10" :
                              insight.type === "warning" ? "bg-orange-500/10" :
                              insight.type === "tip" ? "bg-blue-500/10" :
                              "bg-purple-500/10"
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                insight.type === "success" ? "text-green-500" :
                                insight.type === "warning" ? "text-orange-500" :
                                insight.type === "tip" ? "text-blue-500" :
                                "text-purple-500"
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold">{insight.title}</p>
                              <p className="text-muted-foreground mt-1">{insight.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            BipolarCare AI • Votre compagnon de bien-être 💙
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Ces insights sont à titre indicatif et ne remplacent pas un avis médical.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Insights;
