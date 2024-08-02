"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const pointValues = ["0", "1", "2", "3", "5", "8", "13", "21", "?"];

export default function RoomPage({ id }: { id: string }) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const { data: room, refetch: refetchRoom } = api.room.getRoom.useQuery(
    { roomId: id },
    {
      refetchInterval: 1000, // Refetch every 1 seconds
    },
  );

  const castVote = api.vote.castVote.useMutation({
    onSuccess: () => {
      void refetchRoom();
    },
  });

  const resetVotes = api.vote.resetVotes.useMutation({
    onSuccess: () => {
      void refetchRoom();
    },
  });

  const toggleVotesVisible = api.room.toggleVotesVisible.useMutation({
    onSuccess: () => {
      void refetchRoom();
    },
  });

  const handleVote = (value: string) => {
    setSelectedValue(value);
    castVote.mutate({ roomId: id, value });
  };

  const handleResetVotes = () => {
    resetVotes.mutate({ roomId: id });
    setSelectedValue(null);
  };

  const handleToggleVotesVisible = () => {
    toggleVotesVisible.mutate({ roomId: id });
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">{room.name}</h1>
      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Participants</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {room.participants.map((participant) => (
            <li key={participant.id} className="rounded-lg bg-white p-4 shadow">
              {participant.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Your Vote</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {pointValues.map((value) => (
            <button
              key={value}
              onClick={() => handleVote(value)}
              className={`rounded-md px-4 py-2 ${
                selectedValue === value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Votes</h2>
        {room.votes.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {room.votes.map((vote) => (
              <li key={vote.id} className="rounded-lg bg-white p-4 shadow">
                <p className="font-semibold">{vote.user.name}</p>
                <p className="text-2xl">
                  {room.votesVisible ? vote.value : "?"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No votes yet.</p>
        )}
      </div>
      <button
        onClick={handleToggleVotesVisible}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {room.votesVisible ? "Hide Votes" : "Show Votes"}
      </button>
      {room.ownerId === room.participants[0]?.id && (
        <button
          onClick={handleResetVotes}
          className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reset Votes
        </button>
      )}
    </div>
  );
}