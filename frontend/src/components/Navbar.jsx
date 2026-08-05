import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import Icon from "./Icon";
import { MENU_ITEMS } from "./Sidebar";

function Navbar() {
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
    } catch (e) {
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

  const current = MENU_ITEMS.find(
    (item) =>
      (item.end && location.pathname === item.path) ||
      (!item.end && location.pathname.startsWith(item.path))
  );

  const title = location.pathname.startsWith("/admin")
    ? "Admin Panel"
    : current?.label || "Dashboard";

  return (
    <div className="navbar">
      <div>
        <h1>{title}</h1>
<div className="nav-sub">
          Welcome back, <b>{user?.name || "there"}</b>
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="name">{user.name}</div>
              <div className="email">{user.email}</div>
            </div>
          </div>
        )}
<button className="btn-danger" onClick={handleLogout}>
          <Icon name="logout" size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
