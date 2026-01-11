import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { useMedications, Medication } from "@/hooks/useMedications";
import { Loader2, Pill, Plus, Clock, Check, X, AlertCircle, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Medications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { medications, todayLogs, isLoading, addMedication, logMedication, updateMedication, deleteMedication, getMedicationStatus } = useMedications();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    scheduled_time: "08:00",
    frequency: "daily",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const resetForm = () => {
    setFormData({ name: "", dosage: "", scheduled_time: "08:00", frequency: "daily", notes: "" });
    setEditingMed(null);
  };

  const handleOpenDialog = (med?: Medication) => {
    if (med) {
      setEditingMed(med);
      setFormData({
        name: med.name,
        dosage: med.dosage,
        scheduled_time: med.scheduled_time,
        frequency: med.frequency,
        notes: med.notes || "",
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMed) {
        await updateMedication.mutateAsync({
          id: editingMed.id,
          name: formData.name,
          dosage: formData.dosage,
          scheduled_time: formData.scheduled_time,
          frequency: formData.frequency,
          notes: formData.notes || null,
        });
        toast({
          title: "Médicament modifié",
          description: `${formData.name} a été mis à jour.`,
        });
      } else {
        await addMedication.mutateAsync(formData);
        toast({
          title: "Médicament ajouté",
          description: `${formData.name} a été ajouté à votre liste.`,
        });
      }
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le médicament.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (med: Medication) => {
    try {
      await deleteMedication.mutateAsync(med.id);
      toast({
        title: "Médicament supprimé",
        description: `${med.name} a été retiré de votre liste.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le médicament.",
        variant: "destructive",
      });
    }
  };

  const handleLogMedication = async (medicationId: string, status: "taken" | "skipped") => {
    try {
      await logMedication.mutateAsync({ medication_id: medicationId, status });
      toast({
        title: status === "taken" ? "Prise enregistrée ✓" : "Prise ignorée",
        description: status === "taken" ? "Bravo pour votre observance !" : "N'oubliez pas de consulter votre médecin si vous sautez des doses.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la prise.",
        variant: "destructive",
      });
    }
  };

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

  // Calculate adherence
  const takenToday = medications.filter(m => getMedicationStatus(m.id)?.status === "taken").length;
  const skippedToday = medications.filter(m => getMedicationStatus(m.id)?.status === "skipped").length;
  const pendingToday = medications.length - takenToday - skippedToday;
  const adherenceRate = medications.length > 0 ? Math.round((takenToday / medications.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 md:py-8 max-w-6xl">
        {/* Page Header */}
        <section className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Médicaments</h1>
            <p className="text-muted-foreground">
              Gérez vos traitements et suivez votre observance.
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMed ? "Modifier le médicament" : "Ajouter un médicament"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du médicament</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Lithium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="Ex: 400mg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure de prise</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ex: À prendre avec le repas"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addMedication.isPending || updateMedication.isPending}>
                  {(addMedication.isPending || updateMedication.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editingMed ? "Enregistrer" : "Ajouter le médicament"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{medications.length}</p>
                  <p className="text-xs text-muted-foreground">Médicaments actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{takenToday}</p>
                  <p className="text-xs text-muted-foreground">Pris aujourd'hui</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingToday}</p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{adherenceRate}%</p>
                  <p className="text-xs text-muted-foreground">Observance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Medications List */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Prises du jour</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : medications.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun médicament enregistré.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajoutez vos médicaments pour suivre votre observance.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {medications.map((med) => {
                    const status = getMedicationStatus(med.id);
                    const isTaken = status?.status === "taken";
                    const isSkipped = status?.status === "skipped";
                    
                    return (
                      <div 
                        key={med.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                          isTaken 
                            ? "bg-green-500/5 border-green-500/20" 
                            : isSkipped 
                            ? "bg-orange-500/5 border-orange-500/20"
                            : "bg-muted/50 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            isTaken ? "bg-green-500/10" : isSkipped ? "bg-orange-500/10" : "bg-primary/10"
                          }`}>
                            <Pill className={`h-6 w-6 ${
                              isTaken ? "text-green-500" : isSkipped ? "text-orange-500" : "text-primary"
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold">{med.name}</p>
                            <p className="text-sm text-muted-foreground">{med.dosage}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{med.scheduled_time}</span>
                              {med.notes && (
                                <span className="text-xs text-muted-foreground">• {med.notes}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {status ? (
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              isTaken 
                                ? "bg-green-500/10 text-green-600" 
                                : "bg-orange-500/10 text-orange-600"
                            }`}>
                              {isTaken ? "✓ Pris" : "✗ Ignoré"}
                            </span>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLogMedication(med.id, "skipped")}
                                disabled={logMedication.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleLogMedication(med.id, "taken")}
                                disabled={logMedication.isPending}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Pris
                              </Button>
                            </>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDialog(med)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer ce médicament ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {med.name} sera retiré de votre liste de médicaments actifs.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(med)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <footer className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            BipolarCare AI • Votre compagnon de bien-être 💙
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Medications;
