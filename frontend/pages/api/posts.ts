import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_INTERNAL_AUTH_SERVICE_URI}/posts`,
        );
        res.status(200).json(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          res
            .status(error.response?.status || 500)
            .json({ error: error.message });
        }
      }
      break;
    case 'POST':
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_INTERNAL_AUTH_SERVICE_URI}/posts`,
          req.body,
        );
        res.status(201).json(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          res
            .status(error.response?.status || 500)
            .json({ error: error.message });
        }
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
