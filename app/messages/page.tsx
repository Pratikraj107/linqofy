"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      if (!user) {
        setMessages([]);
        setLoading(false);
        return;
      }
      // Fetch messages where the user is sender or receiver
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:profiles!sender_id(full_name, avatar_url, id), receiver:profiles!receiver_id(full_name, avatar_url, id)")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  // Group messages by the other user (show only the latest message per conversation)
  const conversations = (() => {
    const map = new Map();
    for (const msg of messages) {
      const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
      if (!otherUser?.id) continue;
      if (!map.has(otherUser.id)) {
        map.set(otherUser.id, msg);
      }
    }
    return Array.from(map.values());
  })();

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading messages...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No messages yet.</div>
          ) : (
            <div className="space-y-4">
              {conversations.map((msg) => {
                const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
                return (
                  <Link
                    key={msg.id}
                    href={`/messages/${otherUser?.id || ""}`}
                    className="flex items-center gap-4 bg-white rounded-lg shadow p-4 hover:bg-gray-50"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherUser?.avatar_url || "https://i.pravatar.cc/150"} />
                      <AvatarFallback>{(otherUser?.full_name || "A")[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-gray-900">{otherUser?.full_name || "User"}</div>
                      <div className="text-gray-600 truncate">{msg.content}</div>
                    </div>
                    <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 