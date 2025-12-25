import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Offcanvas from "../components/Offcanvas";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

export default function Road() {
    const [roadList, setRoadList] = useState([]);
    const [openCanvas, setOpenCanvas] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({
        name: ""
    });
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [roadList]);
    const token = localStorage.getItem("token");

    const loadRoadList = async () => {
        try {
            const res = await api.get("/road/");
            setRoadList(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    useEffect(() => {
        loadRoadList();
    }, []);
    const openCreate = () => {
        setForm({ issue: "" });
        setEditData(null);
        setOpenCanvas(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setForm({
            name: item.name
        });
        setOpenCanvas(true);
    };

    const saveRoad = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (editData) payload.id = editData._id;
        try {
            const res = await api.post(
                editData ? "/road/update" : "/road/add",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message);
            setOpenCanvas(false);
            loadRoadList();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const deleteRoad = async (id) => {
        try {
            const res = await api.post(
                "/road/delete",
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message);
            loadRoadList();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const totalPages = Math.ceil(roadList.length / ITEMS_PER_PAGE);

    const paginatedRoad = roadList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Road List</h2>
                <button
                    onClick={openCreate}
                    className="bg-bgGreen text-white px-4 py-2 rounded"
                >
                    Add Road Type
                </button>
            </div>
            <Table
                columns={[
                    {
                        title: "s/no",
                        key: "sno",
                        render: (_, __, idx) =>
                            (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
                    },
                    { title: "Name", key: "name" }
                ]}
                data={paginatedRoad}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => openEdit(row)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteRoad(row._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                )}
            />
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
            <Offcanvas
                open={openCanvas}
                onClose={() => setOpenCanvas(false)}
                title={editData ? "Edit Road" : "Add Road"}
            >
                <form onSubmit={saveRoad} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <button className="w-full bg-bgGreen text-white py-2 rounded">
                        {editData ? "Update Road" : "Create Road"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    )
}