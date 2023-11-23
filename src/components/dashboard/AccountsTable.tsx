// Propiedades del componente
// interface AccountsProps {
//     year: string;
//     isDataEmpty: boolean;
// }

// Función para formatear números a formato de moneda local
// function formatCurrency(value: number) {
//     return value.toLocaleString("es-ES", {
//         style: "currency",
//         currency: "EUR",
//         minimumFractionDigits: 2,
//         useGrouping: true,
//     });
// }

// function AccountsTable(props: AccountsProps) {
function AccountsTable() {
    // Desestructuración de las propiedades para un acceso más fácil
    // const { year } = props;

    return (
        <>
            <div className="accounts__movements-table">
                {<p>No data available for this account.</p>}
            </div>
        </>
    );
}

export default AccountsTable;
