import { useOutletContext } from "@remix-run/react";
import type { ReducerState } from "~/state/reducer";

export default function Index() {
  const { state } = useOutletContext<{
    state: ReducerState;
  }>();

  return state.authenticationStatus ===
    "loading" ? null : state.authenticationStatus === "authenticated" ? (
    <div>Hello ❤️</div>
  ) : (
    <div>Please sign in and verify with Ethereum 😉</div>
  );
}
