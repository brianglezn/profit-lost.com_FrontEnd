import PropTypes from "prop-types";

import "./AccountItem.css";

interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
}

AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  customBackgroundColor: PropTypes.string.isRequired,
  customColor: PropTypes.string.isRequired,
};

function AccountItem(props: AccountItemProps) {

  const { accountName, balance, customBackgroundColor, customColor } = props;

  return (
    <>
      <div
        className="accounts__account-container"
        style={{ backgroundColor: customBackgroundColor, color: customColor }}
      >
        <p>{accountName}</p>
        <span>{balance}</span>
      </div>
    </>
  );
}

export default AccountItem;
