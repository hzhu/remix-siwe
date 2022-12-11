import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import type { Dispatch } from "react";
import { SiweMessage } from "siwe";
import type { ActionTypes } from "../state/reducer";

// https://www.rainbowkit.com/docs/custom-authentication#creating-a-custom-adapter
export const getAuthenticationAdapter = (
  nonce: string,
  dispatch: Dispatch<ActionTypes>
) =>
  createAuthenticationAdapter({
    getNonce: async () => {
      console.log("getNonce...");
      return nonce;
    },
    createMessage: ({ nonce, address, chainId }) => {
      console.log("createMessage...");
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      console.log("getMessageBody...");
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      console.log("verify...");
      const verifyRes = await fetch("/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      console.log(verifyRes, "<--verifyRes");
      dispatch({ type: "set auth status", payload: "authenticated" });
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      console.log("logout...");
      await fetch("/siwe/logout");
      dispatch({ type: "set auth status", payload: "unauthenticated" });
    },
  });
