"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import {
    Pencil,
    LogOut,
    Calendar,
    Image as ImageIcon,
    Trash2,
    Eye,
    Cake,
    Lock
} from "lucide-react";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PostCard from "@/components/PostCard";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [previewModal, setPreviewModal] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [form, setForm] = useState({
        username: "",
        bio: "",
        dob: "",
    });

    const [passwordOpen, setPasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });
    const [posts, setPosts] = useState([]);


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



    useEffect(() => {
        if (!user?._id) return;

        const fetchPosts = async () => {
            try {
                const { data } = await API.get(`/posts/user/${user._id}`);
                setPosts(data);
            } catch {
                toast.error("Failed to load posts");
            }
        };

        fetchPosts();
    }, [user?._id]);

    // 🚪 LOGOUT
    const logout = async () => {
        await API.post("/users/logout");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const changePassword = async () => {
        if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
            return toast.error("All fields required");
        }

        if (passwordForm.newPass !== passwordForm.confirm) {
            return toast.error("Passwords do not match");
        }

        try {
            await API.put("/users/change-password", {
                currentPassword: passwordForm.current,
                newPassword: passwordForm.newPass,
            });

            toast.success("Password updated 🔐");
            setPasswordOpen(false);

            setPasswordForm({
                current: "",
                newPass: "",
                confirm: "",
            });

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };


    // 📸 IMAGE SELECT
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setPreviewModal(true);
        setMenuOpen(false);
    };

    // ✅ UPLOAD
    const uploadProfilePic = async () => {
        const reader = new FileReader();

        reader.onloadend = async () => {
            const { data } = await API.put("/users/profile", {
                profilePic: reader.result,
            });

            setUser(data);
            setPreview(null);
            setPreviewModal(false);
            toast.success("Profile updated");
        };

        reader.readAsDataURL(image);
    };



    const removeImage = async () => {
        try {
            const { data } = await API.put("/users/profile", {
                profilePic: null, // 🔥 change here
            });

            setUser(data);
            setMenuOpen(false);
            toast.success("Profile removed");

        } catch {
            toast.error("Failed to remove image");
        }
    };

    // ✏ UPDATE
    const updateProfile = async () => {
        const { data } = await API.put("/users/profile", form);
        setUser(data);
        setEditOpen(false);
        toast.success("Profile updated");
    };

    // 🔥 FETCH USER POSTS
    useEffect(() => {
        if (!user?._id) return;

        const fetchPosts = async () => {
            try {
                const { data } = await API.get(`/posts/user/${user._id}`);
                setPosts(data);
            } catch {
                toast.error("Failed to load posts");
            }
        };

        fetchPosts();
    }, [user?._id]);

    if (!user) return null;

    const isMe = true; // 

    const onUpdate = (id, updatedPost) => {
        setPosts(prev =>
            prev.map(p => (p._id === id ? updatedPost : p))
        );
    };

    return (
        <div className="min-h-screen bg-black text-white lg:w-1/4 lg:mx-auto lg:pt-5 relative">

            {/* HEADER */}
            <div className="h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 relative">
                <div className="absolute top-4 right-4" >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="bg-black/40 p-2 rounded-full backdrop-blur text-white cursor-pointer"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {sidebarOpen && (
                        <div className="fixed inset-0 z-100 flex">

                            {/* 🔥 OVERLAY */}
                            <div
                                className="flex-1 bg-black/60"
                                onClick={() => setSidebarOpen(false)}
                            />

                            {/* 🔥 SIDEBAR */}
                            <div className="w-64 bg-zinc-900 p-4 flex flex-col justify-between">

                                {/* TOP */}
                                <div>

                                    <h2 className="text-lg font-semibold mb-4">Settings</h2>

                                    {/* 👤 PROFILE ACTIONS */}
                                    {user.profilePic && (
                                        <button
                                            onClick={() => {
                                                setPreview(user.profilePic);
                                                setPreviewModal(true);
                                                setSidebarOpen(false);
                                            }}
                                            className="cursor-pointer flex items-center gap-3 w-full py-2 hover:bg-white/10 px-2 rounded"
                                        >
                                            <Eye size={18} /> View Photo
                                        </button>
                                    )}

                                    <label className="cursor-pointer flex items-center gap-3 w-full py-2 hover:bg-white/10 px-2 rounded cursor-pointer">
                                        <ImageIcon size={18} /> Upload Photo
                                        <input type="file" hidden onChange={handleImage} />
                                    </label>

                                    {user.profilePic && (
                                        <button
                                            onClick={removeImage}
                                            className="cursor-pointer flex items-center gap-3 w-full py-2 text-red-400 hover:bg-white/10 px-2 rounded"
                                        >
                                            <Trash2 size={18} /> Remove Photo
                                        </button>
                                    )}

                                    <hr className="my-4 border-white/10" />

                                    {/* ⚙️ SETTINGS */}
                                    <button
                                        onClick={() => {
                                            setEditOpen(true);
                                            setSidebarOpen(false);
                                        }}
                                        className="cursor-pointer flex items-center gap-3 w-full py-2 hover:bg-white/10 px-2 rounded"
                                    >
                                        <Pencil size={18} /> Edit Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPasswordOpen(true);
                                            setSidebarOpen(false);
                                        }}
                                        className="cursor-pointer flex items-center gap-3 w-full py-2 hover:bg-white/10 px-2 rounded"
                                    >
                                        <Lock size={18} /> Change Password
                                    </button>

                                </div>

                                {/* 🔥 BOTTOM LOGOUT */}
                                <button
                                    onClick={logout}
                                    className="cursor-pointer flex items-center border-t-1 border-gray-700 gap-3 w-full py-2 text-red-400 hover:bg-white/10 px-2 "
                                >
                                    <LogOut size={18} /> Logout
                                </button>

                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="px-4 -mt-12">

                {/* PROFILE PIC */}
                <div className="relative w-fit mx-auto" ref={menuRef}>
                    <div
                        onClick={() => {
                            setPreview(user.profilePic);
                            setPreviewModal(true);
                        }
                        }
                        className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-[3px] cursor-pointer"
                    >
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                            {user.profilePic ? (
                                <img src={user.profilePic} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold">
                                    {user.username[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>


                </div>

                {/* INFO */}
                <div className="text-center mt-3">
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                    <p className="text-sm text-white/60">{user.email}</p>
                </div>

                <p className="text-center mt-3 text-sm text-white/80 px-4">
                    {user.bio || "No bio"}
                </p>

                <div className="flex justify-around mt-2 text-xs text-white/60">
                    {user.dob && (
                        <div className="flex items-center gap-2">
                            <Cake size={14} />
                            {new Date(user.dob).toLocaleDateString()}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>


            </div>




            {/* POSTS */}
            <div className="mt-6 space-y-4 border-t-1 border-gray-50 py-4">
                {posts.map(p => (
                    <PostCard
                        key={p._id}
                        post={p}
                        isOwner={true} // 🔥 important
                        refresh={(id) =>
                            setPosts(prev => prev.filter(x => x._id !== id))
                        }
                        onUpdate={onUpdate}
                    />
                ))}
            </div>



            {/* ✏ EDIT MODAL */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">

                    <div className="w-[90%] max-w-sm p-6 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20 
        shadow-2xl text-white">

                        {/* TITLE */}
                        <h2 className="text-xl font-semibold text-center mb-5">
                            Edit Profile
                        </h2>

                        {/* USERNAME */}
                        <input
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            placeholder="Username"
                            className="w-full mb-3 px-4 py-2 rounded-xl 
                bg-white/20 border border-white/30 
                placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* DOB */}
                        <input
                            type="date"
                            value={form.dob}
                            onChange={(e) =>
                                setForm({ ...form, dob: e.target.value })
                            }
                            className="w-full mb-3 px-4 py-2 rounded-xl 
                bg-white/20 border border-white/30 
                outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* BIO */}
                        <textarea
                            value={form.bio}
                            onChange={(e) =>
                                setForm({ ...form, bio: e.target.value })
                            }
                            placeholder="Write something about you..."
                            rows={3}
                            className="w-full mb-4 px-4 py-2 rounded-xl 
                bg-white/20 border border-white/30 
                placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3 mt-4">

                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 py-2 rounded-xl 
                    bg-white/20 hover:bg-white/30 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateProfile}
                                className="flex-1 py-2 rounded-xl 
                    bg-gradient-to-r from-blue-500 to-purple-500 
                    hover:opacity-90 transition cursor-pointer font-medium"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {passwordOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-[90%] max-w-sm">

                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Change Password
                        </h2>

                        {/* CURRENT */}
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordForm.current}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, current: e.target.value })
                            }
                            className="w-full mb-3 px-4 py-2 rounded-xl bg-white/20 border border-white/30 outline-none"
                        />

                        {/* NEW */}
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwordForm.newPass}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, newPass: e.target.value })
                            }
                            className="w-full mb-3 px-4 py-2 rounded-xl bg-white/20 border border-white/30 outline-none"
                        />

                        {/* CONFIRM */}
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordForm.confirm}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, confirm: e.target.value })
                            }
                            className="w-full mb-4 px-4 py-2 rounded-xl bg-white/20 border border-white/30 outline-none"
                        />

                        {/* ACTION */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPasswordOpen(false)}
                                className="flex-1 py-2 rounded-xl bg-gray-500 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={changePassword}
                                className="flex-1 py-2 rounded-xl bg-blue-500 cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 🔥 PREVIEW MODAL */}
            {previewModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl text-center">

                        <img src={preview} className="w-48 h-48 rounded-full mx-auto mb-4 object-cover" />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPreviewModal(false)}
                                className="flex-1 bg-gray-500 py-2 rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>

                            {image && (
                                <button
                                    onClick={uploadProfilePic}
                                    className="flex-1 bg-blue-500 py-2 rounded-xl cursor-pointer"
                                >
                                    Confirm
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}