import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Comments from "@/components/Comments";
import CommentBox from "@/components/CommentBox";
import { UserContext } from "@/utils/UserContext";
import RuleCreator from "@/components/RuleCreator";
import Loader from "@/components/Basic/Loader";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
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
          console.log(post);
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

  const canAddRule = () => {
    console.log(comments);
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
              if (comment.ruleBroken !== null || comment.ruleBroken !== undefined) {
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
              setComments((old) => [...old, comment]);
            }}
            postId={id.toString()}
          />
        )}
      </div>
      {comments.length > 0 ? (
        <Comments comments={comments.reverse()} />
      ) : loading ? (
        <Loader />
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
};

export default PostPage;
