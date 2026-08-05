import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
