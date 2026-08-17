import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Icon from "../components/Icon";

const STATUS_OPTIONS = ["requested", "confirmed", "completed", "cancelled"];

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [createMsg, setCreateMsg] = useState("");
  const [createdToken, setCreatedToken] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [pwUserId, setPwUserId] = useState(null);
  const [pwNewPassword, setPwNewPassword] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const fetchData = async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const [usersRes, activityRes, bookingsRes] = await Promise.all([
        API.get("/admin/users"), API.get("/admin/activity"), API.get("/demo/bookings"),
      ]);
      setUsers(usersRes.data?.users || []);
      setActivity(activityRes.data?.activity || []);
      setBookings(bookingsRes.data?.bookings || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin data.");
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = useMemo(() => ({
    users: users.length,
    verified: users.filter((u) => u.emailVerified).length,
    pending: bookings.filter((b) => b.status === "requested").length,
    demos: bookings.length,
  }), [users, bookings]);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleString() : "—";

  const handleLogout = async () => {
    try { await API.post("/auth/logout"); } catch {}
    localStorage.removeItem("token"); navigate("/");
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setError(""); setCreateMsg(""); setCreatedToken("");
    if (!newName || !newEmail) return setError("Please fill in name and email.");
    setCreateLoading(true);
    try {
      const res = await API.post("/admin/users", { name: newName, email: newEmail });
      setCreateMsg(res.data?.message || "Client created."); setCreatedToken(res.data?.setupToken || "");
      setNewName(""); setNewEmail(""); setShowCreate(false); fetchData(true);
    } catch (err) { setError(err?.response?.data?.message || "Failed to create client."); }
    finally { setCreateLoading(false); }
  };

  const startEdit = (user) => { setEditingId(user.id); setEditName(user.name || ""); setEditEmail(user.email || ""); setError(""); };
  const cancelEdit = () => { setEditingId(null); setEditName(""); setEditEmail(""); };

  const handleUpdate = async (id) => {
    try { await API.put(`/admin/users/${id}`, { name: editName, email: editEmail }); cancelEdit(); fetchData(true); }
    catch (err) { setError(err?.response?.data?.message || "Failed to update user."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try { await API.delete(`/admin/users/${id}`); fetchData(true); }
    catch (err) { setError(err?.response?.data?.message || "Failed to delete client."); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwNewPassword || pwNewPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (pwNewPassword !== pwConfirm) return setError("Passwords do not match.");
    try {
      await API.put(`/admin/users/${pwUserId}/password`, { newPassword: pwNewPassword });
      setPwUserId(null); setPwNewPassword(""); setPwConfirm(""); setCreateMsg("Password updated successfully."); fetchData(true);
    } catch (err) { setError(err?.response?.data?.message || "Failed to change password."); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await API.patch(`/demo/bookings/${id}`, { status });
      setBookings((current) => current.map((b) => b.id === id ? { ...b, status } : b));
    } catch (err) { setError(err?.response?.data?.message || "Failed to update demo status."); }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand"><div className="brand-logo"><img src="/LP1.png" alt="LaunchPad logo" className="brand-logo-img" /></div><span className="brand-name">LaunchPad Admin</span></div>
        <div className="admin-header-right"><span className="admin-badge">ADMIN</span><button className="btn btn-outline" onClick={() => navigate("/dashboard")}><Icon name="arrowLeft" size={16} /> Dashboard</button><button className="btn-danger" onClick={handleLogout}><Icon name="logout" size={16} /> Logout</button></div>
      </header>
      <div className="admin-content">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:20,flexWrap:"wrap"}}><div><h1 className="admin-title">Command Center</h1><p className="admin-subtitle">Users, authentication activity and every incoming demo request in one place.</p></div><button className="btn btn-outline" style={{width:"auto"}} onClick={() => fetchData(true)} disabled={refreshing}>{refreshing ? "Refreshing…" : "Refresh data"}</button></div>
        {error && <div className="error-box">{error}</div>}{createMsg && <div className="info-box">{createMsg}</div>}
        {createdToken && <div className="dev-otp" style={{marginBottom:24}}><span>Setup link token:</span><strong style={{fontSize:13,wordBreak:"break-all"}}>{createdToken}</strong></div>}
        <div style={{display:"flex",gap:8,margin:"24px 0",flexWrap:"wrap"}}>{[["overview","Overview"],["demos","Demo Requests"],["users","Users"],["activity","Activity"]].map(([key,label]) => <button key={key} className={`btn ${activeTab === key ? "btn-primary" : "btn-outline"}`} style={{width:"auto"}} onClick={() => setActiveTab(key)}>{label}</button>)}</div>
        {loading ? <div className="loading-screen"><div className="spinner" /></div> : <>
          {activeTab === "overview" && <><section className="admin-section"><div className="admin-section-head"><h2>Overview</h2><span className="admin-subtitle">Live from PostgreSQL</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}><div className="admin-stat-card"><span>Total users</span><strong>{stats.users}</strong></div><div className="admin-stat-card"><span>Verified users</span><strong>{stats.verified}</strong></div><div className="admin-stat-card"><span>Demo requests</span><strong>{stats.demos}</strong></div><div className="admin-stat-card"><span>Needs attention</span><strong>{stats.pending}</strong></div></div></section><section className="admin-section"><div className="admin-section-head"><h2>Latest Demo Requests</h2><button className="btn btn-primary" style={{width:"auto"}} onClick={() => setActiveTab("demos")}>View all</button></div><DemoTable bookings={bookings.slice(0,5)} formatDate={formatDate} updateStatus={updateBookingStatus} /></section></>}
          {activeTab === "demos" && <section className="admin-section"><div className="admin-section-head"><div><h2>Demo Requests</h2><p className="admin-subtitle">Every booking submitted from the public Book a Demo form.</p></div></div><DemoTable bookings={bookings} formatDate={formatDate} updateStatus={updateBookingStatus} /></section>}
          {activeTab === "users" && <section className="admin-section"><div className="admin-section-head"><h2>Users & Signups</h2><button className="btn btn-primary" style={{width:"auto"}} onClick={() => setShowCreate((v) => !v)}>{showCreate ? "Cancel" : "Create Client"}</button></div>{showCreate && <form className="admin-create-form" onSubmit={handleCreate}><div className="field"><label>Full Name</label><input value={newName} onChange={(e)=>setNewName(e.target.value)} placeholder="Jane Doe" /></div><div className="field"><label>Email</label><input type="email" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} placeholder="client@example.com" /></div><button className="btn btn-primary" style={{width:"auto"}} disabled={createLoading}>{createLoading ? "Creating…" : "Create Client"}</button></form>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Email</th><th>Password</th><th>Created</th><th>Actions</th></tr></thead><tbody>{users.length === 0 ? <tr><td colSpan="7" className="empty-cell">No users yet.</td></tr> : users.map((u) => <tr key={u.id}><td>{editingId === u.id ? <input className="table-input" value={editName} onChange={(e)=>setEditName(e.target.value)} /> : u.name}</td><td>{editingId === u.id ? <input className="table-input" value={editEmail} onChange={(e)=>setEditEmail(e.target.value)} /> : u.email}</td><td><span className="badge badge-user">{u.role}</span></td><td>{u.emailVerified ? <span className="badge badge-ok">Verified</span> : <span className="badge badge-warn">Pending</span>}</td><td>{u.passwordVerified ? <span className="badge badge-ok">Set</span> : <span className="badge badge-warn">Not set</span>}</td><td>{formatDate(u.createdAt)}</td><td><div className="table-actions">{editingId === u.id ? <><button className="btn-icon btn-save" onClick={()=>handleUpdate(u.id)}><Icon name="check" size={14}/> Save</button><button className="btn-icon btn-delete" onClick={cancelEdit}><Icon name="close" size={14}/></button></> : <button className="btn-icon btn-edit" onClick={()=>startEdit(u)}><Icon name="edit" size={14}/> Edit</button>}<button className="btn-icon btn-edit" onClick={()=>setPwUserId(u.id)} title="Change password"><Icon name="key" size={14}/></button><button className="btn-icon btn-delete" onClick={()=>handleDelete(u.id)} title="Delete"><Icon name="trash" size={14}/></button></div></td></tr>)}</tbody></table></div>{pwUserId && <form className="admin-create-form" onSubmit={handleChangePassword} style={{marginTop:24}}><div className="field"><label>New Password</label><input type="password" value={pwNewPassword} onChange={(e)=>setPwNewPassword(e.target.value)} /></div><div className="field"><label>Confirm Password</label><input type="password" value={pwConfirm} onChange={(e)=>setPwConfirm(e.target.value)} /></div><button className="btn btn-primary" style={{width:"auto"}}>Set Password</button><button type="button" className="btn btn-outline" style={{width:"auto"}} onClick={()=>setPwUserId(null)}>Cancel</button></form>}</section>}
          {activeTab === "activity" && <section className="admin-section"><div className="admin-section-head"><h2>Login / Logout Activity</h2></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Email</th><th>Action</th><th>Time</th></tr></thead><tbody>{activity.length === 0 ? <tr><td colSpan="4" className="empty-cell">No activity recorded yet.</td></tr> : activity.map((a)=><tr key={a.id}><td>{a.user?.name || "—"}</td><td>{a.email}</td><td><span className={`badge ${a.action === "login" ? "badge-login" : "badge-logout"}`}>{a.action}</span></td><td>{formatDate(a.createdAt)}</td></tr>)}</tbody></table></div></section>}
        </>}
      </div>
    </div>
  );
}

function DemoTable({ bookings, formatDate, updateStatus }) {
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Lead</th><th>Contact</th><th>Company</th><th>Requested slot</th><th>Status</th><th>Received</th></tr></thead><tbody>{bookings.length === 0 ? <tr><td colSpan="6" className="empty-cell">No demo requests yet.</td></tr> : bookings.map((b) => <tr key={b.id}><td><strong>{b.name}</strong></td><td><div>{b.email}</div><small>{b.phone || "No phone"}</small></td><td>{b.company || "—"}</td><td>{b.date}<br/><strong>{b.time}</strong></td><td><select value={b.status || "requested"} onChange={(e)=>updateStatus(b.id,e.target.value)}>{STATUS_OPTIONS.map((s)=><option key={s} value={s}>{s}</option>)}</select></td><td>{formatDate(b.createdAt)}</td></tr>)}</tbody></table></div>;
}

export default Admin;
