import { useEffect, useState } from "react";
import api from "../services/api";
import Offcanvas from "../components/Offcanvas";

export default function LoadingScreen() {
    const [screens, setScreens] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ id: "", image: null });
    const [mediaModal, setMediaModal] = useState({ open: false, url: "", type: "" });

    const token = localStorage.getItem("token");

    const loadScreens = async () => {
        const res = await api.get("/user/loading/all", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setScreens(res.data.data || []);
    };

    useEffect(() => {
        loadScreens();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (form.image) formData.append("image", form.image);
        if (form.id) formData.append("id", form.id);

        await api.post(
            form.id ? "/user/loading/update" : "/user/loading/upload",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setOpen(false);
        setForm({ id: "", image: null });
        loadScreens();
    };
    const setEnabled = async (row, enabled) => {
        await api.post(
            "/user/loading/set-enabled",
            { id: row._id, enabled },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        loadScreens();
    };
    const editScreen = (row) => {
        setForm({ id: row._id, image: null });
        setOpen(true);
    };

    const deleteScreen = async (row) => {
        await api.post(
            "/user/loading/delete",
            { id: row._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        loadScreens();
    };

    // Helper to determine file type
    const getMediaType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (["mp4", "webm", "ogg"].includes(ext)) return "video";
        if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) return "image";
        return "unknown";
    };

    const handleMediaClick = (screen) => {
        const url = `${import.meta.env.VITE_API_URL}/uploads/${screen.image}`;
        const type = getMediaType(screen.image);
        setMediaModal({ open: true, url, type });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Loading Screen</h2>
                <button
                    className="bg-bgGreen text-white px-4 py-2 rounded"
                    onClick={() => setForm({ id: "", image: null }) || setOpen(true)}
                >
                    + Upload New
                </button>
            </div>

            {screens.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-lg">No loading screen uploaded yet.</p>
                    <button
                        className="mt-4 bg-bgGreen hover:bg-bgGreen text-white px-4 py-2 rounded shadow-md transition-all"
                        onClick={() => setForm({ id: "", image: null }) || setOpen(true)}
                    >
                        ➕ Upload Loading Screen
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {screens.map((screen) => (
                        <div key={screen._id} className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-100 p-4 flex justify-center cursor-pointer" onClick={() => handleMediaClick(screen)}>
                                {getMediaType(screen.image) === "image" ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${screen.image}`}
                                        alt="Loading Screen"
                                        className="h-48 object-contain rounded border"
                                    />
                                ) : getMediaType(screen.image) === "video" ? (
                                    <video
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${screen.image}`}
                                        className="h-48 object-contain rounded border"
                                        muted
                                        preload="metadata"
                                    />
                                ) : (
                                    <span>Unsupported file</span>
                                )}
                            </div>
                            <div className="p-4 flex justify-end gap-2">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                                    onClick={() => editScreen(screen)}
                                >
                                    Replace
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                    onClick={() => deleteScreen(screen)}
                                >
                                    Delete
                                </button>
                                <button
                                    className={`px-4 py-2 rounded transition ${screen.enabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"} text-white`}
                                    onClick={() => setEnabled(screen, !screen.enabled)}
                                >
                                    {screen.enabled ? "Disable" : "Enable"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mediaModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setMediaModal({ open: false, url: "", type: "" })}>
                    <div className="bg-white rounded-lg p-4 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-700" onClick={() => setMediaModal({ open: false, url: "", type: "" })}>✕</button>
                        {mediaModal.type === "image" ? (
                            <img src={mediaModal.url} alt="Preview" className="w-full h-auto rounded" />
                        ) : mediaModal.type === "video" ? (
                            <video src={mediaModal.url} controls autoPlay className="w-full h-auto rounded" />
                        ) : (
                            <span>Unsupported file</span>
                        )}
                    </div>
                </div>
            )}

            <Offcanvas
                open={open}
                onClose={() => setOpen(false)}
                title={form.id ? "Update Loading Screen" : "Upload Loading Screen"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="block mb-1 font-medium">
                            Select Image / Video <br/>
                            <span className="text-xs">
                                (Image: 375×375px, Video: 1080×1920px)
                            </span>
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-bgGreen w-full text-white py-2 rounded"
                    >
                        {form.id ? "Update" : "Upload"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    );
}