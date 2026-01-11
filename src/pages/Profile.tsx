import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { useExportData } from "@/hooks/useExportData";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useMedications } from "@/hooks/useMedications";
import {
  Loader2,
  User,
  Moon,
  Sun,
  Monitor,
  Download,
  FileJson,
  FileSpreadsheet,
  Shield,
  Bell,
  Trash2,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading: profileLoading } = useProfile();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { exportToJSON, exportToCSV, hasData } = useExportData();
  const { entries } = useMoodEntries();
  const { medications } = useMedications();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    dailyCheckIn: true,
    weeklyReport: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) return;
    
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({ display_name: displayName.trim() });
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 md:py-8 max-w-4xl">
        {/* Page Header */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations et préférences.
          </p>
        </section>

        <div className="grid gap-6">
          {/* Profile Info */}
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Modifiez votre nom d'affichage et vos informations de compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{profile?.display_name || user.email?.split("@")[0]}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    Membre depuis {memberSince}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <div className="flex gap-2">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Votre nom"
                      className="max-w-xs"
                    />
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving || !displayName.trim() || displayName === profile?.display_name}
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Clair
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Sombre
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Système
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos rappels et alertes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rappels médicaments</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez un rappel pour chaque prise prévue
                  </p>
                </div>
                <Switch
                  checked={notifications.medicationReminders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, medicationReminders: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Check-in quotidien</p>
                  <p className="text-sm text-muted-foreground">
                    Rappel pour enregistrer votre humeur chaque jour
                  </p>
                </div>
                <Switch
                  checked={notifications.dailyCheckIn}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, dailyCheckIn: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rapport hebdomadaire</p>
                  <p className="text-sm text-muted-foreground">
                    Résumé de votre semaine chaque dimanche
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, weeklyReport: checked }))
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                💡 Les notifications nécessitent l'autorisation de votre navigateur.
              </p>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exporter mes données
              </CardTitle>
              <CardDescription>
                Téléchargez une copie de toutes vos données.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{entries.length}</p>
                    <p className="text-xs text-muted-foreground">Entrées humeur</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{medications.length}</p>
                    <p className="text-xs text-muted-foreground">Médicaments</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">
                      {entries.length > 0
                        ? Math.ceil(
                            (Date.now() - new Date(entries[entries.length - 1].created_at).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Jours de suivi</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={exportToJSON}
                  disabled={!hasData}
                  className="flex items-center gap-2"
                >
                  <FileJson className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={entries.length === 0}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export CSV (humeurs)
                </Button>
              </div>
              {!hasData && (
                <p className="text-xs text-muted-foreground mt-3">
                  Commencez à utiliser l'application pour pouvoir exporter vos données.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="glass-card animate-slide-up border-destructive/20" style={{ animationDelay: "0.25s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Zone de danger
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Supprimer toutes mes données
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Toutes vos entrées d'humeur, médicaments, et
                      contacts de crise seront définitivement supprimés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        toast({
                          title: "Fonctionnalité à venir",
                          description:
                            "La suppression des données sera disponible dans une prochaine version.",
                        });
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer définitivement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-3">
                Vos données sont stockées de manière sécurisée et ne sont jamais partagées.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">BipolarCare AI • Version 1.0.0 💙</p>
        </footer>
      </main>
    </div>
  );
};

export default Profile;
