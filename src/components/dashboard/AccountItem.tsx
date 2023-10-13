import PropTypes from "prop-types";

interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
}

function AccountItem(props: AccountItemProps) {
  const { accountName, balance, customBackgroundColor, customColor } = props;

  return (
    <div
      className="accounts__base-container-account"
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
    >
      <p>{accountName}</p>
      <span>{balance}</span>
    </div>
  );
}

AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  customBackgroundColor: PropTypes.string.isRequired,
  customColor: PropTypes.string.isRequired,
};

export default AccountItem;
