import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Pagination from "../components/Pagination";

export default function NotVerifiedUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [users]);
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/account-verify/list");
            setUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (id) => {
        try {
            const res = await api.post(`/account-verify/view`, { id });
            setSelectedUser(res.data.data);
            setDetailsOpen(true);
        } catch (err) {
            console.error(err);
            alert("Failed to load details");
        }
    };

    const updateStatus = async (id, status, reason) => {
        try {
            const payload = { userId: id, status };
            if (status === "rejected" && reason) payload.reason = reason;
            await api.post("/account-verify", payload);
            await loadUsers();
            setDetailsOpen(false);
            alert(`User ${status}`);
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const getUserDoc = (selected) => {
        if (!selected) return null;
        return selected.user || selected;
    };
    const API_BASE = (import.meta.env.VITE_API_URL).replace(/\/$/, "");
    const renderIdProofs = (files = []) => {
        if (!files || !files.length) return <div className="text-gray-700">No ID proofs</div>;
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((f, i) => {
                    const url = `${API_BASE}/uploads/${f}`;
                    const ext = f.split('.').pop().toLowerCase();
                    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
                    return (
                        <div key={i} className="p-2 border rounded bg-gray-50">
                            {isImage && (
                                <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={url} alt={`id-proof-${i}`} className="max-h-40 w-auto rounded" />

                                    <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
                                        view
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Unverified Users</h2>

            <Table
                columns={[
                    { title: "Full Name", key: "basicInfo.fullName" },
                    { title: "Mobile", key: "basicInfo.mobileNumber" },
                    { title: "Email", key: "basicInfo.email" },
                    { title: "Account Type", key: "accountTypeId.name" },
                    { title: "Status", key: "accountVerification" },
                    { title: "Rejection Reason", key: "reason" },
                ]}
                data={paginatedUsers}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => viewDetails(row._id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                            View
                        </button>
                        <button
                            onClick={() => updateStatus(row._id, "verified")}
                            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                        >
                            Verify
                        </button>
                        <button
                            onClick={() => {
                                setSelectedUser({ user: row, type: 'user' });
                                setDetailsOpen(true);
                                setRejecting(true);
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        >
                            Reject
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
            {loading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}

            {detailsOpen && selectedUser && (() => {
                const isUser = selectedUser.type === 'user';
                const user = getUserDoc(selectedUser);
                if (!user) return null;

                const familyMembers = isUser ? (selectedUser.familyMembers || []) : [];
                const owner = user.familyOwnerId && typeof user.familyOwnerId === "object"
                    ? user.familyOwnerId
                    : null;
                const ownerId = owner ? owner._id : (user.familyOwnerId || null);
                return (
                    <div className="fixed inset-0 z-50 overflow-auto">
                        <div className="min-h-screen flex items-start justify-center py-8 px-4">
                            <div
                                className="absolute inset-0 bg-black opacity-40"
                                onClick={() => setDetailsOpen(false)}
                            />
                            <div className="relative bg-white text-black p-6 rounded shadow-lg max-w-3xl w-full z-10 max-h-[90vh] overflow-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Details</h3>
                                    <button
                                        onClick={() => setDetailsOpen(false)}
                                        className="text-sm text-gray-500"
                                    >
                                        Close
                                    </button>
                                </div>
                                {user.isFamilyMember && (
                                    <div className="mb-4 p-3 border rounded bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-gray-500">Belongs to</div>
                                                <div className="text-sm font-medium text-gray-800">
                                                    {owner ? owner.basicInfo?.fullName : `Owner ID: ${ownerId}`}
                                                </div>
                                                <div className="text-sm text-gray-600">{owner ? owner.basicInfo?.email : null}</div>
                                                <div className="text-sm text-gray-600">{owner ? owner.basicInfo?.mobileNumber : null}</div>
                                            </div>

                                            {ownerId && (
                                                <div className="flex items-center gap-2">
                                                    {/* {owner && owner.idProofUrl && owner.idProofUrl.length > 0 && (
                                                        <button
                                                            onClick={() => {
                                                                const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
                                                                const url = `${API_BASE}/uploads/${owner.idProofUrl[0]}`;
                                                                window.open(url, "_blank");
                                                            }}
                                                            className="px-2 py-1 text-sm bg-gray-200 rounded"
                                                        >
                                                            View Owner ID
                                                        </button>
                                                    )} */}

                                                    <button
                                                        onClick={() => {
                                                            if (ownerId) viewDetails(ownerId);
                                                        }}
                                                        className="px-2 py-1 text-sm bg-gray-200 rounded"
                                                    >
                                                        View Owner
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {owner && owner.idProofUrl && owner.idProofUrl.length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-xs text-gray-500 mb-2">Owner ID Proofs</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {owner.idProofUrl.map((f, i) => {
                                                        const API_BASE = (import.meta.env.VITE_API_URL).replace(/\/$/, "");
                                                        const url = `${API_BASE}/uploads/${f}`;
                                                        const ext = f.split('.').pop().toLowerCase();
                                                        const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
                                                        return (
                                                            <div key={i} className="p-2 border rounded bg-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {isImage && <img src={url} alt={f} className="mt-2 max-h-28 rounded" />}
                                                                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all text-sm">
                                                                    view
                                                                </a>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                    <div>
                                        <div className="font-medium">ID</div>
                                        <div className="text-gray-700 break-all">{user._id}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Account Type</div>
                                        <div className="text-gray-700">
                                            {user.accountTypeId?.name || "—"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Full Name</div>
                                        <div className="text-gray-700">
                                            {user.basicInfo?.fullName || "—"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Email</div>
                                        <div className="text-gray-700">{user.basicInfo?.email || "—"}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Mobile</div>
                                        <div className="text-gray-700">{user.basicInfo?.mobileNumber || "—"}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Gender</div>
                                        <div className="text-gray-700">{user.basicInfo?.gender || "—"}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Signup Completed</div>
                                        <div className="text-gray-700">{user.singnUpCompleted ? "Yes" : "No"}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Verification</div>
                                        <div className="text-gray-700">{user.accountVerification || "—"}</div>
                                    </div>
                                </div>

                                {isUser && selectedUser.addresses && selectedUser.addresses.length > 0 && (
                                    <>
                                        <div className="font-medium mb-2">Addresses</div>
                                        <div className="grid gap-3 mb-4">
                                            {selectedUser.addresses.map((a) => {
                                                const roadName = a.roadId && typeof a.roadId === "object" ? a.roadId.name : a.roadId;
                                                const blockName = a.blockId && typeof a.blockId === "object" ? a.blockId.name : a.blockId;
                                                return (
                                                    <div key={a._id} className="p-3 border rounded text-sm bg-gray-50 dark:bg-gray-700">
                                                        <div className="text-gray-700">Road: {roadName || '—'}</div>
                                                        <div className="text-gray-700">Block: {blockName || '—'}</div>
                                                        <div className="text-gray-700">City: {a.city || '—'}</div>
                                                        <div className="text-gray-700">Building: {a.building || '—'}</div>
                                                        <div className="text-gray-700">Floor: {a.floor || '—'}</div>
                                                        <div className="text-gray-700">Apt No: {a.aptNo ?? '—'}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                                <div className="mb-4">
                                    <div className="font-medium mb-2">ID Proofs</div>
                                    {isUser ? renderIdProofs(user.idProofUrl) : <div className="text-gray-700">No ID proofs</div>}
                                </div>
                                <div className="mb-4">
                                    <div className="font-medium mb-2">Family Members</div>
                                    {familyMembers.length === 0 ? (
                                        <div className="text-gray-700 text-sm">No family members</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {familyMembers.map((fm) => (
                                                <div key={fm._id} className="p-3 border rounded bg-gray-50">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Name</div>
                                                            <div className="text-gray-800 dark:text-gray-200">{fm.fullName}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Relation</div>
                                                            <div className="text-gray-800 dark:text-gray-200">{fm.relation}</div>
                                                        </div>

                                                        <div>
                                                            <div className="text-xs text-gray-500">Email</div>
                                                            <div className="text-gray-800 dark:text-gray-200">{fm.email}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Mobile</div>
                                                            <div className="text-gray-800 dark:text-gray-200">{fm.mobile}</div>
                                                        </div>

                                                        <div className="col-span-2">
                                                            <div className="text-xs text-gray-500">Address</div>
                                                            {fm.address ? (
                                                                <div className="text-gray-800 dark:text-gray-200 text-sm">
                                                                    {fm.address.city ? `${fm.address.city}, ` : ''}
                                                                    {fm.address.building ? `${fm.address.building}, ` : ''}
                                                                    {fm.address.street ? `${fm.address.street}, ` : ''}
                                                                    Apt: {fm.address.aptNo ?? '—'} Floor: {fm.address.floor ?? '—'}
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-700">No address</div>
                                                            )}
                                                        </div>
                                                        <div className="col-span-2 mt-2">
                                                            <div className="text-xs text-gray-500">Family Member ID Proofs</div>
                                                            {fm.addressId || fm.idProofUrl ? (
                                                                fm.idProofUrl ? renderIdProofs(fm.idProofUrl) : <div className="text-gray-700">No ID proofs</div>
                                                            ) : (
                                                                <div className="text-gray-700">No ID proofs</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => updateStatus(user._id, "verified")}
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                        disabled={rejecting}
                                    >
                                        Verify
                                    </button>
                                    <button
                                        disabled={rejecting || user.accountVerification === "rejected"}
                                        className={`px-3 py-1 rounded ${user.accountVerification === "rejected"
                                            ? "bg-gray-400 text-white"
                                            : "bg-red-500 text-white"
                                            }`}
                                        onClick={() => setRejecting(true)}
                                    >
                                        Reject
                                    </button>
                                </div>
                                {rejecting && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium mb-1">Rejection Reason</label>
                                        <input
                                            type="text"
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            className="border rounded px-2 py-1 w-full mb-2"
                                            placeholder="Enter reason"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                                disabled={!reason}
                                                onClick={async () => {
                                                    await updateStatus(user._id, "rejected", reason);
                                                    setRejecting(false);
                                                    setReason("");
                                                }}
                                            >
                                                Confirm Reject
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-gray-300 text-black rounded"
                                                onClick={() => {
                                                    setRejecting(false);
                                                    setReason("");
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {user.accountVerification === "rejected" && user.reason && (
                                    <div className="mt-2">
                                        <div className="font-medium">Rejection Reason</div>
                                        <div className="text-red-600">{user.reason}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}