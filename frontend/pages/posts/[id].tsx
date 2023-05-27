import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Comments from "@/components/Comments";
import CommentBox from "@/components/CommentBox";
import { UserContext } from "@/utils/UserContext";
import RuleCreator from "@/components/RuleCreator";
import Loader from "@/components/Basic/Loader";
import { NextPageContext } from "next";
import Head from "next/head";
import { TrashIcon } from "@heroicons/react/24/solid";
import Username from "@/components/UserName";
import Button from "@/components/Basic/Button";

const COMMENTS_PER_PAGE = 20;

export async function getServerSideProps(context: NextPageContext) {
  // Get the id from the context
  const { id } = context.query;
  let post: Post | null = null;
  try {
    // Call an external API endpoint to get posts.
    const responsePost = await axios.get(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts/${id}`);
    post = responsePost.data;
  } catch (e) {
    //pass
  }
  let comments: Comment[] | null = null;
  try {
    // Call an external API endpoint to get comments.
    const responseComments = await axios.get(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/comments/post/${id}`);
    comments = responseComments.data;
  } catch (e) {
    //pass
  }

  // By returning { props: { post, comments } }, the component
  // will receive `post` and `comments` as a prop at build time
  return {
    props: {
      initialPost: post || { title: "Failed To Load", rules: [], usersBanned: [] },
      initialComments: comments || [],
    },
  };
}

interface Props {
  initialPost: Post;
  initialComments: Comment[];
}

export default function SinglePostPage({ initialPost, initialComments }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(initialComments);
  const [moreToShow, setMoreToShow] = useState(initialComments.length >= COMMENTS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const abortController = useRef(new AbortController());
  const [page, setPage] = useState(2);

  const getPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${post.id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch post");
    }
  };

  const getComments = async (page: number) => {
    try {
      const response = await axios.get(`/api/comments/post/${post.id}?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch comments");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/posts/${post.id}`);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (id) {
        try {
          const newPost = await getPost();
          if (JSON.stringify(newPost) !== JSON.stringify(post)) {
            setPost(newPost);
          }
          const newComments: Comment[] = await getComments(1);
          if (JSON.stringify(newComments) !== JSON.stringify(comments.slice(0, COMMENTS_PER_PAGE))) {
            // Use a Set to prevent duplicates
            const existingCommentIds = new Set(comments.map((comment) => comment.id));
            const nonDuplicateComments = newComments.filter((comment) => !existingCommentIds.has(comment.id));

            // Merge new and existing comments
            setComments((prevComments) => [...nonDuplicateComments, ...prevComments]);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    }, 5000); // Fetch comments every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component is unmounted or id changes
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, [id, comments]);

  const handleShowMore = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/comments/post/${post.id}?page=${page}`, { signal: abortController.current.signal });
      setComments((prev) => [...prev, ...response.data]);
      if (response.data.length < COMMENTS_PER_PAGE) {
        setMoreToShow(false);
      }
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if ((error as { name: string }).name === "CanceledError") {
        // console.log("Fetch aborted");
      } else {
        console.error("Error fetching posts:", error);
      }
    }
  };

  const canAddRule = () => {
    if (comments.length && post?.rules.length) {
      if (post.usersBanned.includes(user?._id)) return false;
      const numberOfRulesMadeByOP = post.rules.filter((x) => x[0] === user?._id).length;
      const numberOfCommentsMadeByOP = comments.filter((x) => x.userId === user?._id).length;
      const numberOfCommentsNeeded = 3;
      const finalResult = numberOfCommentsMadeByOP - numberOfRulesMadeByOP * numberOfCommentsNeeded + Number(post.user === user?._id) * numberOfCommentsNeeded;
      return finalResult >= numberOfCommentsNeeded;
    }
    return false;
  };

  if (!post || !id) {
    return <Loader />;
  }

  return (
    <div className="bg-secondary-200 dark:bg-secondary-900 w-full">
      <Head>
        <title>{`Rule Breaker | ${post.title}`}</title>
      </Head>
      <div className="flex flex-col p-5 bg-primary-300 dark:bg-primary-800 text-secondary-900 dark:text-white">
        <div className="flex justify-between">
          <h2 className="text-3xl mb-4">{post.title}</h2>
          <div className="flex-1"></div>
          {post.user === user?._id && <TrashIcon onClick={handleDelete} className="w-6 h-6 cursor-pointer hover:text-highlight-600 dark:hover:text-highlight-300 duration-150"></TrashIcon>}{" "}
        </div>
        <div className="flex justify-between my-2">
          <p>Rules:</p>
          <div className="flex-1"></div>
          <p className="text-md opacity-80 font-thin">
            Posted by: <Username userId={post.user} />
          </p>
        </div>
        {post.rules.map((x, i) => (
          <p key={i} className="capitalize font-bold pl-1">{`${i + 1}.) ${x[1]}`}</p>
        ))}
        {post.usersBanned.includes(user?._id) || !user ? (
          <div className="w-full flex justify-center p-5 mt-2">
            <p className="text-sm opacity-80">{user ? "You have been banned by ChatGPT." : "Please Log In to post a comment."}</p>
          </div>
        ) : (
          <CommentBox
            onCreate={(comment) => {
              if (typeof comment.ruleBroken === "number") {
                setPost((old) => {
                  if (old) {
                    return {
                      ...old,
                      usersBanned: old.usersBanned.concat(user._id),
                    };
                  }
                  return old;
                });
              }
              setComments((old) => {
                if (old.map((x) => x.id).includes(comment.id)) {
                  //sometimes the interval loop will grab the new comment before this triggers
                  return old;
                }
                return [comment, ...old];
              });
            }}
            postId={id.toString()}
          />
        )}
        <div className="w-full flex justify-center p-3">
          <p className="text-xs italic opacity-50">You can make your own rule every 3 comments made. Remember, chatGPT isn't the smartest and can ban you for no reason. Try to not get banned!</p>
        </div>
      </div>
      {comments.length > 0 ? (
        <>
          <Comments comments={comments} />
          <div className="flex w-full p-10 justify-center items-center">{!moreToShow ? <></> : loading ? <Loader /> : <Button onClick={handleShowMore}>Show More</Button>}</div>
        </>
      ) : (
        <div className="w-full flex justify-center p-5 pt-32">
          <p className=" opacity-80 dark:text-white italic">No Comments Yet. Make One!</p>
        </div>
      )}
      {canAddRule() && user !== null && post !== null && (
        <RuleCreator
          postId={id.toString()}
          commentsMade={comments.filter((x) => x.userId === user?._id).length}
          onCreate={(rule) =>
            setPost((old) => {
              if (old) {
                return { ...old, rules: old?.rules.concat([[user._id, rule]]) };
              }
              return old;
            })
          }
        />
      )}
    </div>
  );
}
