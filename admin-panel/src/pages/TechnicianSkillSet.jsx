import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Offcanvas from "../components/Offcanvas";
import Pagination from "../components/Pagination";

export default function TechnicianSkills() {
    const [technicianSkill, setTechnicianSkill] = useState([]);
    const [openCanvas, setOpenCanvas] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({
        skill: "",
    });
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [technicianSkill]);
    const token = localStorage.getItem("token");
    const loadTechnicianSkill = async () => {
        const res = await api.get("/technical");
        setTechnicianSkill(res.data.data);
    };
    useEffect(() => {
        loadTechnicianSkill();
    }, []);
    const openCreate = () => {
        setForm({
            skill: "",
        });
        setEditData(null);
        setOpenCanvas(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setForm({
            skill: item.skill,
        });
        setOpenCanvas(true);
    };
    const saveTechnicianSkill = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (editData) payload.id = editData._id;

        await api.post(
            editData ? "/technical/update" : "/technical/add",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setOpenCanvas(false);
        loadTechnicianSkill();
    };

    const deleteTechnicianSkill = async (id) => {
        await api.post(
            "/technical/delete",
            { id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        loadTechnicianSkill();
    };
    const totalPages = Math.ceil(technicianSkill.length / ITEMS_PER_PAGE);

    const paginatedTechnicianSkill = technicianSkill.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Technician Skill Set</h2>
                <button
                    onClick={openCreate}
                    className="bg-bgGreen text-white px-4 py-2 rounded"
                >
                    Add Skill
                </button>
            </div>
            <Table
                columns={[
                    { title: "Skill", key: "skill" },
                ]}
                data={paginatedTechnicianSkill}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => openEdit(row)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteTechnicianSkill(row._id)}
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
                title={editData ? "Edit Skill" : "Add Skill"}
            >
                <form onSubmit={saveTechnicianSkill} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Skill</label>
                        <input
                            type="text"
                            value={form.skill}
                            onChange={(e) => setForm({ ...form, skill: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <button className="w-full bg-bgGreen text-white py-2 rounded">
                        {editData ? "Update Skill" : "Create Skill"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    )
}