import "./AccountItem.scss";

interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
  onClick: () => void;
}

function AccountItem(props: AccountItemProps) {
  const { accountName, balance, customBackgroundColor, customColor, onClick } = props;

  return (
    <div
      className="account__item"
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
      onClick={onClick}
    >
      <p>{accountName}</p>
      <span>{balance}</span>
    </div>
  );
}

export default AccountItem;
