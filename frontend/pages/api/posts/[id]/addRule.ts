import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { rule, userId } = req.body;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts/${id}/addRule`,
        { rule, userId },
      );
      return res.status(200).json(response.data);
    } catch (error) {
      handleAxiosError(error, res);
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

function handleAxiosError(error: unknown, res: NextApiResponse) {
  if (axios.isAxiosError(error)) {
    console.log(error);
    res.status(error.response?.status || 400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
