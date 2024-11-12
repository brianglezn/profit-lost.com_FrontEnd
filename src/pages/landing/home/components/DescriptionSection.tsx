import "./DescriptionSection.scss";

export default function DescriptionSection() {

    return (
        <section className="section__description">
            <div className="section__description-container">
                <div>
                    <h2>Transforming Personal Financial Management</h2>
                    <p>With Profit&Lost, you can manage your personal finances with ease and efficiency. Our intuitive platform helps you to control income, expenses, and savings, all in one place. Start making smarter financial decisions today!</p>
                </div>
                <div className="no-select">
                    <img
                        src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670807/AppPhotos/illustrations/illustration1.svg"
                        alt="logo"
                    />
                </div>
            </div>
        </section>
    );
}
