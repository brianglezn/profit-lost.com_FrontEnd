import Avatar from "@mui/material/Avatar";
import { useNavigate } from 'react-router-dom';

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');

    // Redirigir al usuario a la página de inicio o a cualquier otra página
    navigate('/login'); // Ajusta esta ruta según sea necesario
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
