import "./Footer.scss";
import EnvelopIcon from "../icons/EnvelopIcon";
import GitHubIcon from "../icons/GitHubIcon";
import LinkedinIcon from "../icons/LinkedinIcon";
import SolarPanelIcon from "../icons/SolarPanelIcon";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer__container-top">
          <div className="footer__img no-select">
            <img
              src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL2.svg"
              alt="logo"
            />
          </div>
          <div className="footer__links">
            <div className="footer__links-left no-select">
              <img
                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670813/AppPhotos/Photos/photoBrian.jpg"
                alt="brian gonzalez novoa"
              />
            </div>
            <div className="footer__links-right">
              <b>Brian González Novoa</b>
              <p>Web Developer</p>
              <div className="footer__links-right-rrss no-select">
                <a
                  href="https://www.linkedin.com/in/brianglezn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedinIcon />
                  <span className="tooltip">LinkedIn</span>
                </a>
                <a
                  href="https://github.com/brianglezn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitHubIcon />
                  <span className="tooltip">GitHub</span>
                </a>
                <a
                  href="mailto:hola@profit-lost.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <EnvelopIcon />
                  <span className="tooltip">Email</span>
                </a>
                <a
                  href="https://brian-novoa.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <SolarPanelIcon />
                  <span className="tooltip">Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__container-bottom">
          <p>
            ©{currentYear} Profit&Lost •<a href="/cookies">Cookies</a> • <a href="/privacy">Privacy</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
