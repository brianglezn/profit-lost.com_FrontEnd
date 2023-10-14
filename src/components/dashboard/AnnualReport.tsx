import React from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { BarChart } from "@mui/x-charts/BarChart";

import "./AnnualReport.css";

function AnnualReport() {
  
  // Select Year ----------------

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [date, setDate] = React.useState(currentYear);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setDate(newValue);
  };

  // Data Chart ----------------

  const inData = [
    1575.02, 1505.67, 1341.68, 1757.31, 1606.85, 1650.61, 1687.14, 1708.57,
    1893.27, 1500, 1300, 1700,
  ];
  const outData = [
    1402.58, 1054.03, 1547.36, 1482.13, 1445.96, 1906.09, 1231.87, 633.6,
    1086.58, 1294.67, 1201, 1365,
  ];
  const xLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <>
      <section className="annualReport">
        <div className="annualReport__main">
          <div className="annualReport__main-year">
            <FormControl>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={date}
                label="Year"
                onChange={handleChange}
              >
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="annualReport__main-balance">
            <span className="annualReport__main-balance income">
              18.659,85 €
            </span>
            <span className="annualReport__main-balance expenses">
              15.817,42 €
            </span>
          </div>
          <div className="annualReport__main-chart">
            <BarChart
              width={500}
              height={300}
              series={[
                { data: inData, label: "Income", id: "inId" },
                { data: outData, label: "Expenses", id: "outId" },
              ]}
              xAxis={[{ data: xLabels, scaleType: "band" }]}
            />
          </div>
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
