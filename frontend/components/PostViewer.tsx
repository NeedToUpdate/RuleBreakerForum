import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from "./Basic/Loader";
import Post from "./Post";
import Button from "./Basic/Button";

const POSTS_PER_PAGE = 10;

export default function PostViewer() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(Math.ceil(posts.length / POSTS_PER_PAGE) || 1);
  const [loading, setLoading] = useState(true);
  const [moreToShow, setMoreToShow] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const abortController = useRef(new AbortController());

  useEffect(() => {
    setInitialLoading(true);
    fetchPosts();
    return () => {
      // Cancel the fetch call when unmounted
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/posts?page=${page}`, { signal: abortController.current.signal });
      console.log(response.data);
      setPosts((prevPosts) => [...prevPosts, ...response.data]);
      if (response.data.length < 10) {
        setMoreToShow(false);
      }
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
      setInitialLoading(false);
    } catch (error) {
      setLoading(false);
      if ((error as { name: string }).name === "CanceledError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching posts:", error);
      }
    }
  };

  const handleShowMore = () => {
    fetchPosts();
  };

  return (
    <>
      <h1 className="text-2xl pl-2 font-thin dark:text-primary-300 mb-10">Posts</h1>
      {initialLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
          <div className="flex w-full p-10 justify-center items-center">{!moreToShow ? <></> : loading ? <Loader /> : <Button onClick={handleShowMore}>Show More</Button>}</div>
        </>
      )}
    </>
  );
}
