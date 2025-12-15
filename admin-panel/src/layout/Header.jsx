import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { IoIosNotifications } from "react-icons/io";
import { io } from "socket.io-client";
import api from "../services/api";

export default function Header({ toggleSidebar }) {
    const { logout } = useAuth();
    const [openMenu, setOpenMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const loadNotifications = async () => {
        const res = await api.get("/notifications");
        setNotifications(res.data.data);
    };

    useEffect(() => {
        loadNotifications();
        const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080");
        socket.on('notification', (data) => {
            setNotifications((prev) => [data, ...prev]);
        });
        return () => socket.disconnect();
    }, []);

    const markAsRead = async (id) => {
        await api.post(`/notifications/mark-read/${id}`);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
    };

    const clearAll = async () => {
        await api.post("/notifications/clear");
        setNotifications([]);
    };
    return (
        <header className="bg-white shadow h-16 flex items-center px-4 justify-between">
            <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded hover:bg-gray-100"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <h1 className="text-xl font-semibold"> </h1>

            <div className="relative flex items-center">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative p-2 rounded hover:bg-gray-100"
                >
                    <span className="material-icons"><IoIosNotifications size={25} /></span>
                    {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                            {notifications.filter(n => !n.read).length}
                        </span>
                    )}
                </button>
                {showDropdown && (
                    <div className="absolute right-0 top-[35px] mt-2 w-80 bg-white rounded shadow-md py-2 z-50">
                        <div className="flex justify-between items-center px-4 py-2">
                            <h3 className="font-semibold">Notifications</h3>
                            <button
                                onClick={clearAll}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                        <ul>
                            {notifications.length === 0 ? (
                                <li className="px-4 py-2 text-gray-500">No notifications</li>
                            ) : (
                                notifications.map((n, idx) => (
                                    <li
                                        key={n._id || idx}
                                        className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${n.read ? "text-gray-400" : ""}`}
                                        onClick={() => markAsRead(n._id)}
                                    >
                                        {n.message}
                                        <div className="text-xs text-gray-400">{new Date(n.time).toLocaleString()}</div>
                                        {!n.read && <span className="ml-2 text-blue-500 text-xs">Mark as read</span>}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                >
                    <img
                        src="/assets/admin-logo.webp"
                        alt="avatar"
                        className="w-9 h-9 rounded-full"
                    />
                </button>

                {openMenu && (
                    <div className="absolute right-0 top-[35px] mt-2 w-40 bg-white rounded shadow-md py-2">
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = "/login";
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}