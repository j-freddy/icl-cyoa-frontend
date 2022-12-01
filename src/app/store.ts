import { configureStore } from '@reduxjs/toolkit'
import storyReducer from '../features/storySlice'
import accountReducer from '../features/accountSlice'
import initialInputReducer from '../features/initialInputSlice'
import wsReducer from '../features/wsSlice'
import wsMiddleware from '../features/wsMiddleware'

const reducer = {
  story: storyReducer,
  account: accountReducer,
  initialInput: initialInputReducer,
  ws: wsReducer,
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([wsMiddleware])
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
