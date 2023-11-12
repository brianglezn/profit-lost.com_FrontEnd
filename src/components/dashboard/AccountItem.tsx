import PropTypes from "prop-types";

// Definición de la interfaz para las propiedades del componente AccountItem
interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
}

function AccountItem(props: AccountItemProps) {

  // Desestructuración de las propiedades para un acceso más fácil
  const { accountName, balance, customBackgroundColor, customColor } = props;

  return (
    <div
      className="accounts__account-container"
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
    >
      <p>{accountName}</p>
      <span>{balance}</span>
    </div>
  );
}

// Validación de tipos de propiedades usando PropTypes
AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  customBackgroundColor: PropTypes.string.isRequired,
  customColor: PropTypes.string.isRequired,
};

export default AccountItem;
