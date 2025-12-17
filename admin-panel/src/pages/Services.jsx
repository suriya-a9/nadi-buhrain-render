import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import Offcanvas from "../components/Offcanvas";
import Table from "../components/Table";

export default function Services() {
    const [services, setServices] = useState([]);
    const [openCanvas, setOpenCanvas] = useState(false);

    const [form, setForm] = useState({
        id: "",
        name: "",
        serviceImage: null,
        serviceLogo: null,
    });

    const loadServices = async () => {
        const res = await api.get("/service");
        setServices(res.data.data);
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files[0] : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("name", form.name);
        if (form.serviceImage) fd.append("serviceImage", form.serviceImage);
        if (form.serviceLogo) fd.append("serviceLogo", form.serviceLogo);

        if (form.id) fd.append("id", form.id);

        await api.post(form.id ? "/service/edit" : "/service/add", fd);

        loadServices();
        setOpenCanvas(false);
        setForm({ id: "", name: "", serviceImage: null, serviceLogo: null });
    };

    const editService = (s) => {
        setForm({
            id: s._id,
            name: s.name,
            serviceImage: null,
            serviceLogo: null,
        });
        setOpenCanvas(true);
    };

    const deleteService = async (id) => {
        await api.post("/service/delete", { id });
        loadServices();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Services</h2>

                <button
                    className="bg-brandGreen text-white px-4 py-2 rounded"
                    onClick={() => {
                        setForm({ id: "", name: "", serviceImage: null, serviceLogo: null });
                        setOpenCanvas(true);
                    }}
                >
                    + Add Service
                </button>
            </div>

            <Table
                columns={[
                    { title: "Name", key: "name" },
                    {
                        title: "Image",
                        key: "serviceImage",
                        render: (value) =>
                            value ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/${value}`}
                                    className="h-12 rounded border"
                                />
                            ) : (
                                "-"
                            ),
                    },
                    {
                        title: "Logo",
                        key: "serviceLogo",
                        render: (value) =>
                            value ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/${value}`}
                                    className="h-12 rounded border"
                                />
                            ) : (
                                "-"
                            ),
                    },
                ]}
                data={services}
                actions={(row) => (
                    <div>
                        <button
                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                            onClick={() => editService(row)}
                        >
                            Edit
                        </button>

                        <button
                            className="bg-red-600 text-white px-3 py-1 rounded"
                            onClick={() => deleteService(row._id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            />

            <Offcanvas
                open={openCanvas}
                onClose={() => setOpenCanvas(false)}
                title={form.id ? "Edit Service" : "Add Service"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex flex-col gap-1">
                        <label className="block mb-1 font-medium">Service Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter Service Name"
                            required
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block mb-1 font-medium">Service Image</label>
                        <input
                            type="file"
                            name="serviceImage"
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block mb-1 font-medium">Service Logo</label>
                        <input
                            type="file"
                            name="serviceLogo"
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-brandGreen w-full text-white py-2 rounded"
                    >
                        {form.id ? "Update Service" : "Create Service"}
                    </button>
                </form>
            </Offcanvas>
        </div>
    );
}