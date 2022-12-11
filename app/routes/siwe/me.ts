import { json } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const siwe = await session.getSiwe();
  const address = siwe?.address;

  return json({ address });
};
