import "./AccountItem.scss";

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
      className="account__item"
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
    >
      <p>{accountName}</p>
      <span>{balance}</span>
    </div>
  );
}

export default AccountItem;
