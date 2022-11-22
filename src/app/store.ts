import { configureStore } from '@reduxjs/toolkit'
import storyReducer from '../features/storySlice'
import accountReducer from '../features/accountSlice'

const reducer = {
  story: storyReducer,
  account: accountReducer
}

export const store = configureStore({
  reducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
