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
  const { accountName, balance, customBackgroundColor, customColor, onClick, accountId } = props;

  return (
    <div
      className="account__item"
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
      onClick={() => onClick(accountId)}
    >
      <p>{accountName}</p>
      <span>{balance}</span>
    </div>
  );
}

export default AccountItem;
