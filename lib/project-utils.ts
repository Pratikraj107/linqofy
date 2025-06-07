import { supabase } from './supabase';

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createProject(project: any) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchComments(projectId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function postComment({ project_id, user_id, content }: { project_id: string, user_id: string, content: string }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ project_id, user_id, content }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function sendProposal({ project_id, sender_id, message, linkedin, expected_role }: { project_id: string, sender_id: string, message: string, linkedin: string, expected_role: string }) {
  const { data, error } = await supabase
    .from('proposals')
    .insert([{ project_id, sender_id, message, linkedin, expected_role }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchProposalsForProject(projectId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, profiles(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchProposalsForUser(userId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, projects(*)')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function setEngagement({ project_id, user_id, liked, interested }: { project_id: string, user_id: string, liked: boolean, interested: boolean }) {
  const { data, error } = await supabase
    .from('project_engagement')
    .upsert([{ project_id, user_id, liked, interested }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
} 