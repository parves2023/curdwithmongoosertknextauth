// lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import { itemsApi } from '@/lib/features/itemsApi';

export const store = configureStore({
  reducer: {
    [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(itemsApi.middleware),
});
