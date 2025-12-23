import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Offcanvas from "../components/Offcanvas";
import Pagination from "../components/Pagination";

export default function Block() {
    const [blockList, setBlockList] = useState([]);
    const [roadOptions, setRoadOptions] = useState([]);
    const [openCanvas, setOpenCanvas] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({
        name: "",
        roads: []
    });
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [blockList]);

    const token = localStorage.getItem("token");

    const loadRoads = async () => {
        const res = await api.get("/road/");
        setRoadOptions(res.data.data);
    };

    const loadBlockList = async () => {
        const res = await api.get("/block/");
        setBlockList(res.data.data);
    };

    useEffect(() => {
        loadBlockList();
        loadRoads();
    }, []);

    const openCreate = () => {
        setForm({ name: "", roads: [] });
        setEditData(null);
        setOpenCanvas(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setForm({
            name: item.name,
            roads: (item.roads || []).map(r => r._id || r),
        });
        setOpenCanvas(true);
    };

    const handleRoadCheckbox = (roadId) => {
        setForm((prev) => {
            const roads = prev.roads.includes(roadId)
                ? prev.roads.filter(id => id !== roadId)
                : [...prev.roads, roadId];
            return { ...prev, roads };
        });
    };

    const saveBlock = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (editData) payload.id = editData._id;

        await api.post(
            editData ? "/block/update" : "/block/add",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setOpenCanvas(false);
        loadBlockList();
    };

    const deleteBlock = async (id) => {
        await api.post(
            "/block/delete",
            { id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        loadBlockList();
    };

    const totalPages = Math.ceil(blockList.length / ITEMS_PER_PAGE);

    const paginatedBlock = blockList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const getRoadNames = (roads = []) => {
        console.log("getRoadNames roads:", roads);
        if (!Array.isArray(roads)) return "";
        return roads
            .map(r => (r && r.name ? r.name : ""))
            .filter(Boolean)
            .join(", ");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Block List</h2>
                <button
                    onClick={openCreate}
                    className="bg-bgGreen text-white px-4 py-2 rounded"
                >
                    Add Block
                </button>
            </div>
            <Table
                columns={[
                    { title: "Block Name", key: "name" },
                    {
                        title: "Road(s)",
                        key: "roads",
                        render: getRoadNames
                    }
                ]}
                data={paginatedBlock}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => openEdit(row)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteBlock(row._id)}
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
                title={editData ? "Edit Block" : "Add Block"}
            >
                <form onSubmit={saveBlock} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Block Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Road(s)</label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                            {roadOptions.map((road) => (
                                <label key={road._id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={road._id}
                                        checked={form.roads.includes(road._id)}
                                        onChange={() => handleRoadCheckbox(road._id)}
                                    />
                                    {road.name}
                                </label>
                            ))}
                        </div>
                        <small className="text-gray-500">Select one or more roads</small>
                    </div>
                    <button className="w-full bg-bgGreen text-white py-2 rounded">
                        {editData ? "Update Block" : "Create Block"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    );
}