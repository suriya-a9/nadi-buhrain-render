import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { FaUserGear } from "react-icons/fa6";
import { LuUserCheck, LuUserCog  } from "react-icons/lu";
import { VscTools } from "react-icons/vsc";
import api from "../services/api";

export default function Dashboard() {
    const [counts, setCounts] = useState({
        technicianCounts: 0,
        userAccountCounts: 0,
        userServiceCounts: 0
    });
    const [loading, setLoading] = useState(false);
    const [serviceRequests, setServiceRequests] = useState([]);

    const navigate = useNavigate();

    const loadCounts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/dashboard/counts");
            setCounts(res.data || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadServiceRequests = async () => {
        try {
            const res = await api.get("/user-service-list/accpeted-requests");
            if (res.data?.data) {
                setServiceRequests(res.data.data.slice(0, 5));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCounts();
        loadServiceRequests();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold mb-4">Welcome Back 👋</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-200 rounded-lg shadow">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-semibold text-sm">Total Technicians</h3>
                            <p className="text-3xl font-bold">{counts.technicianCounts}</p>
                        </div>
                        <LuUserCog size={40} />
                    </div>
                </div>
                <div className="p-4 bg-gray-200 rounded-lg shadow">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-semibold text-sm">Total Verified Users</h3>
                            <p className="text-3xl font-bold">{counts.userAccountCounts}</p>
                        </div>
                        <LuUserCheck size={40} />
                    </div>
                </div>
                <div className="p-4 bg-gray-200 rounded-lg shadow">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-semibold text-sm">Total Service Requests</h3>
                            <p className="text-3xl font-bold">{counts.userServiceCounts}</p>
                        </div>
                        <VscTools size={40} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Recent Service Requests</h3>
                    <button
                        className="bg-bgGreen text-white px-4 py-2 rounded transition"
                        onClick={() => navigate("/service-requests")}
                    >
                        View All
                    </button>
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
                    data={serviceRequests}
                />
            </div>
        </div>
    );
}