import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { useCrisisContacts, CrisisContact } from "@/hooks/useCrisisContacts";
import {
  Loader2,
  Phone,
  Heart,
  Shield,
  Plus,
  User,
  Trash2,
  Edit,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/hooks/use-toast";

// Ressources d'urgence nationales (France)
const nationalResources = [
  {
    id: "samu",
    name: "SAMU",
    phone: "15",
    description: "Urgences médicales",
    icon: Phone,
    color: "bg-red-500",
  },
  {
    id: "emergency",
    name: "Numéro d'urgence européen",
    phone: "112",
    description: "Tous types d'urgences",
    icon: Phone,
    color: "bg-red-500",
  },
  {
    id: "sos-amitie",
    name: "SOS Amitié",
    phone: "09 72 39 40 50",
    description: "Écoute 24h/24, 7j/7",
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    id: "suicide-ecoute",
    name: "Suicide Écoute",
    phone: "01 45 39 40 00",
    description: "Prévention du suicide 24h/24",
    icon: Heart,
    color: "bg-purple-500",
  },
  {
    id: "fil-sante",
    name: "Fil Santé Jeunes",
    phone: "0 800 235 236",
    description: "Gratuit et anonyme (9h-23h)",
    icon: Heart,
    color: "bg-blue-500",
  },
];

const Crisis = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { contacts, isLoading, addContact, updateContact, deleteContact } = useCrisisContacts();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<CrisisContact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
    is_emergency: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const resetForm = () => {
    setFormData({ name: "", phone: "", relationship: "", is_emergency: false });
    setEditingContact(null);
  };

  const handleOpenDialog = (contact?: CrisisContact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || "",
        is_emergency: contact.is_emergency,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingContact) {
        await updateContact.mutateAsync({
          id: editingContact.id,
          name: formData.name,
          phone: formData.phone,
          relationship: formData.relationship || null,
          is_emergency: formData.is_emergency,
        });
        toast({
          title: "Contact modifié",
          description: `${formData.name} a été mis à jour.`,
        });
      } else {
        await addContact.mutateAsync({
          name: formData.name,
          phone: formData.phone,
          relationship: formData.relationship || undefined,
          is_emergency: formData.is_emergency,
          priority: contacts.length + 1,
        });
        toast({
          title: "Contact ajouté",
          description: `${formData.name} a été ajouté à vos contacts de crise.`,
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contact.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (contact: CrisisContact) => {
    try {
      await deleteContact.mutateAsync(contact.id);
      toast({
        title: "Contact supprimé",
        description: `${contact.name} a été retiré de vos contacts.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contact.",
        variant: "destructive",
      });
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
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

  const emergencyContacts = contacts.filter((c) => c.is_emergency);
  const supportContacts = contacts.filter((c) => !c.is_emergency);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 md:py-8 max-w-4xl">
        {/* Page Header */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Plan de crise</h1>
              <p className="text-muted-foreground">
                Vos ressources et contacts en cas de besoin.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Alert */}
        <Card className="mb-6 border-destructive/50 bg-destructive/5 animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">En cas d'urgence vitale</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Si vous ou quelqu'un êtes en danger immédiat, appelez le{" "}
                  <button
                    onClick={() => handleCall("15")}
                    className="font-bold text-destructive underline"
                  >
                    15 (SAMU)
                  </button>{" "}
                  ou le{" "}
                  <button
                    onClick={() => handleCall("112")}
                    className="font-bold text-destructive underline"
                  >
                    112
                  </button>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {/* National Resources */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Lignes d'écoute nationales
              </CardTitle>
              <CardDescription>
                Services gratuits disponibles 24h/24 ou aux horaires indiqués.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {nationalResources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <button
                      key={resource.id}
                      onClick={() => handleCall(resource.phone)}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${resource.color} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">
                          {resource.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">Appeler</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Personal Contacts */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mes contacts personnels
                  </CardTitle>
                  <CardDescription>
                    Personnes de confiance à contacter en cas de besoin.
                  </CardDescription>
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
                      <DialogTitle>
                        {editingContact ? "Modifier le contact" : "Ajouter un contact"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Maman"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Ex: 06 12 34 56 78"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Relation (optionnel)</Label>
                        <Input
                          id="relationship"
                          value={formData.relationship}
                          onChange={(e) =>
                            setFormData({ ...formData, relationship: e.target.value })
                          }
                          placeholder="Ex: Mère, Ami, Thérapeute"
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <Label htmlFor="emergency">Contact d'urgence prioritaire</Label>
                          <p className="text-xs text-muted-foreground">
                            Apparaîtra en premier dans la liste
                          </p>
                        </div>
                        <Switch
                          id="emergency"
                          checked={formData.is_emergency}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_emergency: checked })
                          }
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={addContact.isPending || updateContact.isPending}
                      >
                        {(addContact.isPending || updateContact.isPending) && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        {editingContact ? "Enregistrer" : "Ajouter"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun contact enregistré.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajoutez des personnes de confiance pour les moments difficiles.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Emergency Contacts */}
                  {emergencyContacts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-destructive flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4" />
                        Contacts prioritaires
                      </p>
                      <div className="space-y-2">
                        {emergencyContacts.map((contact) => (
                          <ContactCard
                            key={contact.id}
                            contact={contact}
                            onCall={handleCall}
                            onEdit={() => handleOpenDialog(contact)}
                            onDelete={() => handleDelete(contact)}
                            isPriority
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {emergencyContacts.length > 0 && supportContacts.length > 0 && <Separator />}

                  {/* Support Contacts */}
                  {supportContacts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                        <Heart className="h-4 w-4" />
                        Autres contacts
                      </p>
                      <div className="space-y-2">
                        {supportContacts.map((contact) => (
                          <ContactCard
                            key={contact.id}
                            contact={contact}
                            onCall={handleCall}
                            onEdit={() => handleOpenDialog(contact)}
                            onDelete={() => handleDelete(contact)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crisis Plan Tips */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle>💡 Conseils pour votre plan de crise</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Partagez ce plan avec vos proches et votre équipe soignante.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Identifiez les signes avant-coureurs qui indiquent que vous pourriez avoir
                    besoin d'aide.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Préparez des stratégies d'adaptation : respiration, marche, musique apaisante.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Gardez les numéros importants accessibles même hors connexion.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            Vous n'êtes pas seul(e). L'aide est toujours disponible. 💙
          </p>
        </footer>
      </main>
    </div>
  );
};

// Contact Card Component
function ContactCard({
  contact,
  onCall,
  onEdit,
  onDelete,
  isPriority = false,
}: {
  contact: CrisisContact;
  onCall: (phone: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  isPriority?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
        isPriority ? "bg-destructive/5 border border-destructive/20" : "bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isPriority ? "bg-destructive/10" : "bg-primary/10"
          }`}
        >
          <User className={`h-5 w-5 ${isPriority ? "text-destructive" : "text-primary"}`} />
        </div>
        <div>
          <p className="font-medium flex items-center gap-2">
            {contact.name}
            {isPriority && <Star className="h-3 w-3 text-destructive fill-destructive" />}
          </p>
          <p className="text-sm text-muted-foreground">
            {contact.relationship || "Contact personnel"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce contact ?</AlertDialogTitle>
              <AlertDialogDescription>
                {contact.name} sera retiré de vos contacts de crise.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={() => onCall(contact.phone)}>
          <Phone className="h-4 w-4 mr-2" />
          Appeler
        </Button>
      </div>
    </div>
  );
}

export default Crisis;
