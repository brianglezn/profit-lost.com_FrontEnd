import './HomeMovementsHistorySkeleton.scss';

export default function HomeMovementsHistorySkeleton() {
    // Render a skeleton structure for loading movements history
    return (
        <div className="movements-history-skeleton">
            <ul>
                {Array.from({ length: 8 }).map((_, index) => (
                    <li key={index} className="movement-item-skeleton">
                        <div className="description-section">
                            <div className="skeleton-text skeleton-description"></div>
                            <div className="skeleton-text skeleton-date"></div>
                        </div>
                        <div className="skeleton-text skeleton-amount"></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
