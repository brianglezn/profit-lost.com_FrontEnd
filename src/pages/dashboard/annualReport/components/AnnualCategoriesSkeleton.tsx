import { Skeleton } from 'primereact/skeleton';
import './AnnualCategoriesSkeleton.scss';

export default function AnnualCategoriesSkeleton() {
    return (
        <div className="annual__categories-skeleton">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="category-item-skeleton">
                    <div className="category-color-skeleton">
                        <Skeleton shape="circle" size="1.4rem" />
                    </div>
                    <div className="category-name-skeleton">
                        <Skeleton width="70%" height="1rem" />
                    </div>
                    <div className="category-balance-skeleton">
                        <Skeleton width="40%" height="1rem" />
                    </div>
                </div>
            ))}
        </div>
    );
}
