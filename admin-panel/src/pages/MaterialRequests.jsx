import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

export default function MaterialRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem("token");

    const loadRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get("/material");
            setRequests(res.data.data || []);
        } catch {
            setRequests([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const updateStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            const res = await api.post(
                "/material/request-status",
                { id, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message);
            loadRequests();
        } catch (err) {
            toast.error(err.response?.data?.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const paginatedRequests = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Material Requests</h2>
            </div>
            <Table
                columns={[
                    {
                        title: "s/no",
                        key: "sno",
                        render: (_, __, idx) =>
                            (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
                    },
                    {
                        title: "Technician",
                        key: "technicianId",
                        render: (tech) =>
                            tech?.firstName
                                ? `${tech.firstName} ${tech.lastName || ""}`
                                : "-"
                    },
                    {
                        title: "Product",
                        key: "productId",
                        render: (prod) => prod?.productName || "-"
                    },
                    { title: "Quantity", key: "quantity" },
                    { title: "Notes", key: "notes" },
                    { title: "Status", key: "status" },
                ]}
                data={paginatedRequests}
                actions={(row) => (
                    <div className="flex gap-2">
                        {row.status !== "processed" && (
                            <button
                                disabled={updatingId === row._id}
                                onClick={() => updateStatus(row._id, "processed")}
                                className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                                {updatingId === row._id ? "Updating..." : "Process"}
                            </button>
                        )}
                        {row.status !== "rejected" && (
                            <button
                                disabled={updatingId === row._id}
                                onClick={() => updateStatus(row._id, "rejected")}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                {updatingId === row._id ? "Updating..." : "Reject"}
                            </button>
                        )}
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
        </div>
    );
}