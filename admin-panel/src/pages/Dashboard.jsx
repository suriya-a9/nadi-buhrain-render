import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
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
                <div className="p-6 bg-white rounded shadow">
                    <h3 className="font-semibold text-lg">Total Technicians</h3>
                    <p className="text-5xl mt-3 font-bold">{counts.technicianCounts}</p>
                </div>
                <div className="p-6 bg-white rounded shadow">
                    <h3 className="font-semibold text-lg">Total Verified Users</h3>
                    <p className="text-5xl mt-3 font-bold">{counts.userAccountCounts}</p>
                </div>
                <div className="p-6 bg-white rounded shadow">
                    <h3 className="font-semibold text-lg">Total Service Requests</h3>
                    <p className="text-5xl mt-3 font-bold">{counts.userServiceCounts}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Recent Service Requests</h3>
                    <button
                        className="bg-brandGreen text-white px-4 py-2 rounded hover:bg-green-700 transition"
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