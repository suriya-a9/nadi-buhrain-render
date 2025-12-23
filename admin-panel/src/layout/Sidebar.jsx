import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TbLayoutDashboard, TbLogs } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFileImage, FaUsers } from "react-icons/fa";
import { LuFileTerminal } from "react-icons/lu";
import { VscGitPullRequestGoToChanges, VscRequestChanges } from "react-icons/vsc";
import { MdMiscellaneousServices, MdVerifiedUser, MdOutlineProductionQuantityLimits, MdOutlineAccountBox } from "react-icons/md";
import { PiBuildingApartment } from "react-icons/pi";
import { BiCartAdd } from "react-icons/bi";
import { CgUnavailable } from "react-icons/cg";
import { FaWarehouse, FaClipboardUser } from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import { GiRoad } from "react-icons/gi";

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { role } = useAuth();
    const linkClasses = ({ isActive }) =>
        `flex items-center p-3 rounded-lg transition font-medium
        ${isActive
            ? "bg-brandGreen text-textGreen shadow-md"
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
                    fixed left-0 top-0 h-full bg-gray-100 shadow-lg z-40 w-64 
                    transform transition-transform duration-300 overflow-y-scroll
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-textGreen">Nadi Buhrain</h2>
                </div>

                <nav className="p-4">

                    <div className={sectionTitle}>General</div>
                    <NavLink to="/" className={linkClasses}>
                        <TbLayoutDashboard size={20} /> &nbsp;&nbsp;&nbsp;Dashboard
                    </NavLink>
                    {/* <NavLink to="/account-type" className={linkClasses}>
                        <MdOutlineAccountBox size={20} /> &nbsp;&nbsp;&nbsp;Account Type
                    </NavLink> */}
                    {(role === "admin" || role === "service manager") && (
                        <>
                            <div className={sectionTitle}>Users</div>
                            <NavLink to="/admin-list" className={linkClasses}>
                                <VscGitPullRequestGoToChanges size={20} /> &nbsp;&nbsp;&nbsp;Admin Users
                            </NavLink>
                        </>
                    )}

                    {(role === "admin" || role === "service manager") && (
                        <>
                            <div className={sectionTitle}>Requests</div>
                            <NavLink to="/service-requests" className={linkClasses}>
                                <VscGitPullRequestGoToChanges size={20} /> &nbsp;&nbsp;&nbsp;Service Requests List
                            </NavLink>
                            <NavLink to="/new-requests" className={linkClasses}>
                                <VscRequestChanges size={20} /> &nbsp;&nbsp;&nbsp;New Requests
                            </NavLink>
                        </>
                    )}

                    {(role === "admin") && (
                        <>
                            <div className={sectionTitle}>Services</div>
                            <NavLink to="/services" className={linkClasses}>
                                <MdMiscellaneousServices size={20} /> &nbsp;&nbsp;&nbsp;Service List
                            </NavLink>
                            {/* <NavLink to="/issues" className={linkClasses}>
                                <MdMiscellaneousServices size={20} /> &nbsp;&nbsp;&nbsp;Issues
                            </NavLink> */}

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
                            {/* <NavLink to="/technician-skill" className={linkClasses}>
                                <FaClipboardUser size={20} /> &nbsp;&nbsp;&nbsp;Technicians Skill List
                            </NavLink> */}

                            <div className={sectionTitle}>Address</div>
                            <NavLink to="/road" className={linkClasses}>
                                <GiRoad size={20} /> &nbsp;&nbsp;&nbsp;Road Type
                            </NavLink>
                            <NavLink to="/block" className={linkClasses}>
                                <PiBuildingApartment size={20} /> &nbsp;&nbsp;&nbsp;Block Type
                            </NavLink>

                            <div className={sectionTitle}>Points</div>
                            <NavLink to="/points" className={linkClasses}>
                                <SlBadge size={20} /> &nbsp;&nbsp;&nbsp;Points List
                            </NavLink>

                            {/* <div className={sectionTitle}>Inventory</div>
                            <NavLink to="/inventory" className={linkClasses}>
                                <FaWarehouse size={20} /> &nbsp;&nbsp;&nbsp;Inventory List
                            </NavLink>
                            <NavLink to="/material-requests" className={linkClasses}>
                                <MdOutlineProductionQuantityLimits size={20} /> &nbsp;&nbsp;&nbsp;Material Requests
                            </NavLink>
                            <NavLink to="/spare-parts" className={linkClasses}>
                                <BiCartAdd size={20} /> &nbsp;&nbsp;&nbsp;Spare Parts
                            </NavLink> */}

                            <div className={sectionTitle}>Settings</div>
                            <NavLink to="/splash-screen" className={linkClasses}>
                                <BsThreeDotsVertical size={20} /> &nbsp;&nbsp;&nbsp;Splash screen
                            </NavLink>
                            <NavLink to="/about-screen" className={linkClasses}>
                                <FaRegFileImage size={20} /> &nbsp;&nbsp;&nbsp;About screen
                            </NavLink>
                            {/* <NavLink to="/terms-condition" className={linkClasses}>
                                <LuFileTerminal size={20} /> &nbsp;&nbsp;&nbsp;Terms and Condition
                            </NavLink> */}
                        </>
                    )}

                    {/* <div className={sectionTitle}>Logs</div>
                    <NavLink to="/user-logs" className={linkClasses}>
                        <TbLogs size={20} /> &nbsp;&nbsp;&nbsp;User Activity
                    </NavLink> */}
                </nav>
            </aside>
        </>
    );
}