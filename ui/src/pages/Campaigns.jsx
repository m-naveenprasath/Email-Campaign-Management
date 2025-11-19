import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchCampaigns, scheduleCampaign, rescheduleCampaign, deleteCampaign, updateCampaign } from '../api';
import { Link } from 'react-router-dom';

export default function Campaigns() {
  const { data, isLoading, refetch } = useQuery('campaigns', fetchCampaigns);

  const [rescheduleId, setRescheduleId] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [editData, setEditData] = useState(null);

  if (isLoading) return <div style={{ padding: 20 }}>Loading...</div>;

  const handleSchedule = async (id) => { await scheduleCampaign(id); refetch(); };
  const handleReschedule = async () => {
    if (!newTime || !rescheduleId) return alert("Pick a new scheduled time");
    await rescheduleCampaign(rescheduleId, newTime);
    setRescheduleId(null);
    setNewTime('');
    refetch();
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    await deleteCampaign(id);
    refetch();
  };
  const handleEdit = (c) => setEditData({ ...c });
  const submitEdit = async () => {
    await updateCampaign(editData.id, editData);
    setEditData(null);
    refetch();
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
        <h1 style={{ margin: 0 }}>Campaign Dashboard</h1>
        <button
          onClick={() => {
            // Trigger animation
            const btn = document.getElementById("fetchBtn");
            btn.classList.add("clicked");
            setTimeout(() => btn.classList.remove("clicked"), 200);

            refetch();
          }}
          id="fetchBtn"
          style={{
            padding: "6px 14px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease"
          }}
          className="fetch-button"
        >
          Fetch
        </button>

      </div>

      {/* Scrollable Table */}
      <div style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'auto', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead style={{ background: '#f4f4f4', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Scheduled Time</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Recipients</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Sent</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Failed</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Actions</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Logs</th>
            </tr>
          </thead>

          <tbody>
            {data.data.map(c => (
              <tr key={c.id}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.name}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {c.scheduled_time ? new Date(c.scheduled_time).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
                  }) : '-'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.status}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.total_recipients}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.sent_count}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.failed_count}</td>

                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {c.status === 'draft' && (
                    <>
                      <button onClick={() => handleSchedule(c.id)} style={{ marginRight: 4 }}>Schedule</button>
                      <button onClick={() => setRescheduleId(c.id)} style={{ marginRight: 4 }}>Reschedule</button>
                      <button onClick={() => handleEdit(c)} style={{ marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleDelete(c.id)}>Delete</button>
                    </>
                  )}

                  {c.status === 'scheduled' && (
                    <>
                      <button onClick={() => setRescheduleId(c.id)} style={{ marginRight: 4 }}>Reschedule</button>
                      <button onClick={() => handleEdit(c)}>Edit</button>
                    </>
                  )}
                </td>

                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <Link to={`/campaign/${c.id}/logs`}>
                    <button>Logs</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: 20, width: 300 }}>
            <h3>Reschedule #{rescheduleId}</h3>
            <input type="datetime-local" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '100%', padding: 6 }} />
            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <button onClick={handleReschedule} style={{ marginRight: 10 }}>Submit</button>
              <button onClick={() => setRescheduleId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: 20, width: 300 }}>
            <h3>Edit #{editData.id}</h3>
            <label>Name</label>
            <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ width: '100%', padding: 6, marginBottom: 10 }} />
            <label>Content</label>
            <textarea rows={4} value={editData.content} onChange={(e) => setEditData({ ...editData, content: e.target.value })} style={{ width: '100%', padding: 6 }} />
            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <button onClick={submitEdit} style={{ marginRight: 10 }}>Save</button>
              <button onClick={() => setEditData(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}