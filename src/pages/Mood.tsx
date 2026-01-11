import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { MoodCheckIn } from "@/components/dashboard/MoodCheckIn";
import { MoodTimeline } from "@/components/dashboard/MoodTimeline";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { Loader2, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Mood = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { entries, isLoading: entriesLoading } = useMoodEntries();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate mood statistics
  const weekEntries = entries.slice(0, 7);
  const monthEntries = entries.slice(0, 30);
  
  const avgWeekMood = weekEntries.length > 0
    ? (weekEntries.reduce((sum, e) => sum + e.mood_level, 0) / weekEntries.length).toFixed(1)
    : "—";
  
  const avgMonthMood = monthEntries.length > 0
    ? (monthEntries.reduce((sum, e) => sum + e.mood_level, 0) / monthEntries.length).toFixed(1)
    : "—";

  // Calculate trend (comparing last 7 days to previous 7 days)
  const recentAvg = weekEntries.length > 0
    ? weekEntries.reduce((sum, e) => sum + e.mood_level, 0) / weekEntries.length
    : 0;
  const previousWeek = entries.slice(7, 14);
  const previousAvg = previousWeek.length > 0
    ? previousWeek.reduce((sum, e) => sum + e.mood_level, 0) / previousWeek.length
    : 0;
  
  const trend = recentAvg > previousAvg + 0.5 ? "up" : recentAvg < previousAvg - 0.5 ? "down" : "stable";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 md:py-8 max-w-6xl">
        {/* Page Header */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Suivi de l'humeur</h1>
          <p className="text-muted-foreground">
            Enregistrez et visualisez l'évolution de votre humeur au fil du temps.
          </p>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgWeekMood}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne sur 7 jours
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgMonthMood}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne sur 30 jours
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {trend === "up" && (
                  <>
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-semibold text-green-500">En hausse</span>
                  </>
                )}
                {trend === "down" && (
                  <>
                    <TrendingDown className="h-6 w-6 text-orange-500" />
                    <span className="text-lg font-semibold text-orange-500">En baisse</span>
                  </>
                )}
                {trend === "stable" && (
                  <>
                    <Minus className="h-6 w-6 text-blue-500" />
                    <span className="text-lg font-semibold text-blue-500">Stable</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs semaine précédente
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MoodCheckIn />
          </section>
          
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <MoodTimeline />
          </section>
        </div>

        {/* History Table */}
        {entries.length > 0 && (
          <section className="mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Historique récent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entries.slice(0, 10).map((entry) => (
                    <div 
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {entry.mood_level <= 2 ? "😔" : 
                           entry.mood_level === 3 ? "😐" : 
                           entry.mood_level === 4 ? "🙂" : "😊"}
                        </div>
                        <div>
                          <p className="font-medium">{entry.mood_label}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold">{entry.mood_level}/5</span>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground max-w-[150px] truncate">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <footer className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            BipolarCare AI • Votre compagnon de bien-être 💙
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Mood;
