"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
      setLoading(false);
    };
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    if (userId) fetchProfile();
    fetchCurrentUser();
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">Loading profile...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-8 flex flex-col items-center">
          <img src={profile.avatar_url || "https://i.pravatar.cc/150"} alt="Avatar" className="h-32 w-32 rounded-full mb-4 border shadow" />
          <h1 className="text-3xl font-bold mb-2">{profile.full_name || "Anonymous"}</h1>
          <p className="text-gray-600 mb-2">{profile.email}</p>
          {/* Add more profile info as needed */}
          {currentUserId && currentUserId !== userId && (
            <Button
              className="mt-4 bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90"
              onClick={() => setShowMessageDialog(true)}
            >
              Message
            </Button>
          )}
        </div>
      </div>
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          {success ? (
            <div className="text-green-600 text-center py-8 font-semibold">Message sent!</div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSending(true);
                const { data: { user } } = await supabase.auth.getUser();
                const { error } = await supabase.from("messages").insert({
                  sender_id: user?.id,
                  receiver_id: userId,
                  content: message,
                });
                setSending(false);
                if (!error) {
                  setSuccess(true);
                  setMessage("");
                  setTimeout(() => {
                    setShowMessageDialog(false);
                    setSuccess(false);
                  }, 1500);
                }
              }}
              className="space-y-4"
            >
              <Textarea
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="resize-none"
              />
              <DialogFooter>
                <Button type="submit" className="w-full bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90" disabled={sending}>
                  {sending ? "Sending..." : "Send"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 