import { handleAxiosError } from '@/utils/handleAxiosError';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/users/${id}`,
        );
        return res.status(200).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    case 'PUT':
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/users/${id}`,
          req.body,
        );
        return res.status(200).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
