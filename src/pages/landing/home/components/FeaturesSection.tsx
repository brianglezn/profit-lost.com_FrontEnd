import "./FeaturesSection.scss";

import MobileScreenIcon from "../../../../components/icons/MobileScreenIcon";
import EmptyDashBoardIcon from "../../../../components/icons/EmptyDashBoardIcon";
import FaceGrinBeamIcon from "../../../../components/icons/FaceGrinBeamIcon";

export default function FeaturesSection() {

    const features = [
        { icon: <MobileScreenIcon />, label: "Multidevice" },
        { icon: <EmptyDashBoardIcon />, label: "Friendly Dashboard" },
        { icon: <FaceGrinBeamIcon />, label: "Easy to Use" },
    ];

    return (
        <section className="section__features" id="features">
            {features.map((feature, index) => (
                <article key={index}>
                    <figure>{feature.icon}</figure>
                    <div>
                        <h3>{feature.label}</h3>
                    </div>
                </article>
            ))}
        </section>
    );
}
