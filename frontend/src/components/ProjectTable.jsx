import { useState } from "react";
import API from "../services/api";
import Icon from "./Icon";

function ProjectTable({ projects, refreshProjects }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", status: "", owner: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showMessage = (type, text) => {
    if (type === "success") {
      setMessage(text);
      setError("");
    } else {
      setError(text);
      setMessage("");
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      showMessage("success", "Project deleted.");
      refreshProjects();
    } catch {
      showMessage("error", "Failed to delete project.");
    }
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditData({ name: project.name, status: project.status, owner: project.owner });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/projects/${editingId}`, editData);
      showMessage("success", "Project updated.");
      setEditingId(null);
      refreshProjects();
    } catch {
      showMessage("error", "Failed to update project.");
    }
  };

  return (
    <div className="project-table">
      <h2>Recent Projects</h2>

      {message && <div className="info-box">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      {projects.length === 0 ? (
<div className="empty-state">
          <div className="empty-icon">
            <Icon name="folder" size={40} />
          </div>
          <p>No projects yet. Create your first project above.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    {editingId === project.id ? (
                      <input
                        className="table-input"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{project.name}</span>
                    )}
                  </td>
                  <td>
                    {editingId === project.id ? (
                      <select
                        className="table-input"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      >
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Completed</option>
                      </select>
                    ) : (
                      <span className={`status-badge status-${project.status}`}>{project.status}</span>
                    )}
                  </td>
                  <td>
                    {editingId === project.id ? (
                      <input
                        className="table-input"
                        value={editData.owner}
                        onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
                      />
                    ) : (
                      project.owner
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
{editingId === project.id ? (
                        <button className="btn-icon btn-save" onClick={handleUpdate}>
                          <Icon name="check" size={14} /> Save
                        </button>
                      ) : (
                        <button className="btn-icon btn-edit" onClick={() => startEdit(project)}>
                          <Icon name="edit" size={14} /> Edit
                        </button>
                      )}
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(project.id)}>
                        <Icon name="trash" size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProjectTable;
