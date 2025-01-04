import React, { Suspense } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const DashHome = React.lazy(() => import('../features/dashHome/DashHome'));
const Accounts = React.lazy(() => import('../features/accounts/Accounts'));
const AnnualReport = React.lazy(() => import('../features/annualReport/AnnualReport'));
const Movements = React.lazy(() => import('../features/movements/Movements'));
const Goals = React.lazy(() => import('../features/goals/Goals'));
const Notes = React.lazy(() => import('../features/notes/Notes'));

import './DashboardContent.scss';

interface DashboardContentProps {
    activeSection: string;
}
const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
    return (
        <section className='dashboard__content'>
            <Suspense
                fallback={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: '#fe6f14',
                        }}
                    >
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth='3' className='custom-spinner' />
                    </div>
                }
            >
                {activeSection === 'Dashboard' && <DashHome />}
                {activeSection === 'AnnualReport' && <AnnualReport />}
                {activeSection === 'Movements' && <Movements />}
                {activeSection === 'Accounts' && <Accounts />}
                {activeSection === 'Notes' && <Notes />}
                {activeSection === 'Goals' && <Goals />}
            </Suspense>
        </section>
    );
};

export default DashboardContent;
