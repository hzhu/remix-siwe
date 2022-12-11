import { json } from "@remix-run/node";
import { SiweMessage } from "siwe";
import { getSession } from "~/utils/session.server";

import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const { message, signature } = await request.json();
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);

  session.setSiwe(fields);

  return json(
    { success: true },
    { headers: { "Set-Cookie": await session.commit() } }
  );
};
