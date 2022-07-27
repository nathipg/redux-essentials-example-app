import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { client } from '../../api/client';

import { REQUEST_STATUS } from '../../shared/constants';

const initialState = {
  posts: [],
  status: REQUEST_STATUS.IDLE,
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts');
  return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
  const response = await client.post('/fakeApi/posts', initialPost);
  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Not used anymore because of addNewPost
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare(post) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         ...post,
    //       }
    //     }
    //   }
    // },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.status = REQUEST_STATUS.LOADING;
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = REQUEST_STATUS.SUCCEEDED;
      state.posts = state.posts.concat(action.payload);
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.status = REQUEST_STATUS.FAILED;
      state.error = action.error.message;
    });

    builder.addCase(addNewPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
  },
});

export const { postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

// Selectors
export const selectAllPosts = state => state.posts.posts;

export const selectPostById = postId => state => state.posts.posts.find(post => post.id === postId);

export const selectPostsStatus = state => state.posts.status;

export const selectPostsError = state => state.posts.error;
