import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Icon from "../components/Icon";

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [createMsg, setCreateMsg] = useState("");
  const [createdToken, setCreatedToken] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Edit form
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Password change
  const [pwUserId, setPwUserId] = useState(null);
  const [pwNewPassword, setPwNewPassword] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, activityRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/activity"),
      ]);
      setUsers(usersRes.data?.users || []);
      setActivity(activityRes.data?.activity || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCreateMsg("");
    setCreatedToken("");
    if (!newName || !newEmail) {
      setError("Please fill in name and email.");
      return;
    }
    setCreateLoading(true);
    try {
      const res = await API.post("/admin/users", { name: newName, email: newEmail });
      setCreateMsg(res.data?.message || "Client created.");
      setCreatedToken(res.data?.setupToken || "");
      setNewName("");
      setNewEmail("");
      setShowCreate(false);
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create client.");
    } finally {
      setCreateLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const handleUpdate = async (id) => {
    setError("");
    try {
      await API.put(`/admin/users/${id}`, { name: editName, email: editEmail });
      cancelEdit();
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update client.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    setError("");
    try {
      await API.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete client.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!pwNewPassword || pwNewPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (pwNewPassword !== pwConfirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await API.put(`/admin/users/${pwUserId}/password`, { newPassword: pwNewPassword });
      setPwUserId(null);
      setPwNewPassword("");
      setPwConfirm("");
      setCreateMsg("Password updated successfully.");
      setTimeout(() => setCreateMsg(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="brand-logo">L</div>
          <span className="brand-name">LaunchBoard Admin</span>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">ADMIN</span>
<button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
            <Icon name="arrowLeft" size={16} /> Dashboard
          </button>
          <button className="btn-danger" onClick={handleLogout}>
            <Icon name="logout" size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-subtitle">
          Create and manage client (mail) accounts, change passwords, and monitor login activity.
        </p>

        {error && <div className="error-box">{error}</div>}
        {createMsg && <div className="info-box">{createMsg}</div>}

        {createdToken && (
          <div className="dev-otp" style={{ marginBottom: 24 }}>
            <span>Setup link token (share with client):</span>
            <strong style={{ fontSize: 13, letterSpacing: 0.5, wordBreak: "break-all" }}>
              {createdToken}
            </strong>
          </div>
        )}

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <section className="admin-section">
              <div className="admin-section-head">
                <h2>Client Users</h2>
<button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setShowCreate((v) => !v)}>
                  {showCreate ? (
                    <>
                      <Icon name="close" size={14} /> Cancel
                    </>
                  ) : (
                    <>
                      <Icon name="plus" size={14} /> Create Client
                    </>
                  )}
                </button>
              </div>

              {showCreate && (
                <form className="admin-create-form" onSubmit={handleCreate}>
                  <div className="field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Email (mail id)</label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "auto" }} disabled={createLoading}>
                    {createLoading ? (
                      <>
                        <span className="spinner" /> Creating...
                      </>
                    ) : (
                      "Create Client"
                    )}
                  </button>
                </form>
              )}

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Email Verified</th>
                      <th>Password</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-cell">
                          No client users found. Create one above.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id}>
                          <td>
                            {editingId === u.id ? (
                              <input
                                className="table-input"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            ) : (
                              u.name
                            )}
                          </td>
                          <td>
                            {editingId === u.id ? (
                              <input
                                className="table-input"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                              />
                            ) : (
                              u.email
                            )}
                          </td>
                          <td>
                            <span className="badge badge-user">{u.role}</span>
                          </td>
                          <td>
                            {u.emailVerified ? (
                              <span className="badge badge-ok">Verified</span>
                            ) : (
                              <span className="badge badge-warn">Pending</span>
                            )}
                          </td>
                          <td>
                            {u.passwordVerified ? (
                              <span className="badge badge-ok">Set</span>
                            ) : (
                              <span className="badge badge-warn">Not set</span>
                            )}
                          </td>
                          <td>{formatDate(u.createdAt)}</td>
                          <td>
<div className="table-actions">
                              {editingId === u.id ? (
                                <>
                                  <button className="btn-icon btn-save" onClick={() => handleUpdate(u.id)}>
                                    <Icon name="check" size={14} /> Save
                                  </button>
                                  <button className="btn-icon btn-delete" onClick={cancelEdit}>
                                    <Icon name="close" size={14} />
                                  </button>
                                </>
                              ) : (
                                <button className="btn-icon btn-edit" onClick={() => startEdit(u)}>
                                  <Icon name="edit" size={14} /> Edit
                                </button>
                              )}
                              <button className="btn-icon btn-edit" onClick={() => setPwUserId(u.id)} title="Change password">
                                <Icon name="key" size={14} />
                              </button>
                              <button className="btn-icon btn-delete" onClick={() => handleDelete(u.id)} title="Delete">
                                <Icon name="trash" size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {pwUserId && (
              <section className="admin-section">
                <h2>Change Password</h2>
                <form className="admin-create-form" onSubmit={handleChangePassword}>
                  <div className="field">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={pwNewPassword}
                      onChange={(e) => setPwNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
                    Set Password
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => { setPwUserId(null); setPwNewPassword(""); setPwConfirm(""); }}>
                    Cancel
                  </button>
                </form>
              </section>
            )}

            <section className="admin-section">
              <h2>Login / Logout Activity</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Action</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-cell">
                          No activity recorded yet.
                        </td>
                      </tr>
                    ) : (
                      activity.map((a) => (
                        <tr key={a.id}>
                          <td>{a.user?.name || "—"}</td>
                          <td>{a.email}</td>
                          <td>
                            <span className={`badge ${a.action === "login" ? "badge-login" : "badge-logout"}`}>
                              {a.action === "login" ? "Login" : "Logout"}
                            </span>
                          </td>
                          <td>{formatDate(a.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
