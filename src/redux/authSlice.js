// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const FIREBASE_API_KEY = "AIzaSyAeyBmVSoySz9V-RDACygoKoJ2VBbycmQc";

// Helper function to load initial state from localStorage
const loadState = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
  };
};

// Async thunk for login (using Firebase REST API)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      return {
        token: response.data.idToken,
        user: { email: response.data.email, localId: response.data.localId },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Async thunk for registration (using Firebase REST API)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, name }, thunkAPI) => {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      return {
        token: response.data.idToken,
        user: {
          email: response.data.email,
          localId: response.data.localId,
          displayName: name,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

const initialState = {
  ...loadState(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // New reducer to update the user's profile in Redux and localStorage
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Save to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Registration Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Save to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
