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
        <div className="max-w-5xl w-full mx-auto mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Proposals</h1>
          <p className="text-gray-600 text-lg">All proposals you have received for your projects will appear here.</p>
        </div>
        <div className="max-w-5xl w-full mx-auto space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No proposals yet.</div>
          ) : (
            proposals.map((proposal) => (
              <Card key={proposal.id} className="px-8 py-4 flex flex-col gap-2 rounded-2xl shadow-md">
                {/* Header */}
                <div className="flex items-center gap-4 mb-1">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={proposal.profiles?.avatar_url || "https://i.pravatar.cc/150"} />
                    <AvatarFallback>{(proposal.profiles?.full_name || "A")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-gray-900 flex items-center gap-2">{proposal.profiles?.full_name || "Anonymous"}</div>
                    <div className="text-blue-700 text-sm font-medium">@{proposal.profiles?.username || proposal.profiles?.full_name?.toLowerCase().replace(/\s/g,"") || "user"}</div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg> New York, NY</span>
                      <span className="flex items-center gap-1 text-yellow-600"><svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg> 4.8</span>
                      <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2"/><circle cx="12" cy="7" r="4"/></svg> 23 projects</span>
                    </div>
                  </div>
                  {/* Status badge */}
                  <div className="ml-auto">
                    {proposal.status === 'pending' && (
                      <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Pending</span>
                    )}
                    {proposal.status === 'accepted' && (
                      <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">Accepted</span>
                    )}
                    {proposal.status === 'rejected' && (
                      <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">Rejected</span>
                    )}
                  </div>
                </div>
                {/* Project summary box */}
                <div className="bg-gray-50 rounded-xl px-4 py-2 flex items-center justify-between mb-1">
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{proposal.project?.title || "Project Title"}</div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                      <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-3-3.87"/><path d="M7 21v-2a4 4 0 013-3.87"/><circle cx="12" cy="7" r="4"/></svg> Applied for: <span className="font-semibold text-gray-700 ml-1">{proposal.expected_role || "Role"}</span></span>
                      <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : "Date"}</span>
                    </div>
                  </div>
                  <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1">View Project <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                </div>
                {/* Proposal message */}
                <div className="text-gray-800 mb-1">{proposal.message}</div>
                {/* Skills/tags */}
                <div className="flex flex-wrap gap-2 mb-1">
                  {(proposal.skills || ["Node.js", "MongoDB", "Express", "AWS"]).map((tag: string) => (
                    <span key={tag} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                  ))}
                </div>
                {/* Experience and Availability */}
                <div className="flex justify-between items-center text-gray-700 text-base mb-1">
                  <span>Experience: <span className="font-bold">5 years</span></span>
                  <span className="text-right">Availability: <span className="font-bold">Part-time (20hrs/week)</span></span>
                </div>
                <hr className="my-1" />
                {/* Footer actions */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex gap-4 text-gray-400 text-xl">
                    <span><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-3-3.87"/><path d="M7 21v-2a4 4 0 013-3.87"/><circle cx="12" cy="7" r="4"/></svg></span>
                    <span><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" rx="5"/><path d="M16 11.37V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-1.37"/><path d="M7 10h.01"/><path d="M7 14h.01"/></svg></span>
                    <span><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></span>
                  </div>
                  <div className="flex gap-4">
                    <a href="#" className="text-blue-700 font-medium hover:underline">View Details</a>
                    {proposal.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleUpdateStatus(proposal.id, 'rejected')}>Reject</Button>
                        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleUpdateStatus(proposal.id, 'accepted')}>Accept</Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 