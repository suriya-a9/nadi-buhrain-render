import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/admin/forgot-password", form);
            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        }
    };
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex flex-col justify-center w-full lg:w-1/2 p-10">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Forgot Password
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">New Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-bgGreen text-white rounded-lg hover:bg-bgGreen"
                        >
                            Confirm
                        </button>
                    </form>
                    <p className="text-center mt-5">
                        <a className="text-bgGreen ml-1" href="/login">
                            Back to Login
                        </a>
                    </p>
                </div>
            </div>
            <div className="hidden lg:flex lg:w-1/2 bg-bgGreen items-center justify-center">
                <img
                    src="/assets/logo.webp"
                    alt="logo"
                    className="w-3/4"
                />
            </div>
        </div>
    );
}