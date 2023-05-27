import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from "./Basic/Loader";
import Post from "./Post";
import Button from "./Basic/Button";
import Link from "next/link";

interface Props {
  initialPosts: Post[];
}

export default function PostViewer({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [moreToShow, setMoreToShow] = useState(initialPosts.length >= 10);
  const abortController = useRef(new AbortController());

  useEffect(() => {
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
      {posts.length ? (
        <>
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
          <div className="flex w-full p-10 justify-center items-center">{!moreToShow ? <></> : loading ? <Loader /> : <Button onClick={handleShowMore}>Show More</Button>}</div>
        </>
      ) : (
        <div className="w-full flex justify-center p-5 pt-32">
          <p className=" opacity-80 dark:text-white italic">
            No Posts Yet.{" "}
            <Link href="create-post" className="text-secondary-900 hover:text-primary-900 dark:hover:text-primary-300 dark:text-white underline duration-150">
              Make One!
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
