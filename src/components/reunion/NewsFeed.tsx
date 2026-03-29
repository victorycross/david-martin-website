import { useState, useEffect } from "react";
import { getNews, type ReunionNewsItem } from "@/lib/reunion-news-service";

export function NewsFeed() {
  const [news, setNews] = useState<ReunionNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews().then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="reunion-heading text-xl mb-4 flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
        Updates
      </h2>
      <div className="space-y-3">
        {news.map((item) => (
          <div
            key={item.id}
            className={`reunion-card p-4 sm:p-5 ${item.pinned ? "reunion-news-pinned" : ""}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="reunion-heading text-sm">
                {item.pinned && (
                  <span className="reunion-news-pin-icon" title="Pinned">
                    &#x1F4CC;{" "}
                  </span>
                )}
                {item.title}
              </h3>
              <span className="reunion-body text-xs opacity-30 whitespace-nowrap">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="reunion-body text-sm opacity-75 leading-relaxed whitespace-pre-line">
              {item.body}
            </p>
            <p className="reunion-body text-xs opacity-30 mt-2">
              &mdash; {item.author_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
