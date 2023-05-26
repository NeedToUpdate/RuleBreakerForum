import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Comments from "@/components/Comments";
import CommentBox from "@/components/CommentBox";
import { UserContext } from "@/utils/UserContext";
import RuleCreator from "@/components/RuleCreator";
import Loader from "@/components/Basic/Loader";
import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
  // Use an environment variable to get the base URL
  const baseUrl = process.env.BASE_URL;

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
  const { user } = useContext(UserContext);

  const getPost = async (postId: string) => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
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
    const intervalId = setInterval(async () => {
      if (id) {
        try {
          const newPost = await getPost(id.toString());
          if (JSON.stringify(newPost) !== JSON.stringify(post)) {
            setPost(newPost);
          }
          const newComments = await getComments(id.toString());
          if (JSON.stringify(newComments) !== JSON.stringify(comments)) {
            setComments(newComments);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    }, 5000); // Fetch comments every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component is unmounted or id changes
    };
  }, [id, comments]);

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
      <div className="flex flex-col p-5 bg-primary-300 dark:bg-primary-800 dark:text-white">
        <h2 className="text-3xl mb-4">{post.title}</h2>
        <p>Rules:</p>
        {post.rules.map((x, i) => (
          <p key={i} className="capitalize font-bold pl-1">{`${i + 1}.) ${x[1]}`}</p>
        ))}
        {post.usersBanned.includes(user?._id) || !user ? (
          <div className="w-full flex justify-center p-5">
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
              setComments((old) => [comment, ...old]);
            }}
            postId={id.toString()}
          />
        )}
      </div>
      {comments.length > 0 ? (
        <Comments comments={comments} />
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
