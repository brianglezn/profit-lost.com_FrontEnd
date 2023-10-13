import "./AnnualReport.css";

function AnnualReport() {
  return (
    <>
      <section className="annualReport">
        <div className="annualReport__main">
          <div className="annualReport__main-year">
            <span>Year</span>
            {/* Select Year */}
          </div>
          <div className="annualReport__main-balance">
            <span className="annualReport__main-balance income">
              18.659,85 €
            </span>
            <span className="annualReport__main-balance expenses">
              15.817,42 €
            </span>
          </div>
          <div className="annualReport__main-chart"></div>
        </div>
        <div className="annualReport__category">
          <div className="annualReport__category-text">
            <p>Categories</p>
            <span className="material-symbols-rounded">new_window</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default AnnualReport;
