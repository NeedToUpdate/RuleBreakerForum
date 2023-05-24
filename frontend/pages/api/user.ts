import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Get the user's session from the auth service
    const authServiceResponse = await axios.get(
      `${process.env.AUTH_SERVICE_URI}/auth/session`,
      {
        headers: {
          // Forward the cookies from the client to the auth service
          cookie: req.headers.cookie,
        },
      },
    );

    // If the auth service responds with a valid session, return the user info
    if (authServiceResponse.status === 200) {
      const user = authServiceResponse.data;
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
