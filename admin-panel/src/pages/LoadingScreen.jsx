import { useEffect, useState } from "react";
import api from "../services/api";
import Offcanvas from "../components/Offcanvas";
import Table from "../components/Table";

export default function LoadingScreen() {
    const [screens, setScreens] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ id: "", image: null });

    const token = localStorage.getItem("token");

    const loadScreens = async () => {
        const res = await api.get("/user/loading/loading-screen", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.data) {
            setScreens([res.data.data]);
        } else {
            setScreens([]);
        }
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

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Loading Screen</h2>
                {/* <button
                    className="bg-brandGreen text-white px-4 py-2 rounded"
                    onClick={() => setForm({ id: "", image: null }) || setOpen(true)}
                >
                    + Upload New
                </button> */}
            </div>

            {screens.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-lg">No loading screen uploaded yet.</p>
                    <button
                        className="mt-4 bg-brandGreen hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition-all"
                        onClick={() => setForm({ id: "", image: null }) || setOpen(true)}
                    >
                        ➕ Upload Loading Screen
                    </button>
                </div>
            ) : (
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-100 p-4 flex justify-center">
                        <img
                            src={`http://localhost:8080/uploads/${screens[0].image}`}
                            alt="Loading Screen"
                            className="h-48 object-contain rounded border"
                        />
                    </div>
                    <div className="p-4 flex justify-end gap-2">
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                            onClick={() => editScreen(screens[0])}
                        >
                            Replace
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                            onClick={() => deleteScreen(screens[0])}
                        >
                            Delete
                        </button>
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
                        <label className="block mb-1 font-medium">Select Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-brandGreen w-full text-white py-2 rounded"
                    >
                        {form.id ? "Update" : "Upload"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    );
}