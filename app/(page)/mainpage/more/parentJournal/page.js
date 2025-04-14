"use client";

import React, { useEffect, useState } from "react";

export default function ParentJournalPage() {
  const [journals, setJournals] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("parentJournals")) || [];
    setJournals(data);

    const uniqueChildren = Array.from(
      new Set(data.map((j) => j.childId))
    ).map((id) => ({
      id,
      name: `Child ${id}`, // Optional: replace this with actual child name if you have it
    }));
    setChildren(uniqueChildren);
  }, []);

  const handleDelete = (id) => {
    if (confirm("Delete this journal entry?")) {
      const updated = journals.filter((j) => j.id !== id);
      setJournals(updated);
      localStorage.setItem("parentJournals", JSON.stringify(updated));
    }
  };

  const handleEdit = (id, journal) => {
    setEditingId(id);
    setEditedText(journal);
  };

  const handleSave = (id) => {
    const updated = journals.map((j) =>
      j.id === id ? { ...j, journal: editedText, updatedAt: new Date().toISOString() } : j
    );
    setJournals(updated);
    localStorage.setItem("parentJournals", JSON.stringify(updated));
    setEditingId(null);
    setEditedText("");
  };

  const filteredJournals =
    selectedChildId === "all"
      ? journals
      : journals.filter((j) => j.childId === selectedChildId);

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">📓 Parent Journal</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Filter by child:</label>
        <select
          className="p-2 bg-gray-100 rounded-md"
          value={selectedChildId}
          onChange={(e) => setSelectedChildId(e.target.value)}
        >
          <option value="all">All Children</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      {/* Journal entries */}
      {filteredJournals.length === 0 ? (
        <p className="text-gray-500">No journal entries found.</p>
      ) : (
        <ul className="space-y-6">
          {filteredJournals
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((entry) => (
              <li
                key={entry.id}
                className="p-4 bg-white rounded-md shadow-md border border-yellow-200"
              >
                <h3 className="text-lg font-bold text-yellow-700 mb-1">
                  {entry.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Description:</span>{" "}
                  {entry.activityDescription}
                </p>

                <p className="text-xs text-gray-400 mb-2">
                  Created: {new Date(entry.createdAt).toLocaleString()}
                </p>

                {editingId === entry.id ? (
                  <>
                    <textarea
                      className="w-full p-2 bg-gray-100 border rounded mb-2"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleSave(entry.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-300 text-black px-3 py-1 rounded"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 mb-2">{entry.journal}</p>
                    <div className="flex gap-4">
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => handleEdit(entry.id, entry.journal)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => handleDelete(entry.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
