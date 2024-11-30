import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    login: (state, action) => {
      if (state.user && state.user.email === action.payload.email) {
        state.isAuthenticated = true;
      } else {
        throw new Error('Invalid credentials');
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
