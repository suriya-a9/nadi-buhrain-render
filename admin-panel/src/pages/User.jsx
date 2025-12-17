import { useEffect, useState } from "react";
import api from "../services/api";
import Table from "../components/Table";

export default function User() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const API_BASE = (import.meta.env.VITE_API_URL).replace(/\/$/, "");

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/account-verify/all-user-list");
            setUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (id) => {
        try {
            const res = await api.post("/account-verify/view", { id });
            setSelectedUser(res.data.data);
            setDetailsOpen(true);
        } catch (err) {
            console.error(err);
            alert("Failed to load details");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const renderIdProofs = (files = []) => {
        if (!files || !files.length) return <div className="text-gray-700">No ID proofs</div>;
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((f, i) => {
                    const url = `${API_BASE}/uploads/${f}`;
                    const ext = f.split('.').pop().toLowerCase();
                    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
                    return (
                        <div key={i} className="p-2 border rounded bg-gray-50" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {isImage && <div className="mt-2"><img src={url} alt={f} className="max-h-40 w-auto rounded" /></div>}
                            <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
                                view
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getUserDoc = (selected) => {
        if (!selected) return null;
        return selected.user || selected;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Users</h2>
            </div>

            <Table
                columns={[
                    { title: "Full Name", key: "basicInfo.fullName" },
                    { title: "Mobile", key: "basicInfo.mobileNumber" },
                    { title: "Email", key: "basicInfo.email" },
                    { title: "Account Type", key: "accountTypeId.name" },
                    { title: "Status", key: "accountVerification" }
                ]}
                data={users}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => viewDetails(row._id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                            View
                        </button>
                    </div>
                )}
            />

            {loading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}

            {detailsOpen && selectedUser && (() => {
                const isUser = selectedUser.type === 'user';
                const user = getUserDoc(selectedUser);
                if (!user) return null;
                const familyMembers = isUser ? (selectedUser.familyMembers || []) : [];

                const owner = user.familyOwnerId && typeof user.familyOwnerId === "object" ? user.familyOwnerId : null;
                const ownerId = owner ? owner._id : (user.familyOwnerId || null);

                return (
                    <div className="fixed inset-0 z-50 overflow-auto">
                        <div className="min-h-screen flex items-start justify-center py-8 px-4">
                            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setDetailsOpen(false)} />
                            <div className="relative bg-white text-black p-6 rounded shadow-lg max-w-4xl w-full z-10 max-h-[90vh] overflow-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">User Details</h3>
                                    <button onClick={() => setDetailsOpen(false)} className="text-sm text-gray-500">Close</button>
                                </div>

                                {user.isFamilyMember && (
                                    <div className="mb-4 p-3 border rounded bg-gray-50">
                                        <div className="text-xs text-gray-500">Belongs to</div>
                                        <div className="text-sm font-medium">{owner ? owner.basicInfo?.fullName : `Owner ID: ${ownerId}`}</div>
                                        <div className="text-sm text-gray-600">{owner ? owner.basicInfo?.email : null}</div>
                                        <div className="text-sm text-gray-600">{owner ? owner.basicInfo?.mobileNumber : null}</div>

                                        {owner && owner.idProofUrl && owner.idProofUrl.length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-xs text-gray-500 mb-2">Owner ID Proofs</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {owner.idProofUrl.map((f, i) => {
                                                        const url = `${API_BASE}/uploads/${f}`;
                                                        const ext = f.split('.').pop().toLowerCase();
                                                        const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
                                                        return (
                                                            <div key={i} className="p-2 border rounded bg-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {isImage && <img src={url} alt={f} className="mt-2 max-h-28 rounded" />}
                                                                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all text-sm">view</a>
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
                                        <div className="text-gray-700">{user.accountTypeId?.name || "—"}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium">Full Name</div>
                                        <div className="text-gray-700">{user.basicInfo?.fullName || "—"}</div>
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

                                {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                                    <>
                                        <div className="font-medium mb-2">Addresses</div>
                                        <div className="grid gap-3 mb-4">
                                            {selectedUser.addresses.map((a) => {
                                                const roadName = a.roadId && typeof a.roadId === "object" ? a.roadId.name : a.roadId;
                                                const blockName = a.blockId && typeof a.blockId === "object" ? a.blockId.name : a.blockId;
                                                return (
                                                    <div key={a._id} className="p-3 border rounded text-sm bg-gray-50">
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
                                    {renderIdProofs(user.idProofUrl)}
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
                                                            <div className="text-gray-800">{fm.fullName}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Relation</div>
                                                            <div className="text-gray-800">{fm.relation}</div>
                                                        </div>

                                                        <div>
                                                            <div className="text-xs text-gray-500">Email</div>
                                                            <div className="text-gray-800">{fm.email}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Mobile</div>
                                                            <div className="text-gray-800">{fm.mobile}</div>
                                                        </div>

                                                        <div className="col-span-2">
                                                            <div className="text-xs text-gray-500">Address</div>
                                                            {fm.address ? (
                                                                <div className="text-gray-800 text-sm">
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
                                                            {fm.idProofUrl ? renderIdProofs(fm.idProofUrl) : <div className="text-gray-700">No ID proofs</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}