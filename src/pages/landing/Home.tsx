import { Carousel } from "primereact/carousel";

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

const Home = () => {
  const imageTemplate = (image: string) => {
    return (
      <div className="carousel-image-container">
        <img src={image} alt="App screenshot" className="carousel-image" />
      </div>
    );
  };

  return (
    <div className="home">
      <UnderConstruction />
      <Header />

      <section className="hero">
        <div className="hero__title">
          <h1>Manage All Your Personal Finances in One Place</h1>
        </div>
      </section>

      <div className="container__sections">
        <section className="section__description">
          <div className="section__description-container">
            <div>
              <h2>Transforming Personal Financial Management</h2>
              <p>
                With Profit&Lost, you can manage your personal finances with ease
                and efficiency. Our intuitive platform helps you to control
                income, expenses, and savings, all in one place. Start making
                smarter financial decisions today!
              </p>
            </div>

            <div className="no-select">
              <img
                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670807/AppPhotos/illustrations/illustration1.svg"
                alt="logo"
              />
            </div>
          </div>
        </section>

        <section className="section__features" id="features">
          <article>
            <figure>
              <MobileScreenIcon />
            </figure>
            <div>
              <h3>Multidevice</h3>
            </div>
          </article>
          <article>
            <figure>
              <EmptyDashBoardIcon />
            </figure>
            <div>
              <h3>Friendly Dashboard</h3>
            </div>
          </article>
          <article>
            <figure>
              <FaceGrinBeamIcon />
            </figure>
            <div>
              <h3>Easy to Use</h3>
            </div>
          </article>
        </section>

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
};

export default Home;
