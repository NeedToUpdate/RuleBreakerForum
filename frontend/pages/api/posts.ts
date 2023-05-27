import { handleAxiosError } from '@/utils/handleAxiosError';
import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const token = req.headers.authorization; // Get the authorization token from the request headers
  const { page } = req.query;
  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts?page=${
            page || 1
          }`,
          { headers: { Authorization: token } }, // Pass the token in the request headers
        );
        res.status(200).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    case 'POST':
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts`,
          req.body,
          { headers: { Authorization: token } }, // Pass the token in the request headers
        );
        res.status(201).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
