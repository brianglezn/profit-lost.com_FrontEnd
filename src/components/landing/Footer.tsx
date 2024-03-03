import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer__container1">
          <div className="footer__img no-select">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost.svg"
              alt="logo"
            />
          </div>
          <div className="footer__links">
            <div className="footer__links__1 no-select">
              <img
                src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122158/profit-lost.com/img/brian.jpg"
                alt="brian gonzalez novoa"
              />
            </div>
            <div className="footer__links__2">
              <b>Brian González Novoa</b>
              <p>Web Developer</p>
              <div className="footer__links__2-rrss no-select">
                <a
                  href="https://www.linkedin.com/in/brianglezn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    width="512"
                    height="512"
                    viewBox="-2 -2 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#ffffff"
                      d="M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91c-1.182 0-1.886.796-2.195 1.565c-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126c2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/brianglezn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    width="512"
                    height="512"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#ffffff"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59c.4.07.55-.17.55-.38c0-.19-.01-.82-.01-1.49c-2.01.37-2.53-.49-2.69-.94c-.09-.23-.48-.94-.82-1.13c-.28-.15-.68-.52-.01-.53c.63-.01 1.08.58 1.23.82c.72 1.21 1.87.87 2.33.66c.07-.52.28-.87.51-1.07c-1.78-.2-3.64-.89-3.64-3.95c0-.87.31-1.59.82-2.15c-.08-.2-.36-1.02.08-2.12c0 0 .67-.21 2.2.82c.64-.18 1.32-.27 2-.27c.68 0 1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82c.44 1.1.16 1.92.08 2.12c.51.56.82 1.27.82 2.15c0 3.07-1.87 3.75-3.65 3.95c.29.25.54.73.54 1.48c0 1.07-.01 1.93-.01 2.2c0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                </a>
                <a
                  href="mailto:hola@profit-lost.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    width="512"
                    height="512"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#ffffff"
                      d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm8-7L4 8v10h16V8l-8 5Zm0-2l8-5H4l8 5ZM4 8V6v12V8Z"
                    />
                  </svg>
                </a>
                <a
                  href="https://brian-novoa.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    width="512"
                    height="512"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      stroke="#ffffff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="2.5" cy="7" r="2" />
                      <circle cx="11.5" cy="2.5" r="2" />
                      <circle cx="11.5" cy="11.5" r="2" />
                      <path d="m3.71 5.41l5.85-2.43M3.71 8.59l5.85 2.43" />
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__container2">
          <p>
            ©{currentYear} Profit&Lost •<Link to="/cookies">Cookies</Link>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
