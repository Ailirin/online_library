import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/settings/')
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      });
  }, []);

  const handleChange = (id, value) => {
    setSettings(settings.map(s => s.id === id ? { ...s, value } : s));
  };

  const handleSave = (id, value) => {
  axiosInstance.patch(`/settings/${id}/`, { value })
    .then(() => {
        // Можно добавить уведомление об успехе
      });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Настройки сайта</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {settings.map(setting => (
            <tr key={setting.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 500, width: 200 }}>{setting.key}</td>
              <td style={{ padding: '12px 8px' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    fontSize: 16
                  }}
                  value={setting.value}
                  onChange={e => handleChange(setting.id, e.target.value)}
                  onBlur={() => handleSave(setting.id, setting.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSettingsPage;