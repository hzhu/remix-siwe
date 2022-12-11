import { useEffect, useRef } from "react";
import type { Dispatch } from "react";
import type { ActionTypes } from "../state/reducer";

export function useSiweSync({ dispatch }: { dispatch: Dispatch<ActionTypes> }) {
  const timerIdRef = useRef<number>();
  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/siwe/me");
        const json = await res.json();
        if (json.address) {
          dispatch({ type: "set auth status", payload: "authenticated" });
        } else {
          dispatch({ type: "set auth status", payload: "unauthenticated" });
        }
      } catch (_error) {
        dispatch({ type: "set auth status", payload: "unauthenticated" });
      }
    };
    // 1. page loads
    handler();
    
    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", () => {
      timerIdRef.current = window.setTimeout(handler, 100)
    })

    return () => {
      window.clearTimeout(timerIdRef.current)
      window.removeEventListener("focus", handler);
    }
  }, [dispatch]);
}
