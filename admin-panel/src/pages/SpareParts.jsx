import { useState, useEffect } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Pagination from "../components/Pagination";

export default function SpareParts() {
    const [spareParts, setSpareParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const loadSpareParts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/material/spare-parts");
            setSpareParts(res.data.data || []);
        } catch {
            setSpareParts([]);
        }
        setLoading(false);
    };
    useEffect(() => {
        loadSpareParts();
    }, []);
    const totalPages = Math.ceil(spareParts.length / ITEMS_PER_PAGE);
    const paginatedSpareParts = spareParts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Spare Parts</h2>
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
                    { title: "Count", key: "count" },
                ]}
                data={paginatedSpareParts}
            />
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    )
}