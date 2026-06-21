import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (idToken: string) => {
	const ticket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();
	if (!payload || !payload.email) {
		throw new Error("Invalid Google token");
	}

	const { email, sub: googleId, name } = payload;

	let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: googleId,
        googleId
      },
      select: { id: true, email: true, created_at: true }
    })
  } else if (!user.googleId) { 
    await prisma.user.update({
      where: { email },
      data: { googleId }
    })
  }

  // Issue your own app JWT — same as regular login
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return { user, token, name };
};
