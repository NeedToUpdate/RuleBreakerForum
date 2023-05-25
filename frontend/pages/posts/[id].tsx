import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "@/components/Comments";
import CommentBox from "@/components/CommentBox";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const getPost = async (id: string) => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch post");
    }
  };

  const getComments = async (postId: string) => {
    try {
      const response = await axios.get(`/api/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (id) {
        try {
          setLoading(true);
          const post = await getPost(id.toString());
          setPost(post);

          const comments = await getComments(id.toString());
          setComments(comments);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching post or comments:", error);
        }
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (!post || !id) {
    return <div className="bg-primary-200 dark:bg-primary-900 w-full h-full">Loading...</div>;
  }

  return (
    <div className="bg-primary-200 dark:bg-primary-900 w-full h-full">
      <h2>{post.title}</h2>
      <p>Rules: {post.rules.map((x) => x[1]).join(", ")}</p>
      <CommentBox onCreate={(comment) => setComments((old) => [...old, comment])} postId={id.toString()} />
      {comments.length > 0 ? <Comments comments={comments} /> : loading ? <div className="w-full flex justify-center">Loading comments...</div> : <div className="w-full flex justify-center">No Comments Yet. Make One!</div>}
    </div>
  );
};

export default PostPage;
