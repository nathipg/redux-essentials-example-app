import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {id: '1', title: 'Post 1', content: 'Content 1'},
  {id: '2', title: 'Post 2', content: 'Content 2'},
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded(state, action) {
      state.push(action.payload);
    },
  },
});

export const { postAdded } = postsSlice.actions;

export default postsSlice.reducer;
