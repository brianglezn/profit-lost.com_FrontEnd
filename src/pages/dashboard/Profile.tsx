import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

import "./Profile.css";

interface User {
  username: string;
  email: string;
  name: string;
  surname: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {
        const response = await fetch('https://profit-lost-backend.onrender.com/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <section className="profile">
        <div className="profile__avatar">
          <div className="avatar">
            <Avatar
              sx={{ bgcolor: "var(--color-orange)", width: 100, height: 100 }}
              variant="rounded"
            >
              {user?.name?.[0] ?? ''}
            </Avatar>
          </div>
          <div className="name">
            <h2>{user?.name ?? ''} {user?.surname ?? ''}</h2>
          </div>
        </div>
        <div className="profile__dashboard">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </section>
    </>
  );
}

export default Profile;
