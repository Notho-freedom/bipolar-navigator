import { useState } from "react";
import { Phone, Heart, Shield, MessageCircle, Plus, User, Loader2 } from "lucide-react";
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
import { useCrisisContacts } from "@/hooks/useCrisisContacts";
import { useToast } from "@/hooks/use-toast";

// Ressources par défaut (toujours affichées)
const defaultResources = [
  {
    id: "emergency",
    icon: Phone,
    title: "Urgences",
    description: "Appeler les secours",
    phone: "112",
    variant: "crisis" as const,
  },
  {
    id: "helpline",
    icon: Heart,
    title: "Ligne d'écoute",
    description: "SOS Amitié 24/7",
    phone: "09 72 39 40 50",
    variant: "calm" as const,
  },
];

export function CrisisResources() {
  const { contacts, isLoading, addContact } = useCrisisContacts();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addContact.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        relationship: formData.relationship || undefined,
        is_emergency: false,
        priority: contacts.length + 1,
      });
      toast({
        title: "Contact ajouté",
        description: `${formData.name} a été ajouté à vos contacts de crise.`,
      });
      setFormData({ name: "", phone: "", relationship: "" });
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le contact.",
        variant: "destructive",
      });
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  return (
    <div className="glass-card p-6 border-destructive/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Ressources de crise</h2>
            <p className="text-sm text-muted-foreground">Aide immédiate disponible</p>
          </div>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un contact de crise</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4">
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
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Ex: Mère, Ami, Thérapeute"
                />
              </div>
              <Button type="submit" className="w-full" disabled={addContact.isPending}>
                {addContact.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Ajouter le contact
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ressources par défaut */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {defaultResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Button
              key={resource.id}
              variant={resource.variant}
              className="h-auto flex-col gap-2 p-4 text-left"
              onClick={() => handleCall(resource.phone)}
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

      {/* Contacts personnels */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : contacts.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Mes contacts</p>
          <div className="grid grid-cols-2 gap-2">
            {contacts.slice(0, 4).map((contact) => (
              <Button
                key={contact.id}
                variant="outline"
                size="sm"
                className="h-auto flex items-center gap-2 p-3 justify-start"
                onClick={() => handleCall(contact.phone)}
              >
                <User className="h-4 w-4 shrink-0" />
                <div className="text-left truncate">
                  <p className="font-medium text-xs truncate">{contact.name}</p>
                  {contact.relationship && (
                    <p className="text-xs text-muted-foreground truncate">{contact.relationship}</p>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">
          Ajoutez vos contacts de confiance pour les moments difficiles.
        </p>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        Vous n'êtes pas seul(e). L'aide est toujours disponible. 💙
      </p>
    </div>
  );
}
