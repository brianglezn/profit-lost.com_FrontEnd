import { TabView, TabPanel } from 'primereact/tabview';

export default function BasicTabs() {
    return (
        <>
            <div className="section__demo">
                <TabView>
                    <TabPanel header="ANNUAL REPORT">
                        <div className="demo__img">
                            <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1704652663/profit-lost.com/img/preview/annual_report.png" alt="annual_report-img" />
                        </div>
                    </TabPanel>
                    <TabPanel header="MOVEMENTS">
                        <div className="demo__img">
                            <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1704652663/profit-lost.com/img/preview/movements.png" alt="movements-img" />
                        </div>
                    </TabPanel>
                    <TabPanel header="ACCOUNTS">
                        <div className="demo__img">
                            <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1704652663/profit-lost.com/img/preview/accounts.png" alt="accounts-img" />
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </>
    );
}
