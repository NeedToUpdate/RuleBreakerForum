import { handleAxiosError } from '@/utils/handleAxiosError';
import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { id } = req.query; // Get the id from the request parameters

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts/${id}`,
        );
        res.status(200).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    case 'DELETE':
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts/${id}`,
        );
        res.status(200).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
