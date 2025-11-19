import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  fetchRecipients,
  bulkUploadRecipients,
  createRecipient,
  updateRecipient,
  deleteRecipient,
} from '../api';

export default function Recipients() {
  const { data, isLoading, refetch } = useQuery('recipients', fetchRecipients);
  const [file, setFile] = useState(null);

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Select a file");
    const formData = new FormData();
    formData.append('file', file);

    await bulkUploadRecipients(formData);
    refetch();
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '' });
    setError("");
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ name: r.name, email: r.email });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Proceed to API
    if (editing) {
      await updateRecipient(editing.id, form);
    } else {
      await createRecipient(form);
    }

    setShowModal(false);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipient?")) return;
    await deleteRecipient(id);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Recipients</h1>
        <button style={buttonStyle} onClick={openCreate}>+ Add Recipient</button>
      </div>

      {/* Upload Box */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: 20,
          display: "flex",
          gap: 15,
          alignItems: "center"
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={inputStyle}
        />

        <button onClick={handleUpload} style={buttonStyle}>
          Upload CSV
        </button>
      </div>

      {/* Recipients Table */}
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 600,
          }}
        >
          <thead style={{ background: "#f4f4f4", position: "sticky", top: 0 }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Subscription Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.data.map((r) => (
              <tr key={r.id}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>{r.email}</td>
                <td style={tdStyle}>{r.subscription_status}</td>
                <td style={{ ...tdStyle, display: "flex", gap: 10 }}>
                  <button style={smallBtn} onClick={() => openEdit(r)}>Edit</button>
                  <button style={delBtn} onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>{editing ? "Edit Recipient" : "Add Recipient"}</h2>

            <input
              placeholder="Name"
              style={{ ...inputStyle, marginBottom: 10 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Email"
              style={{ ...inputStyle, marginBottom: 10 }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* ERROR MESSAGE */}
            {error && (
              <div style={{ color: "red", marginBottom: 15, fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button style={cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={buttonStyle} onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
  outline: "none",
};

const buttonStyle = {
  padding: "8px 16px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
};

const smallBtn = {
  padding: "5px 10px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const delBtn = {
  padding: "5px 10px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const cancelBtn = {
  padding: "8px 16px",
  background: "#6c757d",
  color: "white",
  borderRadius: 6,
  cursor: "pointer",
};

const thStyle = {
  padding: 10,
  borderBottom: "1px solid #ddd",
  fontWeight: "bold",
  textAlign: "center",
};

const tdStyle = {
  padding: 10,
  borderBottom: "1px solid #eee",
  textAlign: "center",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  width: 400,
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
};
