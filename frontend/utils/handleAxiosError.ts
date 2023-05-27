import axios from 'axios';
import { NextApiResponse } from 'next';

export function handleAxiosError(error: unknown, res: NextApiResponse) {
  if (axios.isAxiosError(error)) {
    res
      .status(error.response?.status || 400)
      .json({ error: error.response?.data || error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
