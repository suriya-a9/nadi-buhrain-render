import { useState, useEffect } from "react";
import api from "../services/api";
import Offcanvas from "../components/Offcanvas";
import Table from "../components/Table";

export default function Intro() {
    const [introList, setIntroList] = useState([]);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        id: "",
        content: [""]
    });

    const token = localStorage.getItem("token");

    const loadIntro = async () => {
        const res = await api.get("/intro/", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.data) {
            setIntroList([res.data.data]);
        }
    };

    useEffect(() => {
        loadIntro();
    }, []);

    const handleContentChange = (value, index) => {
        const updated = [...form.content];
        updated[index] = value;
        setForm({ ...form, content: updated });
    };

    const addContentField = () => {
        setForm({ ...form, content: [...form.content, ""] });
    };

    const removeContentField = (index) => {
        const updated = form.content.filter((_, i) => i !== index);
        setForm({ ...form, content: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            id: form.id,
            content: form.content
        };

        if (!form.id) {
            await api.post("/intro/add", body, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } else {
            await api.post("/intro/update", body, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }

        setOpen(false);
        loadIntro();
    };

    const editIntro = (intro) => {
        setForm({
            id: intro._id,
            content: intro.content
        });
        setOpen(true);
    };

    const deleteIntro = async (id) => {
        await api.post(
            "/intro/delete",
            { id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        loadIntro();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Intro Content</h2>

                {/* <button
                    className="bg-brandGreen text-white px-4 py-2 rounded"
                    onClick={() => {
                        setForm({ id: "", content: [""] });
                        setOpen(true);
                    }}
                >
                    + Add Intro
                </button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {introList.map((intro) => (
                    <div
                        key={intro._id}
                        className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-lg font-bold mb-2">Intro</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {intro.content.map((v, i) => (
                                <li key={i}>{v}</li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                onClick={() => editIntro(intro)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                onClick={() => deleteIntro(intro._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Offcanvas
                open={open}
                onClose={() => setOpen(false)}
                title={form.id ? "Edit Intro" : "Add Intro"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    {form.content.map((val, i) => (
                        <div key={i}>
                            <label className="text-sm font-semibold block mb-1">
                                Content #{i + 1}
                            </label>
                            <textarea
                                value={val}
                                onChange={(e) => handleContentChange(e.target.value, i)}
                                className="border p-2 rounded w-full"
                                rows={3}
                                required
                            />
                            {form.content.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeContentField(i)}
                                    className="text-red-600 text-sm mt-1"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addContentField}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                    >
                        + Add More
                    </button>

                    <button
                        type="submit"
                        className="bg-brandGreen w-full text-white py-2 rounded"
                    >
                        {form.id ? "Update Intro" : "Create Intro"}
                    </button>

                </form>
            </Offcanvas>
        </div>
    );
}