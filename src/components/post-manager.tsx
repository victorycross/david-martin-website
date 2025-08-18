import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  platform: string;
  tags: string[];
  link?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface PostManagerProps {
  onPostsChange: () => void;
}

export default function PostManager({ onPostsChange }: PostManagerProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    platform: "Website",
    tags: "",
    link: "",
    featured: false,
    published: false,
  });

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch posts");
      return;
    }

    setPosts(data || []);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      platform: "Website",
      tags: "",
      link: "",
      featured: false,
      published: false,
    });
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const postData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      user_id: user?.id,
    };

    let error;

    if (editingPost) {
      ({ error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", editingPost));
    } else {
      ({ error } = await supabase
        .from("posts")
        .insert([postData]));
    }

    if (error) {
      toast.error(`Failed to ${editingPost ? "update" : "create"} post`);
      return;
    }

    toast.success(`Post ${editingPost ? "updated" : "created"} successfully`);
    resetForm();
    fetchUserPosts();
    onPostsChange();
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      description: post.description,
      content: post.content,
      platform: post.platform,
      tags: post.tags.join(", "),
      link: post.link || "",
      featured: post.featured,
      published: post.published,
    });
    setEditingPost(post.id);
    setIsCreating(true);
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast.error("Failed to delete post");
      return;
    }

    toast.success("Post deleted successfully");
    fetchUserPosts();
    onPostsChange();
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Please sign in to manage your posts.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Posts</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full article content (Markdown supported)"
                rows={10}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Technology, AI, Coaching (comma separated)"
              />
            </div>

            <div>
              <Label htmlFor="link">External Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com (optional)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publish Now</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingPost ? "Update" : "Create"} Post
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Posts</h3>
        {posts.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground text-center">No posts yet. Create your first post!</p>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{post.title}</h4>
                    {post.featured && <Badge variant="secondary">Featured</Badge>}
                    <Badge variant={post.published ? "default" : "outline"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}