import { useMoodEntries } from "./useMoodEntries";
import { useMedications } from "./useMedications";
import { useCrisisContacts } from "./useCrisisContacts";
import { useProfile } from "./useProfile";
import { useToast } from "./use-toast";

export function useExportData() {
  const { entries } = useMoodEntries();
  const { medications } = useMedications();
  const { contacts } = useCrisisContacts();
  const { profile } = useProfile();
  const { toast } = useToast();

  const exportToJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: profile ? {
        displayName: profile.display_name,
        createdAt: profile.created_at,
      } : null,
      moodEntries: entries.map(e => ({
        date: e.created_at,
        level: e.mood_level,
        label: e.mood_label,
        notes: e.notes,
        sleepHours: e.sleep_hours,
        energyLevel: e.energy_level,
        anxietyLevel: e.anxiety_level,
      })),
      medications: medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        scheduledTime: m.scheduled_time,
        frequency: m.frequency,
        notes: m.notes,
      })),
      crisisContacts: contacts.map(c => ({
        name: c.name,
        phone: c.phone,
        relationship: c.relationship,
        isEmergency: c.is_emergency,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bipolarcare-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Vos données ont été téléchargées au format JSON.",
    });
  };

  const exportToCSV = () => {
    // Export mood entries as CSV
    const headers = ["Date", "Heure", "Niveau", "État", "Notes", "Sommeil (h)", "Énergie", "Anxiété"];
    const rows = entries.map(e => {
      const date = new Date(e.created_at);
      return [
        date.toLocaleDateString("fr-FR"),
        date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        e.mood_level.toString(),
        e.mood_label,
        e.notes || "",
        e.sleep_hours?.toString() || "",
        e.energy_level?.toString() || "",
        e.anxiety_level?.toString() || "",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bipolarcare-humeurs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Vos données d'humeur ont été téléchargées au format CSV.",
    });
  };

  return {
    exportToJSON,
    exportToCSV,
    hasData: entries.length > 0 || medications.length > 0,
  };
}
