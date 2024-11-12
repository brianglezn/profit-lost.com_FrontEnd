import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import CarouselSection from "./components/CarouselSection";
import DescriptionSection from "./components/DescriptionSection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import UnderConstructionBanner from "../../../components/layout/UnderConstruction";
import "./Home.scss";

export default function Home() {
    return (
        <div className="home">
            <UnderConstructionBanner />

            <Header />

            <HeroSection />

            <div className="container__sections">
                <DescriptionSection />
                <FeaturesSection />
                <CarouselSection />
            </div>

            <Footer />
        </div>
    );
}
