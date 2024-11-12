import './Footer.scss';
import EnvelopIcon from '../icons/EnvelopIcon';
import GitHubIcon from '../icons/GitHubIcon';
import LinkedinIcon from '../icons/LinkedinIcon';
import SolarPanelIcon from '../icons/SolarPanelIcon';

export default function Footer() {
  // Get the current year to display in the footer
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className='footer'>
        <div className='footer__container-top'>
          {/* Footer logo section */}
          <div className='footer__img no-select'>
            <img
              src='https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL2.svg'
              alt='logo'
            />
          </div>

          {/* Contact and social links section */}
          <div className='footer__links'>
            {/* Image of the developer */}
            <div className='footer__links-left no-select'>
              <img
                src='https://res.cloudinary.com/dnhlagojg/image/upload/v1726670813/AppPhotos/Photos/photoBrian.jpg'
                alt='brian gonzalez novoa'
              />
            </div>

            {/* Personal information and social media links */}
            <div className='footer__links-right'>
              <b>Brian González Novoa</b>
              <p>Web Developer</p>

              {/* Social media and contact links */}
              <div className='footer__links-right-rrss no-select'>
                {/* LinkedIn link with tooltip */}
                <a
                  href='https://www.linkedin.com/in/brianglezn/'
                  target='_blank'
                  rel='noreferrer'
                >
                  <LinkedinIcon />
                  <span className='tooltip'>LinkedIn</span>
                </a>

                {/* GitHub link with tooltip */}
                <a
                  href='https://github.com/brianglezn'
                  target='_blank'
                  rel='noreferrer'
                >
                  <GitHubIcon />
                  <span className='tooltip'>GitHub</span>
                </a>

                {/* Email link with tooltip */}
                <a
                  href='mailto:hola@profit-lost.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  <EnvelopIcon />
                  <span className='tooltip'>Email</span>
                </a>

                {/* Personal website link with tooltip */}
                <a
                  href='https://brian-novoa.com/'
                  target='_blank'
                  rel='noreferrer'
                >
                  <SolarPanelIcon />
                  <span className='tooltip'>Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section of the footer, with copyright and legal links */}
        <div className='footer__container-bottom'>
          <p>
            ©{currentYear} Profit&Lost • <a href='/cookies'>Cookies</a> • <a href='/privacy'>Privacy</a>
          </p>
        </div>
      </footer>
    </>
  );
}