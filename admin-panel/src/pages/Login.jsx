import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/admin/login", form);
            login(res.data.token);
            navigate("/");
        } catch {
            alert("Invalid login");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex flex-col justify-center w-full lg:w-1/2 p-10">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Sign In
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-brandGreen text-white rounded-lg hover:bg-brandGreen"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="text-center mt-5">
                        Don’t have an account?
                        <Link className="text-brandGreen ml-1" to="/register">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-brandGreen items-center justify-center">
                <img
                    src="/assets/logo.webp"
                    alt="logo"
                    className="w-3/4"
                />
            </div>
        </div>
    );
}