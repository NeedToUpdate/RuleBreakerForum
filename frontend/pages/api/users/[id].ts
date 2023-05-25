import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/users/${id}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
}

function handleAxiosError(error: unknown, res: NextApiResponse) {
  if (axios.isAxiosError(error)) {
    console.log(error);
    res.status(error.response?.status || 400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
