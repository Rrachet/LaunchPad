import { useEffect, useState } from "react";

import KpiCard from "../components/KpiCard";
import RevenueChart from "../components/RevenueChart";
import ActivityFeed from "../components/ActivityFeed";
import ProjectTable from "../components/ProjectTable";
import CreateProject from "../components/CreateProject";

import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const activeProjects = projects.filter((p) => p.status === "Active").length;

  return (
    <>
      <div className="kpi-grid">
<KpiCard
          title="Monthly Revenue"
          value="$124,500"
          icon={{ name: "finance", className: "revenue" }}
          trend="12.5%"
        />
        <KpiCard
          title="Active Projects"
          value={activeProjects}
          icon={{ name: "folder", className: "projects" }}
          trend="+2 this month"
        />
        <KpiCard
          title="Employees"
          value="168"
          icon={{ name: "users", className: "employees" }}
          trend="+8 hired"
        />
        <KpiCard
          title="Pending Tasks"
          value="27"
          icon={{ name: "tasks", className: "tasks" }}
          trend="3 overdue"
          trendDown
        />
      </div>

      <CreateProject refreshProjects={fetchProjects} />

      <RevenueChart />

      <div className="bottom-grid">
        <ProjectTable projects={projects} refreshProjects={fetchProjects} />
        <ActivityFeed />
      </div>
    </>
  );
}

export default Dashboard;
