import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './AnnualReport.css';

function AnnualReport() {
  // Select Year ----------------

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [date, setDate] = React.useState(currentYear.toString());

  const handleChange = (event: SelectChangeEvent<string>) => {
    setDate(event.target.value);
  };

  const years = Array.from(
    { length: currentYear - 2020 },
    (_, index) => currentYear - index
  );

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
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <>
      <section className='annualReport'>
        <div className='annualReport__containerMain'>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Year</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={date}
              label='Year'
              onChange={handleChange}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className='annualReport__containerMain-chart'>
            <BarChart
              width={500}
              height={300}
              series={[
                { data: inData, label: 'Income', id: 'inId' },
                { data: outData, label: 'Expenses', id: 'outId' },
              ]}
              xAxis={[{ data: xLabels, scaleType: 'band' }]}
            />
          </div>
          <div className='annualReport__containerMain__containerBalance income'>
            <span className='material-symbols-rounded'>download</span>
            <p>18.659,85 €</p>
          </div>
          <div className='annualReport__containerMain__containerBalance expenses'>
            <span className='material-symbols-rounded'>upload</span>
            <p>15.817,42 €</p>
          </div>
        </div>
        <div className='annualReport__category'>
          <div className='annualReport__category-text'>
            <p>Categories</p>
            <span className='material-symbols-rounded'>new_window</span>
          </div>
          <div className='annualReport__category-table'></div>
        </div>
      </section>
    </>
  );
}

export default AnnualReport;
