import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 lg:ml-64">
                <Header toggleSidebar={toggleSidebar} />

                <main className="p-4">{children}</main>
            </div>
        </div>
    );
}