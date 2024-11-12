import { Carousel } from "primereact/carousel";
import "./CarouselSection.scss";

const images = [
    "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/DashBoard.png",
    "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/AnnualReport.png",
    "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Movements.png",
    "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Accounts.png",
    "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Notes.png",
    "https://res.cloudinary.com/dnhlagojg/image/upload/v1726770005/AppPhotos/Brand/Reports.png"
];

const imageTemplate = (image: string) => (
    <div className="carousel-image-container">
        <img src={image} alt="App screenshot" className="carousel-image" />
    </div>
);

export default function CarouselSection() {
    return (
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
    );
}
