import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFileImage, FaUsers } from "react-icons/fa";
import { VscGitPullRequestGoToChanges, VscRequestChanges } from "react-icons/vsc";
import { MdMiscellaneousServices, MdVerifiedUser } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { SlBadge } from "react-icons/sl";

export default function Sidebar({ isOpen, toggleSidebar }) {
    const linkClasses = ({ isActive }) =>
        `flex items-center p-3 rounded-lg transition font-medium
        ${isActive
            ? "bg-brandGreen text-white shadow-md"
            : "text-gray-700 hover:bg-gray-200"
        }`;

    const sectionTitle = "text-xs font-semibold text-gray-500 uppercase px-3 mt-6 mb-2";

    return (
        <>
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 h-full bg-white shadow-lg z-40 w-64 
                    transform transition-transform duration-300 overflow-y-scroll
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-textGreen">Nadi Buhrain</h2>
                </div>

                <nav className="p-4">

                    <div className={sectionTitle}>General</div>
                    <NavLink to="/" className={linkClasses}>
                        <TbLayoutDashboard size={20} /> &nbsp;&nbsp;&nbsp;Dashboard
                    </NavLink>
                    <NavLink to="/splash-screen" className={linkClasses}>
                        <BsThreeDotsVertical size={20} /> &nbsp;&nbsp;&nbsp;Splash screen
                    </NavLink>
                    <NavLink to="/about-screen" className={linkClasses}>
                        <FaRegFileImage size={20} /> &nbsp;&nbsp;&nbsp;About screen
                    </NavLink>

                    <div className={sectionTitle}>Requests</div>
                    <NavLink to="/service-requests" className={linkClasses}>
                        <VscGitPullRequestGoToChanges size={20} /> &nbsp;&nbsp;&nbsp;Service Requests List
                    </NavLink>
                    <NavLink to="/new-requests" className={linkClasses}>
                        <VscRequestChanges size={20} /> &nbsp;&nbsp;&nbsp;New Requests
                    </NavLink>

                    <div className={sectionTitle}>Services</div>
                    <NavLink to="/services" className={linkClasses}>
                        <MdMiscellaneousServices size={20} /> &nbsp;&nbsp;&nbsp;Service List
                    </NavLink>

                    <div className={sectionTitle}>Users</div>
                    <NavLink to="/users" className={linkClasses}>
                        <MdVerifiedUser size={20} /> &nbsp;&nbsp;&nbsp;Verified Users
                    </NavLink>

                    <NavLink to="/not-verified" className={linkClasses}>
                        <CgUnavailable size={20} /> &nbsp;&nbsp;&nbsp;Not Verified Users
                    </NavLink>

                    <div className={sectionTitle}>Technicians</div>
                    <NavLink to="/technicians" className={linkClasses}>
                        <FaUsers size={20} /> &nbsp;&nbsp;&nbsp;Technicians List
                    </NavLink>

                    <div className={sectionTitle}>Points</div>
                    <NavLink to="/points" className={linkClasses}>
                       <SlBadge size={20} /> &nbsp;&nbsp;&nbsp;Points List
                    </NavLink>
                </nav>
            </aside>
        </>
    );
}