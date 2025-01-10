import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import _ from "lodash";
import { AppUser, UserSettings } from "@/models/user";
import { Logger } from "@/logger";

export type AuthStateType =
  | "anonymous"
  | "authenticated"
  | "unauthenticated"
  | "registration_required";

export interface AuthState {
  user?: AppUser | null;
  isAdmin: boolean;
  state: AuthStateType;
  isInit?: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAdmin: false,
  state: "unauthenticated",
  isInit: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<
        ((AppUser | undefined) & { state?: AuthStateType }) | null | undefined
      >,
    ) => {
      state.loading = false;
      if (!action.payload) {
        state.user = null;
        state.state = "unauthenticated";
        state.isInit = false;
        return;
      }
      const { state: authState, ...user } = action.payload;
      if (user && !_.isEqual(state.user, user)) {
        state.user = user;
      }
      state.state = action.payload.state ?? "authenticated";
      state.isInit = true;
    },
    updateUserSettings: (
      state,
      action: PayloadAction<Partial<UserSettings>>,
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          settings: {
            ...state.user.settings,
            ...action.payload,
          },
        };
      }
    },
    disconnectStripe: state => {
      if (state.user) {
        state.user = {
          ...state.user,
          settings: {
            ...state.user.settings,
            stripeApiKey: undefined,
            connected: false,
            isOnboarded: false,
          },
        };
      }
    },
    setLoadingUserDetails: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      Logger.error("Error received in authSlice", { error: action.payload });
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: state => {
      state.loading = false;
      state.user = null;
      state.state = "unauthenticated";
    },
  },
});

export const {
  setUser,
  updateUserSettings,
  setLoadingUserDetails,
  setError,
  clearUser,
  disconnectStripe,
} = authSlice.actions;

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
