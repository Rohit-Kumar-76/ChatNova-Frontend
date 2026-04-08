"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import {
    Pencil,
    LogOut,
    Users,
    Calendar,
    Image as ImageIcon,
    Trash2,
    Eye,
    Cake
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [previewModal, setPreviewModal] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [form, setForm] = useState({
        username: "",
        bio: "",
        dob: "",
    });

    const menuRef = useRef(null);
    const router = useRouter();

    // 🔄 FETCH
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get("/users/profile");
                setUser(data);
                setForm({
                    username: data.username,
                    bio: data.bio || "",
                    dob: data.dob ? data.dob.split("T")[0] : "",
                });
            } catch {
                toast.error("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    // 🔥 CLICK OUTSIDE CLOSE
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🚪 LOGOUT
    const logout = async () => {
        try {
            await API.post("/users/logout");
            localStorage.removeItem("user");

            toast.success("Logged out successfully 👋");

            router.push("/login");
        } catch {
            toast.error("Logout failed");
        }
    };

    // 📸 IMAGE
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setPreviewModal(true);
    };

    // ✅ UPLOAD
    const uploadProfilePic = async () => {
        try {
            const reader = new FileReader();

            reader.onloadend = async () => {
                const { data } = await API.put("/users/profile", {
                    profilePic: reader.result,
                });

                setUser(data);
                setPreview(null);
                setPreviewModal(false);

                toast.success("Profile picture updated 📸");
            };

            reader.readAsDataURL(image);
        } catch {
            toast.error("Failed to upload image");
        }
    };

    // ❌ REMOVE
    const removeImage = async () => {
        try {
            const { data } = await API.put("/users/profile", {
                profilePic: "",
            });

            setUser(data);

            toast.success("Profile picture removed ❌");
        } catch {
            toast.error("Failed to remove image");
        }
    };

    // ✏ UPDATE
    const updateProfile = async () => {
        try {
            const { data } = await API.put("/users/profile", form);
            setUser(data);
            setEditOpen(false);

            toast.success("Profile updated ✨");
        } catch {
            toast.error("Failed to update profile");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white lg:w-1/4 lg:mx-auto lg:pt-5">

            {/* HEADER */}
            <div className="relative h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500"></div>

            {/* PROFILE */}
            <div className="px-4 -mt-12">

                {/* PROFILE PIC */}
                <div className="relative w-fit mx-auto" ref={menuRef}>
                    <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-[3px]"
                    >
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                            {user.profilePic ? (
                                <img src={user.profilePic} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* MENU */}
                    {menuOpen && (
                        <div className="absolute top-full mt-2 bg-white text-black rounded-xl shadow-lg w-44 overflow-hidden left-1/2 -translate-x-1/2">

                            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                <ImageIcon size={16} /> Upload
                                <input type="file" hidden onChange={handleImage} />
                            </label>

                            {user.profilePic && (
                                <button
                                    onClick={removeImage}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-gray-100"
                                >
                                    <Trash2 size={16} /> Remove
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* INFO */}
                {/* INFO */}
                <div className="text-center mt-3">
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                    <p className="text-sm text-white/60">{user.email}</p>
                </div>

                {/* BIO */}
                <p className="text-center mt-3 text-sm text-white/80 px-4">
                    {user.bio || "No bio added"}
                </p>

                <div className="flex justify-around">
                    {/* DOB */}
                    {user.dob && (
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white/60">
                            <Cake size={14} />
                            <span>
                                {new Date(user.dob).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                })}
                            </span>
                        </div>
                    )}

                    {/* JOINED */}
                    <div className="flex items-center justify-center gap-2 mt-1 text-xs text-white/60">
                        <Calendar size={14} />
                        <span>
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-GB", {
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                {/* ACTION */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setEditOpen(true)}
                        className="flex-1 bg-white text-black py-2 rounded-xl flex items-center justify-center gap-2"
                    >
                        <Pencil size={16} /> Edit
                    </button>

                    <button
                        onClick={logout}
                        className="flex-1 bg-red-500 py-2 rounded-xl flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
            {/* ✏ EDIT MODAL */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-xl text-black w-[300px]">

                        <h2 className="font-bold mb-3">Edit Profile</h2>

                        <input
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            className="w-full border p-2 mb-2 rounded"
                            placeholder="Username"
                        />

                        <input
                            type="date"
                            value={form.dob}
                            onChange={(e) =>
                                setForm({ ...form, dob: e.target.value })
                            }
                            className="w-full border p-2 mb-2 rounded"
                        />

                        <textarea
                            value={form.bio}
                            onChange={(e) =>
                                setForm({ ...form, bio: e.target.value })
                            }
                            className="w-full border p-2 mb-2 rounded"
                            placeholder="Bio"
                        />

                        <div className="flex justify-between mt-3">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="px-3 py-1 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateProfile}
                                className="px-3 py-1 bg-black text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}