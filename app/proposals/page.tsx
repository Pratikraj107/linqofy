"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Mail, User } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserAndProposals = async () => {
      setLoading(true);
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setProposals([]);
        setLoading(false);
        return;
      }
      // Fetch proposals for projects owned by this user
      const { data, error } = await supabase
        .from('proposals')
        .select(`*, profiles:profiles!sender_id(full_name, avatar_url), project:projects(title)`) // join sender's profile and project title
        .in('project_id',
          (
            await supabase
              .from('projects')
              .select('id')
              .eq('created_by', user.id)
          ).data?.map((p: any) => p.id) || []
        )
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProposals(data);
      } else {
        setProposals([]);
      }
      setLoading(false);
    };
    getUserAndProposals();
  }, []);

  const handleUpdateStatus = async (proposalId: string, status: 'accepted' | 'rejected') => {
    await supabase
      .from('proposals')
      .update({ status })
      .eq('id', proposalId);
    // Refresh proposals
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('proposals')
      .select(`*, profiles:profiles!sender_id(full_name, avatar_url), project:projects(title)`)
      .in('project_id',
        (
          await supabase
            .from('projects')
            .select('id')
            .eq('created_by', user.id)
        ).data?.map((p: any) => p.id) || []
      )
      .order('created_at', { ascending: false });
    setProposals(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Proposals</h1>
          <p className="text-gray-600 text-lg">All proposals you have received for your projects will appear here.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No proposals yet.</div>
          ) : (
            proposals.map((proposal) => (
              <Card key={proposal.id} className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-4 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={proposal.profiles?.avatar_url || "https://i.pravatar.cc/150"} />
                    <AvatarFallback>{(proposal.profiles?.full_name || "A")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" /> {proposal.profiles?.full_name || "Anonymous"}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">{proposal.created_at ? new Date(proposal.created_at).toISOString().slice(0, 10) : ""}</div>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Project:</span> {proposal.project?.title || "Unknown"}
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Message:</span> {proposal.message}
                </div>
                {proposal.linkedin && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">LinkedIn:</span> <a href={proposal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{proposal.linkedin}</a>
                  </div>
                )}
                {proposal.expected_role && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Expected Role:</span> {proposal.expected_role}
                  </div>
                )}
                {/* Status and actions */}
                <div className="flex items-center gap-3 mt-2">
                  {proposal.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleUpdateStatus(proposal.id, 'accepted')}>Accept</Button>
                      <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleUpdateStatus(proposal.id, 'rejected')}>Reject</Button>
                    </>
                  )}
                  {proposal.status === 'accepted' && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Accepted</span>
                  )}
                  {proposal.status === 'rejected' && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Rejected</span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 