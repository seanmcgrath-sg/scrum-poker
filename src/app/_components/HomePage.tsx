"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createRoom = api.room.create.useMutation();

  const { data: rooms, refetch } = api.room.listRooms.useQuery();

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName) {
      setIsLoading(true);
      createRoom.mutate({ name: roomName }, {
        onSuccess: (data) => {
          refetch();
          setRoomName("");
          setIsLoading(false);
          router.push(`/rooms/${data.id}`);
        },
        onError: (error) => {
          console.error(error);
          setIsLoading(false);
        },
      });
    }
  };

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Scrum Poker</h1>
        <p className="mb-4">Please sign in to create or join rooms.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Create a New Room</h1>
      <form onSubmit={handleCreateRoom} className="mb-8">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Room"}
        </button>
      </form>

      <h2 className="mb-4 text-2xl font-bold">Your Rooms</h2>
      {rooms && rooms.length > 0 ? (
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="overflow-hidden bg-white shadow sm:rounded-md"
            >
              <Link
                href={`/rooms/${room.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <p className="truncate text-sm font-medium text-indigo-600">
                    {room.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Created at: {new Date(room.createdAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't created or joined any rooms yet.</p>
      )}
    </div>
  );
}