import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { postId } = req.query;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/comments/post/${postId}`,
    );

    if (response.status !== 200) {
      res
        .status(response.status)
        .json({ message: 'An error occurred while fetching the comments' });
      return;
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the comments' });
  }
}
