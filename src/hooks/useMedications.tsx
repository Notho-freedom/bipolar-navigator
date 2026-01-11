import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  scheduled_time: string;
  frequency: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  user_id: string;
  medication_id: string;
  taken_at: string;
  status: "taken" | "skipped" | "late";
  notes: string | null;
}

export function useMedications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ["medications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("scheduled_time", { ascending: true });
      
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!user,
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ["medication_logs", user?.id, new Date().toDateString()],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("taken_at", today.toISOString());
      
      if (error) throw error;
      return data as MedicationLog[];
    },
    enabled: !!user,
  });

  const addMedication = useMutation({
    mutationFn: async (medication: {
      name: string;
      dosage: string;
      scheduled_time: string;
      frequency?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("medications")
        .insert({
          user_id: user.id,
          ...medication,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications", user?.id] });
    },
  });

  const logMedication = useMutation({
    mutationFn: async (log: {
      medication_id: string;
      status?: "taken" | "skipped" | "late";
      notes?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("medication_logs")
        .insert({
          user_id: user.id,
          medication_id: log.medication_id,
          status: log.status || "taken",
          notes: log.notes,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication_logs", user?.id] });
    },
  });

  const updateMedication = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Medication> & { id: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("medications")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications", user?.id] });
    },
  });

  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from("medications")
        .update({ is_active: false })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications", user?.id] });
    },
  });

  // Check which medications have been taken today
  const getMedicationStatus = (medicationId: string) => {
    return todayLogs.find((log) => log.medication_id === medicationId);
  };

  return {
    medications,
    todayLogs,
    isLoading,
    addMedication,
    logMedication,
    updateMedication,
    deleteMedication,
    getMedicationStatus,
  };
}
