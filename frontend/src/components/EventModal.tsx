"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/http";
import { getToken } from "@/lib/auth";

export default function EventModal({
  open,
  onClose,
  editData,
  onSuccess,
}: any) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    capacity: "",
    tags: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (editData) {
      // Prefill when editing
      setForm({
        title: editData.title || "",
        date: editData.date?.split("T")[0] || "",
        time: new Date(editData.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: editData.description || "",
        location: editData.location || "",
        capacity: editData.capacity?.toString() || "",
        tags: (editData.tags || []).join(", "),
        imageUrl: editData.imageUrl || "",
      });
    } else {
      // Empty when creating new
      setForm({
        title: "",
        date: "",
        time: "",
        description: "",
        location: "",
        capacity: "",
        tags: "",
        imageUrl: "",
      });
    }
  }, [editData]);

  if (!open) return null;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = getToken();

    const dateTime = new Date(`${form.date}T${form.time}`);

    const data = {
      title: form.title,
      description: form.description,
      location: form.location,
      date: dateTime.toISOString(),
      capacity: Number(form.capacity),
      tags: form.tags.split(",").map((t) => t.trim()),
      imageUrl: form.imageUrl || "/event.jpg",
    };

    try {
      if (editData) {
        await api.patch(`/events/${editData.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/events", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[#1b1361] mb-4">
          {editData ? "Edit Event" : "Create New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded-md p-2"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-md p-2"
            rows={3}
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Event Location"
            className="w-full border rounded-md p-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="w-full border rounded-md p-2"
            />
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full border rounded-md p-2"
            />
          </div>
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-[#1b1361] mb-2">
              Image
            </label>

            <div className="flex items-center justify-between border border-dashed border-[#c7c8e0] rounded-md p-4 bg-[#fafaff]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#eef2ff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#3b5cff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="text-sm text-[#6a6791]">
                  Drag or{" "}
                  <label className="text-[#3b5cff] cursor-pointer hover:underline">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const token = getToken();
                          const res = await api.post("/upload", formData, {
                            headers: {
                              "Content-Type": "multipart/form-data",
                              Authorization: `Bearer ${token}`,
                            },
                          });

                          setForm({ ...form, imageUrl: res.data.url });
                        } catch (err) {
                          console.error("Upload failed:", err);
                          alert("Image upload failed. Please try again.");
                        }
                      }}
                    />
                    upload
                  </label>{" "}
                  the picture here
                  <div className="text-xs text-[#9aa0b6]">
                    Max 5MB | JPG, PNG
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1 text-sm bg-[#eef2ff] rounded-md text-[#3b5cff] border border-[#d4d7f3] hover:bg-[#e5e8ff]"
                onClick={() =>
                  document
                    .querySelector<HTMLInputElement>('input[type="file"]')
                    ?.click()
                }
              >
                Browse
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] text-white shadow hover:opacity-95"
            >
              {editData ? "Update" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
