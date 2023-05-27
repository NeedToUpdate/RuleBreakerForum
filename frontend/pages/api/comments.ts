import { handleAxiosError } from '@/utils/handleAxiosError';
import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const token = req.headers.authorization; // Get the authorization token from the request headers

  switch (method) {
    case 'POST':
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/comments`,
          req.body,
          { headers: { Authorization: token } }, // Pass the token in the request headers
        );
        res.status(201).json(response.data);
      } catch (error) {
        handleAxiosError(error, res);
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
