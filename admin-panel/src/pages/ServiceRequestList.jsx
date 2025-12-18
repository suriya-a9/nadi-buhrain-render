import { useEffect, useState } from "react";
import Table from "../components/Table";
import api from "../services/api";
import Pagination from "../components/Pagination";
const getLastUpdatedStatus = (statusTimestamps = {}) => {
    const entries = Object.entries(statusTimestamps)
        .filter(([, value]) => value)
        .sort((a, b) => new Date(a[1]) - new Date(b[1]));
    return entries.length ? entries[entries.length - 1][0] : "-";
};

export default function ServiceRequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [technicians, setTechnicians] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [techWorkStatus, setTechWorkStatus] = useState(null);
    const [techWorkStatusLoading, setTechWorkStatusLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const acceptedRequests = requests.filter(r => r.technicianAccepted === true);
    const rejectedRequests = requests.filter(r => r.technicianAccepted === false && r.technicianId);
    const notAssignedRequests = requests.filter(r => !r.technicianId);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);
    let tabData = acceptedRequests;
    if (activeTab === 1) tabData = rejectedRequests;
    if (activeTab === 2) tabData = notAssignedRequests;
    const totalPages = Math.ceil(tabData.length / ITEMS_PER_PAGE);
    const paginatedData = tabData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const API_BASE = (import.meta.env.VITE_API_URL).replace(/\/$/, "");
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
    useEffect(() => {
        if (detailsOpen && selected && !selected.technicianId) {
            api.post("/technician/list")
                .then(res => setTechnicians(res.data.data || []))
                .catch(() => setTechnicians([]));
        }
    }, [detailsOpen, selected]);
    const handleView = (row) => {
        setSelected(row);
        setDetailsOpen(true);
        setSelectedTechnician("");
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
    const handleAssignTechnician = async () => {
        if (!selectedTechnician) return;
        setAssigning(true);
        try {
            await api.post("/user-service-list/assign-technician", {
                serviceId: selected._id,
                technicianId: selectedTechnician
            });
            await loadRequests();
            setDetailsOpen(false);
        } catch (err) {
            alert("Failed to assign technician");
        } finally {
            setAssigning(false);
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
    const StatusDropdown = ({ statusTimestamps = {} }) => {
        const lastStatus = getLastUpdatedStatus(statusTimestamps);

        return (
            <select
                className="border rounded px-2 py-1 text-sm bg-gray-100 cursor-pointer"
                value={lastStatus}
                onChange={() => { }}
            >
                {Object.entries(statusTimestamps).map(([status, time]) => (
                    <option key={status} value={status}>
                        {status} {time ? `(${time})` : ""}
                    </option>
                ))}
            </select>
        );
    };
    useEffect(() => {
        if (detailsOpen && selected?.technicianAccepted && selected?._id) {
            setTechWorkStatusLoading(true);
            setTechWorkStatus(null);
            api.get(`/user-service-list/technician-work-status/${selected._id}`)
                .then(res => setTechWorkStatus(res.data))
                .catch(() => setTechWorkStatus(null))
                .finally(() => setTechWorkStatusLoading(false));
        }
    }, [detailsOpen, selected]);
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Service Requests List</h2>
            </div>
            <div className="mb-4 flex gap-2">
                <button
                    className={`px-4 py-2 rounded ${activeTab === 0 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab(0)}
                >
                    Technician Accepted
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab(1)}
                >
                    Technician Pending / Rejected
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab(2)}
                >
                    Technician Not Assigned
                </button>
            </div>

            <Table
                columns={[
                    { title: "Request ID", key: "serviceRequestID" },
                    { title: "Requested By", key: "userId.basicInfo.fullName" },
                    { title: "Service Name", key: "serviceId.name" },
                    { title: "Issue Name", key: "issuesId.issue" },
                    {
                        title: "Is Urgent?",
                        dataIndex: "immediateAssistance",
                        key: "immediateAssistance",
                        render: (value) => (value ? "Yes" : "No"),
                    },
                    {
                        title: "Status",
                        key: "statusTimestamps",
                        render: (_, row) => (
                            <StatusDropdown statusTimestamps={row.statusTimestamps} />
                        ),
                    },
                ]}
                data={paginatedData}
                actions={(row) => (
                    <button
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                        onClick={() => handleView(row)}
                    >
                        View
                    </button>
                )}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            {!loading && paginatedData.length === 0 && (
                <div className="text-center text-gray-500 mt-4">No requests in this category.</div>
            )}
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
                                <div>
                                    <div className="font-medium">Assigned Technician</div>
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {selected.technicianId
                                            ? (selected.technicianId.firstName
                                                ? `${selected.technicianId.firstName} ${selected.technicianId.lastName || ""} (${selected.technicianId.email || ""})`
                                                : selected.technicianId)
                                            : "Not Assigned"}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">Technician Assignment Status</div>
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {selected.technicianAccepted === true
                                            ? "Accepted"
                                            : selected.technicianId
                                                ? "Pending"
                                                : "-"}
                                    </div>
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

                            {!selected.technicianId && (
                                <div className="mb-4">
                                    <div className="font-medium mb-2">Assign Technician</div>
                                    <div className="flex gap-2 items-center">
                                        <select
                                            className="border rounded px-2 py-1"
                                            value={selectedTechnician}
                                            onChange={e => setSelectedTechnician(e.target.value)}
                                        >
                                            <option value="">Select Technician</option>
                                            {technicians.map(tech => (
                                                <option key={tech._id} value={tech._id}>
                                                    {tech.firstName} {tech.lastName} ({tech.email})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="px-3 py-1 bg-blue-600 text-white rounded"
                                            disabled={!selectedTechnician || assigning}
                                            onClick={handleAssignTechnician}
                                        >
                                            {assigning ? "Assigning..." : "Assign"}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {selected.technicianAccepted === true && (
                                <div className="mb-4">
                                    <div className="font-medium">Technician Work Status</div>
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {techWorkStatusLoading
                                            ? "Loading..."
                                            : techWorkStatus
                                                ? <>
                                                    <div>
                                                        <span className="capitalize font-semibold">{techWorkStatus.status}</span>
                                                        {techWorkStatus.notes && (
                                                            <div className="text-xs text-gray-500 mt-1">Notes: {techWorkStatus.notes}</div>
                                                        )}
                                                    </div>
                                                    {techWorkStatus.media && techWorkStatus.media.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="font-medium">Technician Media</div>
                                                            <ul className="list-disc ml-4">
                                                                {techWorkStatus.media.map((file, idx) => (
                                                                    <li key={idx}>
                                                                        <a
                                                                            href={`${API_BASE}/uploads/${file}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 underline"
                                                                        >
                                                                            {file}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {techWorkStatus.usedParts && techWorkStatus.usedParts.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="font-medium">Used Parts</div>
                                                            <ul className="list-disc ml-4">
                                                                {techWorkStatus.usedParts.map((part, idx) => (
                                                                    <li key={idx}>
                                                                        {part.productName} x{part.count} (₹{part.price} each, Total: ₹{part.total})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {techWorkStatus.workStartedAt && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            Work Started At: {new Date(techWorkStatus.workStartedAt).toLocaleString()}
                                                        </div>
                                                    )}
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Work Duration: {techWorkStatus.workDuration ? `${Math.floor(techWorkStatus.workDuration / 60)} min` : "N/A"}
                                                    </div>
                                                </>
                                                : "Not available"}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}