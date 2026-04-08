import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  tokenExpireAt: null,
  user: null,
  user_type_id: null,
  userDetails: null,
  userImage: null,
  version: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {
        token,
        tokenExpireAt,
        user,
        user_type_id,
        userDetails,
        userImage,
        version,
      } = action.payload;
      state.token = token ?? state.token;
      state.tokenExpireAt = tokenExpireAt ?? state.tokenExpireAt;
      state.user = user ?? state.user;
      state.user_type_id = user_type_id ?? user?.user_type_id ?? state.user_type_id;
      state.userDetails = userDetails ?? state.userDetails;
      state.userImage = userImage ?? state.userImage;
      state.version = version ?? state.version;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setUserImage: (state, action) => {
      state.userImage = action.payload;
    },
    setVersion: (state, action) => {
      state.version = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const {
  setCredentials,
  setToken,
  setUser,
  setUserImage,
  setVersion,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
