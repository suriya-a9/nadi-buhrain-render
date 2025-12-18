import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Offcanvas from "../components/Offcanvas";
import Pagination from "../components/Pagination";

export default function Technicians() {
    const [technicians, setTechnicians] = useState([]);
    const [openCanvas, setOpenCanvas] = useState(false);
    const [editData, setEditData] = useState(null);
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        gender: "",
        role: "",
        password: "",
    });
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [technicians]);
    const loadSkills = async () => {
        const res = await api.get("/technical");
        setSkills(res.data.data);
    };
    useEffect(() => {
        loadTechnicians();
        loadSkills();
    }, []);

    const token = localStorage.getItem("token");

    const loadTechnicians = async () => {
        const res = await api.post(
            "/technician/list",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTechnicians(res.data.data);
    };

    useEffect(() => {
        loadTechnicians();
    }, []);

    const openCreate = () => {
        setForm({
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            gender: "",
            role: "",
            password: "",
        });
        setEditData(null);
        setOpenCanvas(true);
    };

    const openEdit = (tech) => {
        setEditData(tech);
        setForm({
            firstName: tech.firstName,
            lastName: tech.lastName,
            email: tech.email,
            mobile: tech.mobile,
            gender: tech.gender,
            role: tech.role?._id || "",
            password: "",
        });
        setOpenCanvas(true);
    };

    const saveTechnician = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        Object.keys(form).forEach((key) => fd.append(key, form[key]));

        if (editData) fd.append("id", editData._id);

        await api.post(
            editData ? "/technician/update-profile" : "/technician/register",
            fd,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setOpenCanvas(false);
        loadTechnicians();
    };

    const deleteTechnician = async (id) => {
        await api.post(
            "/technician/delete",
            { id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        loadTechnicians();
    };
    const totalPages = Math.ceil(technicians.length / ITEMS_PER_PAGE);

    const paginatedTechnicians = technicians.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Technicians List</h2>
                <button
                    onClick={openCreate}
                    className="bg-bgGreen text-white px-4 py-2 rounded"
                >
                    Add Technician
                </button>
            </div>

            <Table
                columns={[
                    { title: "First Name", key: "firstName" },
                    { title: "Last Name", key: "lastName" },
                    { title: "Mobile", key: "mobile" },
                    { title: "Email", key: "email" },
                    { title: "Gender", key: "gender" },
                    {
                        title: "Role",
                        key: "role",
                        render: (role) => role?.skill || "-",
                    },
                ]}
                data={paginatedTechnicians}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => openEdit(row)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteTechnician(row._id)}
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
                title={editData ? "Edit Technician" : "Add Technician"}
            >
                <form onSubmit={saveTechnician} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">First Name</label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Last Name</label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Mobile</label>
                        <input
                            type="text"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Gender</label>
                        <select
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Skill</label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Skill</option>
                            {skills.map((skill) => (
                                <option key={skill._id} value={skill._id}>
                                    {skill.skill}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!editData && (
                        <div>
                            <label className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                    )}

                    <button className="w-full bg-bgGreen text-white py-2 rounded">
                        {editData ? "Update Technician" : "Create Technician"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    );
}