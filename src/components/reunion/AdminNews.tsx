import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getAllMembers } from "@/data/reunion-data";
import {
  getNews,
  postNews,
  deleteNews,
  togglePin,
  type ReunionNewsItem,
} from "@/lib/reunion-news-service";

interface AdminNewsProps {
  adminCode: string;
  adminName: string;
}

export function AdminNews({ adminCode, adminName }: AdminNewsProps) {
  const { toast } = useToast();
  const [news, setNews] = useState<ReunionNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [emailSubscribers, setEmailSubscribers] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadNews = useCallback(async () => {
    const data = await getNews();
    setNews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNews();
    // Count subscribers (members with emails)
    getAllMembers().then((members) => {
      setSubscriberCount(members.filter((m) => m.email).length);
    });
  }, [loadNews]);

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return;
    setPosting(true);
    try {
      await postNews({
        authorCode: adminCode,
        authorName: adminName,
        title: title.trim(),
        body: body.trim(),
        pinned,
      });

      // Send email to subscribers if checked
      if (emailSubscribers) {
        const members = await getAllMembers();
        const emails = members.filter((m) => m.email).map((m) => m.email!);
        if (emails.length > 0) {
          const { data, error } = await supabase.functions.invoke("send-news", {
            body: {
              title: title.trim(),
              body: body.trim(),
              recipients: emails,
            },
          });
          if (error) {
            toast({
              title: "Update posted, but email failed",
              description: "The update is on the site but emails couldn't be sent.",
              variant: "destructive",
            });
          } else {
            const sent = data?.sent ?? emails.length;
            toast({ title: "Update posted & emailed!", description: `Sent to ${sent} subscriber${sent !== 1 ? "s" : ""}.` });
          }
        } else {
          toast({ title: "Update posted!", description: "No subscribers with email addresses." });
        }
      } else {
        toast({ title: "Update posted!" });
      }

      setTitle("");
      setBody("");
      setPinned(false);
      setEmailSubscribers(false);
      loadNews();
    } catch (err: any) {
      toast({ title: "Failed to post", description: err?.message, variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this update?")) return;
    try {
      await deleteNews(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
      toast({ title: "Update deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleTogglePin = async (item: ReunionNewsItem) => {
    try {
      await togglePin(item.id, !item.pinned);
      loadNews();
    } catch {
      toast({ title: "Failed to update pin", variant: "destructive" });
    }
  };

  return (
    <div>
      {/* Post form */}
      <div className="reunion-card p-6 mb-6">
        <h3 className="reunion-heading text-base mb-4">Post an Update</h3>
        <div className="space-y-3">
          <div>
            <Label className="reunion-label mb-1.5 block">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RSVP Reminder"
              className="reunion-input"
            />
          </div>
          <div>
            <Label className="reunion-label mb-1.5 block">Message</Label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your update..."
              className="reunion-input w-full min-h-[80px] p-3 rounded-lg resize-y"
              rows={3}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="reunion-checkbox"
                />
                <span className="reunion-body text-xs opacity-60">
                  Pin to top
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSubscribers}
                  onChange={(e) => setEmailSubscribers(e.target.checked)}
                  className="reunion-checkbox"
                />
                <span className="reunion-body text-xs opacity-60">
                  Email to {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""} with email on file
                </span>
              </label>
            </div>
            <Button
              onClick={handlePost}
              className="reunion-button"
              disabled={!title.trim() || !body.trim() || posting}
            >
              {posting
                ? emailSubscribers
                  ? "Posting & emailing..."
                  : "Posting..."
                : "Post Update"}
            </Button>
          </div>
        </div>
      </div>

      {/* Existing news */}
      <h3 className="reunion-label mb-3">
        Posted Updates ({news.length})
      </h3>
      {loading ? (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : news.length === 0 ? (
        <p className="reunion-body text-sm opacity-40 text-center py-6">
          No updates posted yet
        </p>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="reunion-guest-row">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="reunion-heading text-sm mb-1">
                    {item.pinned && <span title="Pinned">&#x1F4CC; </span>}
                    {item.title}
                  </h4>
                  <p className="reunion-body text-xs opacity-60 line-clamp-2">
                    {item.body}
                  </p>
                  <p className="reunion-body text-xs opacity-30 mt-1">
                    {item.author_name} &middot;{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePin(item)}
                    className={`reunion-invite-btn ${item.pinned ? "opacity-100" : ""}`}
                    title={item.pinned ? "Unpin" : "Pin to top"}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={item.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" x2="12" y1="17" y2="22" />
                      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="reunion-invite-btn"
                    title="Delete"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
