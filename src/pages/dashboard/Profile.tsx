import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';

import { getUserByToken } from '../../api/users/getUserByToken';

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
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getUserByToken(token);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <section className="profile">
      <div className="profile__header">
        <Avatar
          label={user?.name?.[0] ?? ''}
          icon="pi pi-user"
          size="xlarge"
          className="profile__header-avatar"
        />
        <div className="profile__header-name">
          <h2>{user?.name ?? ''} {user?.surname ?? ''}</h2>
        </div>
      </div>
      <div className="profile__dashboard">
        <button onClick={handleLogout} className="profile__dashboard-logout">
          Logout
        </button>
      </div>
    </section>
  );
}

export default Profile;
