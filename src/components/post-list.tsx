import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  platform: string;
  tags: string[];
  link?: string;
  featured: boolean;
  created_at: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const fetchPublishedPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error);
      return;
    }

    setPosts(data || []);
  };

  const handleViewPost = (post: Post) => {
    if (post.link) {
      window.open(post.link, "_blank");
    } else {
      setSelectedPost(post);
      setShowDialog(true);
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mb-2">{line.substring(4)}</h3>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
      });
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Latest Articles</h2>
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className={`p-6 hover:shadow-medium transition-all duration-medium ${
              post.featured ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.featured && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {post.platform}
                  </Badge>
                  
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button variant="secondary" size="sm" className="shrink-0" onClick={() => handleViewPost(post)}>
                {post.link ? (
                  <>
                    View Article <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Read More <Eye className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedPost && (
              <div className="prose prose-sm max-w-none">
                {formatContent(selectedPost.content)}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}