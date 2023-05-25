interface Post {
  id: string;
  user: string;
  usersBanned: string[];
  rules: [string, string][];
  title: string;
  createdAt: Date;
  comments_num: number;
}

interface User {
  _id: ObjectId;
  username: string;
  email: string;
}

interface Comment {
  id: ObjectId;
  userId: string;
  postId: string;
  body: string;
  ruleBroken: number | undefined;
}
