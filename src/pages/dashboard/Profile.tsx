import Avatar from "@mui/material/Avatar";
import { useNavigate } from 'react-router-dom';

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');

    // Redirect the user to the home page or any other page
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
              P 1
            </Avatar>
          </div>
          <div className="name">
            <h2>Prueba 1</h2>
          </div>
        </div>

        {/* Botón de Logout */}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </section>
    </>
  );
}

export default Profile;
