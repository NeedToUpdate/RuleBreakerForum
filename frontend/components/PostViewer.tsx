import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const POSTS_PER_PAGE = 10;

export default function PostViewer() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(Math.ceil(posts.length / POSTS_PER_PAGE) || 1);
  const [loading, setLoading] = useState(false);
  const fetchedPages = useRef<Record<number, boolean>>({});
  const router = useRouter();

  const abortController = useRef(new AbortController());

  useEffect(() => {
    fetchPosts();
    return () => {
      // Cancel the fetch call when unmounted
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, []);

  const fetchPosts = async () => {
    if (fetchedPages.current[page]) {
      return; // Page has been fetched already, abort fetching
    }
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts?page=${page}`, { signal: abortController.current.signal });
      console.log(response.data);
      setPosts((prevPosts) => [...prevPosts, ...response.data]);
      fetchedPages.current[page] = true; // Mark the page as fetched
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      if ((error as { name: string }).name === "CanceledError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching posts:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    fetchPosts();
  };

  const navigateToPost = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.rules.join(", ")}</p>
          <p>Comments: {post.comments?.length || 0}</p>
          <button onClick={() => navigateToPost(post.id)}>Go to Post</button>
        </div>
      ))}
      {loading ? <p>Loading...</p> : <button onClick={handleShowMore}>Show More</button>}
    </div>
  );
}
