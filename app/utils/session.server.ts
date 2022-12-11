import { createCookieSessionStorage } from "@remix-run/node";
import type { SiweMessage } from "siwe";

const sessionSecret = process.env.SESSION_SECRET || "beans";

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getSession(request: Request) {
  const session = await storage.getSession(
    request.headers.get("Cookie")
  );

  return {
    getNonce: () => {
      const nonceValue = session.get("nonce");
      return nonceValue;
    },
    setNonce: (nonce: string) => session.set("nonce", nonce),
    getSiwe: (): SiweMessage => {
      const siwe = session.get("siwe");
      return siwe;
    },
    setSiwe: (siwe: SiweMessage) => session.set("siwe", siwe),
    commit: () => storage.commitSession(session),
  };
}

export { 
  getSession, 
};
