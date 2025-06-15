"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.userId;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      // Fetch other user's profile
      const { data: otherProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", otherUserId)
        .single();
      setOtherUser(otherProfile);
      // Fetch messages between the two users
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      setMessages(data || []);
      setLoading(false);
    };
    fetchData();
  }, [otherUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: otherUserId,
      content: newMessage,
    });
    if (!error) {
      setMessages([
        ...messages,
        {
          sender_id: userId,
          receiver_id: otherUserId,
          content: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-[70vh]">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.avatar_url || "https://i.pravatar.cc/150"} />
              <AvatarFallback>{(otherUser?.full_name || "U")[0]}</AvatarFallback>
            </Avatar>
            <span className="font-bold text-lg">{otherUser?.full_name || "User"}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 bg-gray-50 p-2 rounded">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                >
                  <div className={`px-4 py-2 rounded-lg max-w-xs break-words ${msg.sender_id === userId ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}`}>
                    {msg.content}
                    <div className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 mt-2">
            <Textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 resize-none"
              rows={1}
              required
            />
            <Button type="submit" className="bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
} 