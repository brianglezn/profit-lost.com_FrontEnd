import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="AnnualReport" {...a11yProps(0)} />
                    <Tab label="Movements" {...a11yProps(1)} />
                    <Tab label="Accounts" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className="preview__img">
                    <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1704652663/profit-lost.com/img/preview/annual_report.png" alt="annual_report-img" />
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="preview__img">
                    <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1704652663/profit-lost.com/img/preview/movements.png" alt="movements-img" />
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div className="preview__img">
                    <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1704652663/profit-lost.com/img/preview/accounts.png" alt="accounts-img" />
                </div>
            </CustomTabPanel>
        </Box>
    );
}
