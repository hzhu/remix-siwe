import type { AuthenticationStatus } from "@rainbow-me/rainbowkit";

export interface ReducerState {
  authenticationStatus: AuthenticationStatus;
}

export type ActionTypes = {
  type: "set auth status";
  payload: AuthenticationStatus;
};

export const initialState: ReducerState = { authenticationStatus: "loading" };

export function reducer(
  state: ReducerState,
  action: ActionTypes
): ReducerState {
  switch (action.type) {
    case "set auth status":
      return { ...state, authenticationStatus: action.payload };
    default:
      throw new Error();
  }
}
