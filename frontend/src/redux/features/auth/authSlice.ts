import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import { AuthState, loginType } from "../types";

const initialState: AuthState = {
  user: null,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
  isAuthenticated: !!localStorage.getItem("access"),
  loading: false,
  error: null,
};

// ------------------------------
// CheckAuthentication
// ------------------------------
export const checkAuthenticated = createAsyncThunk(
  "auth/checkAuthenticated",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access");
    if (!token) return rejectWithValue("No token found");

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const body = JSON.stringify({ token });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/`,
        body,
        config
      );

      if (res.data.code === "token_not_valid") {
        return rejectWithValue("Token not valid");
      }

      return { access: token, refresh: localStorage.getItem("refresh") };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to check authentication");
    }
  }
);

// ------------------------------
// LoadUser
// ------------------------------
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access");
    if (!token) return rejectWithValue("No token found");

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load user");
    }
  }
);

// ------------------------------
// Login
// ------------------------------
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: loginType, { dispatch, rejectWithValue }) => {
    const config: AxiosRequestConfig = {
      headers: { "Content-Type": "application/json" },
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/create/`,
        JSON.stringify({ email, password }),
        config
      );

      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await dispatch(loadUser());

      return { access, refresh };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// ------------------------------
// Slice
// ------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload?.access ?? null;
        state.refresh = action.payload?.refresh ?? null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // CheckAuthenticated
      .addCase(checkAuthenticated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthenticated.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload?.access ?? null;
        state.refresh = action.payload?.refresh ?? null;
        state.isAuthenticated = !!action.payload?.access;
      })
      .addCase(checkAuthenticated.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.access = null;
        state.refresh = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;