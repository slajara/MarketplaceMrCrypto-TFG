// Imports
// ========================================================
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";

import { authOptions } from "@acme/auth";

// Auth
// ========================================================
const Auth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOpts: NextAuthOptions = authOptions({ req });

  return NextAuth(req, res, authOpts) as typeof NextAuth;
};

// Exports
// ========================================================
export default Auth;
