import "./AccountItem.scss";

interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
  onClick: (accountId: string) => void;
  accountId: string;
}

function AccountItem(props: AccountItemProps) {
  const { accountName, balance, customColor, customBackgroundColor, onClick, accountId } = props;

  return (
    <div
      className="account-item"
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
      onClick={() => onClick(accountId)}
    >
      <div className="account-item__details">
        <div className="account-item__name">{accountName}</div>
        <div className="account-item__balance">
          {balance}
        </div>
      </div>
    </div>
  );
}

export default AccountItem;
