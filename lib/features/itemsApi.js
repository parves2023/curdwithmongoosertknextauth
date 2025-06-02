// lib/features/itemsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Items'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => 'items',
      providesTags: ['Items'],
    }),
    addItem: builder.mutation({
      query: (newItem) => ({
        url: 'items',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['Items'],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Items'],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `items/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Items'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} = itemsApi;
