import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number;
  mood_label: string;
  notes: string | null;
  sleep_hours: number | null;
  energy_level: number | null;
  anxiety_level: number | null;
  created_at: string;
}

export function useMoodEntries() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["mood_entries", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user,
  });

  const addEntry = useMutation({
    mutationFn: async (entry: {
      mood_level: number;
      mood_label: string;
      notes?: string;
      sleep_hours?: number;
      energy_level?: number;
      anxiety_level?: number;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("mood_entries")
        .insert({
          user_id: user.id,
          ...entry,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood_entries", user?.id] });
    },
  });

  // Get today's entry if exists
  const todayEntry = entries.find((entry) => {
    const entryDate = new Date(entry.created_at).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  });

  // Get last 7 days entries for timeline
  const weekEntries = entries.slice(0, 7).reverse();

  return {
    entries,
    todayEntry,
    weekEntries,
    isLoading,
    addEntry,
  };
}
