import { Request, Response, NextFunction } from "express";
import { logger } from "firebase-functions";
import admin from "firebase-admin";

const TOKEN_ERROR = `No Firebase ID token was passed as a Bearer token in the Authorization header.
      Make sure you authorize your request by providing the following HTTP header:,
      Authorization: Bearer <Firebase ID Token>, or by passing a "__session" cookie.`;

function hasBearerToken(req: Request<{ user: string }>): boolean | undefined {
  return req.headers.authorization?.startsWith("Bearer ");
}

export async function validateToken(
  req: Request<{ user: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  logger.log("Check request for token");

  if (!hasBearerToken(req) && !req.cookies?.__session) {
    logger.error(TOKEN_ERROR);
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (hasBearerToken(req)) {
    logger.log('Found "Authorization" header');
    idToken = req.headers.authorization?.split("Bearer ")[1];
  } else if (req.cookies) {
    logger.log('Found "__session" cookie');
    idToken = req.cookies.__session;
  } else {
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    logger.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken.toString();
    next();
    return;
  } catch (error) {
    logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return;
  }
}
