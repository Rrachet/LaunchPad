import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import Icon from "./Icon";

export const MENU_ITEMS = [
  { label: "Overview", path: "/dashboard", icon: "grid", end: true },
  { label: "Projects", path: "/dashboard/projects", icon: "folder" },
  { label: "Teams", path: "/dashboard/teams", icon: "users" },
  { label: "Analytics", path: "/dashboard/analytics", icon: "chart" },
  { label: "Finance", path: "/dashboard/finance", icon: "finance" },
  { label: "Reports", path: "/dashboard/reports", icon: "report" },
  { label: "Tasks", path: "/dashboard/tasks", icon: "tasks" },
  { label: "Settings", path: "/dashboard/settings", icon: "settings" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data?.user || null);
      } catch {
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
try {
      await API.post("/auth/logout");
    } catch {
      // ignore — still clear local session
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const isActive = (item) =>
    item.end
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">L</div>
        <span className="brand-name">LaunchPad</span>
      </div>

      <div className="sidebar-label">Main Menu</div>
      <div className="menu">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`menu-item ${isActive(item) ? "active" : ""}`}
          >
<span className="menu-icon">
              <Icon name={item.icon} />
            </span>
            {item.label}
          </Link>
        ))}

        {user?.role === "admin" && (
          <>
            <div className="sidebar-label">Admin</div>
            <Link
              to="/admin"
              className={`menu-item ${location.pathname.startsWith("/admin") ? "active" : ""}`}
            >
              <span className="menu-icon">
                <Icon name="shield" />
              </span>
              Admin Panel
            </Link>
          </>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="name">{user?.name || "Guest"}</div>
            <div className="email">{user?.email || ""}</div>
          </div>
          <button
            className="password-toggle"
            onClick={handleLogout}
            title="Logout"
            style={{ marginLeft: "auto" }}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
