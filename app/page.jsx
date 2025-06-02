'use client';

import Swal from 'sweetalert2';
import {
  useGetItemsQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from '@/lib/features/itemsApi';
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";




export default function Home() {
  const { data: items = [], isLoading } = useGetItemsQuery();
  const [addItem] = useAddItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [form, setForm] = useState({ title: '', description: '' });

  const { data: session, status } = useSession();

if (status === "loading") return <p>Loading session...</p>;
if (!session) redirect('/login'); // or show login button


  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(form);
    setForm({ title: '', description: '' });
    Swal.fire({
      title: 'Success!',
      text: 'Item added successfully',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const handleUpdate = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Item',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Title" value="${item.title}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${item.description}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const title = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
        if (!title || !description) {
          Swal.showValidationMessage('Please enter both title and description');
        }
        return { title, description };
      },
    });

    if (formValues) {
      await updateItem({ id: item._id, ...formValues });
      Swal.fire('Updated!', 'Item updated successfully.', 'success');
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">RTK Query CRUD</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="border p-2 w-full"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {items.length === 0 && <p>No items found.</p>}

          {items.map((item) => (
            <div className='flex flex-row gap-2 border items-center' key={item._id}>
              <li key={item._id} className=" p-3 rounded">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p>{item.description}</p>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Are you sure?',
                      text: 'This action cannot be undone.',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, delete it!',
                      cancelButtonText: 'No, cancel!',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        deleteItem(item._id);
                        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
                      }
                    });
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleUpdate(item)}
                  className="text-blue-500"
                >
                  Update
                </button>
              </div>
            </li>
            <div>
              <p>{item.createdAt} createdAt</p>
              <p>{item.updatedAt} updatedAt</p>
            </div>
            </div>
          ))}
        </ul>
      )}
    </main>
  );
}
