import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchDeliveryLogsId } from '../api';

export default function CampaignLogs() {
  const { id } = useParams();

  const { data, isLoading } = useQuery(['logs', id], () => fetchDeliveryLogsId(id));

  if (isLoading) return <div>Loading...</div>;

  const logs = data.data;

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatFailureReason = (reason) => {
    if (!reason) return '-';
    return reason.replace(/b'|'/g, '');
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Delivery Logs — Campaign #{id}</h1>

        <Link
          to="/"
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "transform 0.15s ease",
          }}
          onClick={(e) => {
            const btn = e.target;
            btn.classList.add("clicked");
            setTimeout(() => btn.classList.remove("clicked"), 200);
          }}
        >
          ← Back
        </Link>
      </div>

      {/* Table Wrapper */}
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 700,
          }}
        >
          <thead style={{ background: "#f4f4f4", position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th style={thStyle}>Recipient Email</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Failure Reason</th>
              <th style={thStyle}>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={tdStyle}>{log.recipient_email}</td>
                <td style={tdStyle}>{log.status}</td>
                <td style={{ ...tdStyle, maxWidth: 400, wordWrap: "break-word" }}>
                  {formatFailureReason(log.failure_reason)}
                </td>
                <td style={tdStyle}>{formatDate(log.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

const thStyle = {
  padding: 12,
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  fontWeight: "bold",
  background: "#f8f8f8",
};

const tdStyle = {
  padding: 12,
  borderBottom: "1px solid #eee",
};
