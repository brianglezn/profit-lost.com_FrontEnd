import './MovementsHistoryHome.scss';

type Transaction = {
    _id: string;
    description: string;
    amount: number;
    date: string;
};

interface MovementsHistoryHomeProps {
    data: Transaction[];
    isDataEmpty: boolean;
}

function MovementsHistoryHome({ data, isDataEmpty }: MovementsHistoryHomeProps) {
    const sortedData = data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="movements-history-home">
            {isDataEmpty || sortedData.length === 0 ? (
                <p>No movements found</p>
            ) : (
                <ul>
                    {sortedData.map((transaction) => (
                        <li key={transaction._id} className="movement-item">
                            <div className="description-section">
                                <div className="description">{transaction.description}</div>
                                <div className="date">{formatDate(transaction.date)}</div>
                            </div>
                            <div className={"amount"}>
                                {transaction.amount.toFixed(2)} €
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MovementsHistoryHome;
