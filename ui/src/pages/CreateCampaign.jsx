import React, { useState } from 'react';
import { createCampaign } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateCampaign() {
  const [form, setForm] = useState({ name: '', subject: '', content: '', scheduled_time: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Animation on submit
    const btn = document.getElementById("createBtn");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 200);

    await createCampaign(form);
    navigate('/');
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Create Campaign</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "25px",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box"
        }}
      >

        <input
          name="name"
          placeholder="Campaign Name"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="subject"
          placeholder="Subject Line"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="content"
          placeholder="Email Content"
          rows="5"
          onChange={handleChange}
          required
          style={{ ...inputStyle, height: 120 }}
        />

        <input
          type="datetime-local"
          name="scheduled_time"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          id="createBtn"
          type="submit"
          style={{
            padding: "10px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease"
          }}
        >
          Create Campaign
        </button>

      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box", // 🔥 makes it fit perfectly
};
