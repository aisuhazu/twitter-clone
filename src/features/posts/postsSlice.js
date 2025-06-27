import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL =
  "https://19bd3076-ac35-4289-b751-d533e5e247d9-00-aagfr8zx1fjw.pike.replit.dev";

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
    return response.json();
  }
);

export const savePost = createAsyncThunk(
  "posts/savePost",
  async (postContent) => {
    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;

    const data = {
      title: "Post Title",
      content: postContent,
      user_id: userId,
    };

    const response = await axios.post(`${BASE_URL}/posts`, data);
    return response.data;
  }
);

//slice
const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    }),
      builder.addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      });
  },
});

export default postsSlice.reducer;
