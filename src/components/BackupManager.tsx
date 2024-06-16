import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import './BackupManager.scss';

function BackupManager() {
  const { authToken } = useAuth();
  const [backups, setBackups] = useState<string[]>([]);

  useEffect(() => {
    if (!authToken) {
      toast.error('No authentication token found. Please log in.');
      return;
    }

    fetch('https://profit-lost-backend.onrender.com/api/check-backups', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => response.json())
      .then(data => setBackups(data.backups))
      .catch(error => {
        console.error('Error fetching backups:', error);
        toast.error('Error fetching backups');
      });
  }, [authToken]);

  const downloadBackup = (filename: string) => {
    if (!authToken) {
      toast.error('No authentication token found. Please log in.');
      return;
    }

    fetch(`https://profit-lost-backend.onrender.com/api/download-backup/${filename}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error downloading backup:', error);
        toast.error('Error downloading backup');
      });
  };

  const removeBackup = (filename: string) => {
    if (!authToken) {
      toast.error('No authentication token found. Please log in.');
      return;
    }

    fetch(`https://profit-lost-backend.onrender.com/api/remove-backup/${filename}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete backup');
        }
        return response.json();
      })
      .then(() => {
        setBackups(backups.filter(backup => backup !== filename));
        toast.success('Backup deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting backup:', error);
        toast.error('Error deleting backup');
      });
  };
  return (
    <div className="backupManager">
      <div className="backupManager-container"><h1>Backup Manager</h1>
        <ul>
          {backups.map((backup, index) => (
            <li key={index}>
              {backup}
              <div>
                <button onClick={() => removeBackup(backup)}>Remove</button>
                <button onClick={() => downloadBackup(backup)}>Download</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BackupManager
