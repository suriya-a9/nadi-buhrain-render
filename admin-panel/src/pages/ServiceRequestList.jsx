import { useEffect, useState } from "react";
import Table from "../components/Table";
import api from "../services/api";

export default function ServiceRequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
    const loadRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/user-service-list/accpeted-requests');
            setRequests(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadRequests();
    }, []);
    const handleView = (row) => {
        setSelected(row);
        setDetailsOpen(true);
    };

    const handleStatusUpdate = async (id, newStatus, reason) => {
        setStatusUpdating(true);
        try {
            const payload = { id, serviceStatus: newStatus };
            if (newStatus === "rejected" && reason) payload.reason = reason;
            await api.post("/user-service-list/update-status", payload);
            await loadRequests();
            setDetailsOpen(false);
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const renderMedia = (mediaArr = []) => {
        if (!mediaArr.length) return <div className="text-gray-500">No media</div>;
        return (
            <div className="space-y-2">
                {mediaArr.map((file, idx) => {
                    const url = `${API_BASE}/uploads/${file}`;
                    const ext = file.split('.').pop().toLowerCase();
                    if (["mp4", "webm", "ogg"].includes(ext)) {
                        return (
                            <video key={idx} src={url} controls className="w-full max-h-48 rounded" />
                        );
                    }
                    if (["mp3", "wav", "aac"].includes(ext)) {
                        return (
                            <audio key={idx} src={url} controls className="w-full" />
                        );
                    }
                    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
                        return (
                            <img key={idx} src={url} alt={file} className="max-h-40 rounded" />
                        );
                    }
                    return (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
                            {file}
                        </a>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Service Requests List</h2>
            </div>
            <Table
                columns={[
                    { title: "Request ID", key: "serviceRequestID" },
                    { title: "Requested By", key: "userId.basicInfo.fullName" },
                    { title: "Service Name", key: "serviceId.name" },
                    { title: "Issue Name", key: "issuesId.issue" },
                    { title: "Feedback", key: "feedback" },
                    { title: "Scheduled Date", key: "scheduleService" },
                    {
                        title: "Is Urgent?",
                        dataIndex: "immediateAssistance",
                        key: "immediateAssistance",
                        render: (value) => (value ? "Yes" : "No"),
                    },
                ]}
                data={requests}
                actions={(row) => (
                    <button
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                        onClick={() => handleView(row)}
                    >
                        View
                    </button>
                )}
            />
            {loading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
            {detailsOpen && selected && (
                <div className="fixed inset-0 z-50 overflow-auto">
                    <div className="min-h-screen flex items-start justify-center py-8 px-4">
                        <div
                            className="absolute inset-0 bg-black opacity-40"
                            onClick={() => setDetailsOpen(false)}
                        />
                        <div className="relative bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-lg max-w-2xl w-full z-10 max-h-[90vh] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Service Request Details</h3>
                                <button
                                    onClick={() => setDetailsOpen(false)}
                                    className="text-sm text-gray-500"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div>
                                    <div className="font-medium">Request ID</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.serviceRequestID}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Requested By</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.userId?.basicInfo?.fullName}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Service Name</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.serviceId?.name}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Issue Name</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.issuesId?.issue}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Feedback</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.feedback}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Scheduled Date</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.scheduleService}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Is Urgent?</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.immediateAssistance ? "Yes" : "No"}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Status</div>
                                    <div className="text-gray-700 dark:text-gray-300">{selected.serviceStatus}</div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="font-medium mb-2">Media</div>
                                {renderMedia(selected.media)}
                            </div>

                            <div className="mb-4">
                                <div className="font-medium mb-2">Status Timeline</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selected.statusTimestamps || {}).map(([status, time]) => (
                                        <div key={status}>
                                            <span className="font-medium">{status}:</span>{" "}
                                            <span className="text-gray-700 dark:text-gray-300">{time || "-"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}