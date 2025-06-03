'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  useGetItemsQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from '@/lib/features/itemsApi';
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession(); // ✅ always call hooks at the top
  const [userData, setUserData] = useState(null);
  const { data: items = [], isLoading } = useGetItemsQuery();
  const [addItem] = useAddItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [form, setForm] = useState({ title: '', description: '' });

  // ✅ Fetch user data once session is available
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/me?email=${session.user.email}`);
        console.log('Fetching user data for:', session.user.email);
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [session]);

  // ❌ Don't put hooks below this line
  if (status === "loading") return <p>Loading session...</p>;
  if (!session) {
    redirect('/login');
    return null; // avoid rendering anything after redirect
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(form);
    setForm({ title: '', description: '' });
    Swal.fire('Success!', 'Item added successfully', 'success');
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
    <>
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">RTK Query CRUD</h1>
        <p className="mb-4">Welcome, {session.user.name || session.user.email}!</p>

        {userData?.image && (
          <img
            src={userData.image}
            alt="User Avatar"
            className="w-16 h-16 object-cover rounded-full mb-4"
          />
        )}

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
              <div key={item._id} className='flex flex-row gap-2 border items-center'>
                <li className="p-3 rounded">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p>{item.description}</p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() =>
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
                        })
                      }
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

      <div className='flex justify-center mt-3'>
        <button
          className='btn bg-red-500 text-white px-4 py-2 rounded'
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sign Out
        </button>
      </div>
    </>
  );
}
