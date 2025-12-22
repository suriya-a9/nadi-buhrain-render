import { useEffect, useState } from "react";
import Table from "../components/Table";
import api from "../services/api";
import Pagination from "../components/Pagination";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const API_BASE = (import.meta.env.VITE_API_URL).replace(/\/$/, "");
    useEffect(() => {
        setCurrentPage(1);
    }, [logs]);
    const token = localStorage.getItem("token");
    const loadLogs = async () => {
        const res = await api.post(
            "/user-log",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(res.data.data);
        console.log(logs);
    };
    useEffect(() => {
        loadLogs();
    }, []);
    const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);

    const paginatedLogs = logs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">User Activity</h2>
            </div>
            <Table
                columns={[
                    {
                        title: "Logo",
                        key: "logo",
                        render: (logo) =>
                            logo ? (
                                <img
                                    src={`${API_BASE}${logo}`}
                                    alt="Log Logo"
                                    style={{ width: 32, height: 32, objectFit: "contain" }}
                                />
                            ) : (
                                "-"
                            ),
                    },
                    { title: "Logs", key: "log" },
                    {
                        title: "Time",
                        key: "time",
                        render: (time) =>
                            time
                                ? new Date(time).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })
                                : "-",
                    },
                    { title: "Status", key: "status" }
                ]}
                data={paginatedLogs}
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