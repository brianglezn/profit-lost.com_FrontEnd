import './HomeBalanceChartSkeleton.scss';

export default function HomeBalanceChartSkeleton() {
    return (
        <div className="chart-skeleton">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                    className="chart-skeleton__line chart-skeleton__line--1"
                    d="M 0 80 Q 20 60, 40 70 Q 60 80, 80 50 Q 90 40, 100 60"
                />
                <path
                    className="chart-skeleton__line chart-skeleton__line--2"
                    d="M 0 70 Q 20 40, 40 50 Q 60 60, 80 30 Q 90 20, 100 50"
                />
            </svg>
        </div>
    );
}
