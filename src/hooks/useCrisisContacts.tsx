import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CrisisContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string | null;
  is_emergency: boolean;
  priority: number;
  created_at: string;
}

export function useCrisisContacts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["crisis_contacts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("crisis_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: true });
      
      if (error) throw error;
      return data as CrisisContact[];
    },
    enabled: !!user,
  });

  const addContact = useMutation({
    mutationFn: async (contact: {
      name: string;
      phone: string;
      relationship?: string;
      is_emergency?: boolean;
      priority?: number;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("crisis_contacts")
        .insert({
          user_id: user.id,
          ...contact,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisis_contacts", user?.id] });
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CrisisContact> & { id: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("crisis_contacts")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisis_contacts", user?.id] });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("crisis_contacts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisis_contacts", user?.id] });
    },
  });

  const emergencyContacts = contacts.filter((c) => c.is_emergency);
  const supportContacts = contacts.filter((c) => !c.is_emergency);

  return {
    contacts,
    emergencyContacts,
    supportContacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
  };
}
