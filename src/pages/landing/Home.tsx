import { Carousel } from "primereact/carousel";
import { useTranslation } from 'react-i18next';

import MobileScreenIcon from "../../components/icons/MobileScreenIcon";
import EmptyDashBoardIcon from "../../components/icons/EmptyDashBoardIcon";
import FaceGrinBeamIcon from "../../components/icons/FaceGrinBeamIcon";
import UnderConstruction from "../../components/landing/UnderConstruction";

import "./Home.scss";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";

const images = [
  "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/DashBoard.png",
  "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/AnnualReport.png",
  "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Movements.png",
  "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Accounts.png",
  "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Notes.png",
  "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Reports.png"
];

export default function Home() {
  const { t } = useTranslation();

  // Template for rendering each image in the carousel
  const imageTemplate = (image: string) => {
    return (
      <div className="carousel-image-container">
        <img src={image} alt="App screenshot" className="carousel-image" />
      </div>
    );
  };

  return (
    <div className="home">
      {/* Display an under construction banner */}
      <UnderConstruction />

      <Header />

      {/* Hero section with main title */}
      <section className="hero">
        <div className="hero__title">
          <h1>{t('landing.home.title')}</h1>
        </div>
      </section>

      <div className="container__sections">
        {/* Description section with image and text */}
        <section className="section__description">
          <div className="section__description-container">
            <div>
              <h2>{t('landing.home.section_description.title')}</h2>
              <p>{t('landing.home.section_description.description')}</p>
            </div>

            <div className="no-select">
              <img
                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670807/AppPhotos/illustrations/illustration1.svg"
                alt="logo"
              />
            </div>
          </div>
        </section>

        {/* Features section displaying key features of the application */}
        <section className="section__features" id="features">
          <article>
            <figure>
              <MobileScreenIcon />
            </figure>
            <div>
              <h3>{t('landing.home.section_features.feature1')}</h3>
            </div>
          </article>
          <article>
            <figure>
              <EmptyDashBoardIcon />
            </figure>
            <div>
              <h3>{t('landing.home.section_features.feature2')}</h3>
            </div>
          </article>
          <article>
            <figure>
              <FaceGrinBeamIcon />
            </figure>
            <div>
              <h3>{t('landing.home.section_features.feature3')}</h3>
            </div>
          </article>
        </section>

        {/* Carousel section showing images of different app features */}
        <section className="section__preview" id="preview">
          <Carousel
            value={images}
            numVisible={1}
            numScroll={1}
            itemTemplate={imageTemplate}
            autoplayInterval={5000}
            circular
          />
        </section>
      </div>

      <Footer />
    </div>
  );
}
