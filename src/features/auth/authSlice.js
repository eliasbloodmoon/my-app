import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from '../../state/authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  mode: "light",
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
        state.isLoading = true
    })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
    })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
    })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
    })
  },
});

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  })


export const { setMode, setLogin, setLogout } =
  authSlice.actions;
export default authSlice.reducer;
