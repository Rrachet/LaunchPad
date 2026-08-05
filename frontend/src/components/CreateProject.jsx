import { useState } from "react";
import API from "../services/api";
import Icon from "./Icon";

function CreateProject({ refreshProjects }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !owner) {
      setError("Please fill in project name and owner.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/projects", { name, status, owner });
      setSuccess("Project created successfully!");
      setName("");
      setStatus("Active");
      setOwner("");
      refreshProjects();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel create-project">
      <h2>Create New Project</h2>

      {error && <div className="error-box" style={{ width: "100%" }}>{error}</div>}
      {success && <div className="info-box" style={{ width: "100%" }}>{success}</div>}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: 14, flexWrap: "wrap", width: "100%" }}>
        <div className="field">
          <label>Project Name</label>
          <input
            placeholder="e.g. Project Mercury"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Active</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="field">
          <label>Owner</label>
          <input
            placeholder="e.g. Jane Doe"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

<button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Creating...
            </>
          ) : (
            <>
              <Icon name="plus" size={16} /> Create Project
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
