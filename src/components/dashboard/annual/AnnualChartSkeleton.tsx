import './AnnualChartSkeleton.scss';

export default function AnnualChartSkeleton() {
    const totalBars = 12;
    const svgWidth = 100;
    const barGroupWidth = svgWidth / totalBars;

    return (
        <div className="annual-chart-skeleton">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: totalBars }).map((_, index) => {
                    const incomeHeight = Math.random() * 50 + 20;
                    const expenseHeight = Math.random() * 40 + 10;
                    const barXPosition = index * barGroupWidth + (barGroupWidth / 2 - 4);

                    return (
                        <g key={index} className="skeleton-month-group">
                            <rect
                                className="skeleton-bar income-bar"
                                x={barXPosition}
                                y={100 - incomeHeight}
                                width="3"
                                height={incomeHeight}
                            />
                            <rect
                                className="skeleton-bar expense-bar"
                                x={barXPosition + 3.3}
                                y={100 - expenseHeight}
                                width="3"
                                height={expenseHeight}
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
