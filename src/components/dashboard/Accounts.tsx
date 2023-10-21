import { useState } from "react";

import "./Accounts.css";

import AccountItem from "./AccountItem.tsx";

function Accounts() {
  const [accountBgColor, setAccountBgColor] = useState("var(--color-orange)"); //setColor se usará para ponerle el color que el usuario quiera
  const [accountColor, setAccountColor] = useState("var(--color-white)"); //setColor se usará para ponerle el color que el usuario quiera

  const balanceValue = "4.100,75";
  const balanceAsFloat = parseFloat(balanceValue.replace(",", "."));
  const isPositive = balanceAsFloat >= 0;

  function getPreviousMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Octr",
      "Nov",
      "Dec",
    ];
    return monthNames[previousMonth];
  }

  const previousMonth = getPreviousMonth();

  // Data Accounts

  const accountsData: AccountData[] = [
    {
      accountName: "ImaginBank",
      balance: 13715.56,
      customBackgroundColor: "var(--color-orange)",
      customColor: "var(--color-white)",
    },
    {
      accountName: "Abanca",
      balance: 7456.6,
      customBackgroundColor: "var(--color-orange)",
      customColor: "var(--color-white)",
    },
    {
      accountName: "Savings",
      balance: 2125,
      customBackgroundColor: "var(--color-orange)",
      customColor: "var(--color-white)",
    },
  ];

  interface AccountData {
    accountName: string;
    balance: GLfloat;
    customBackgroundColor: string;
    customColor: string;
  }

  const accountItems = accountsData.map((account, index) => (
    <AccountItem
      key={index}
      accountName={account.accountName}
      balance={account.balance}
      customBackgroundColor={account.customBackgroundColor}
      customColor={account.customColor}
    />
  ));

  const totalBalance = accountsData
    .map((account) => account.balance)
    .reduce((acc, curr) => acc + curr, 0);

  const formattedTotalBalance = totalBalance.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <section className="accounts">
        <div className="accounts__main">
          <h2>{formattedTotalBalance} €</h2>
          <p className={isPositive ? "positive-balance" : "negative-balance"}>
            {isPositive ? `+${balanceValue}` : balanceValue}€{" "}
            <span>{previousMonth}</span>
          </p>
        </div>
        <div className="accounts__base">
          <div className="accounts__base-text">
            <p>Accounts</p>
            <span className="material-symbols-rounded">new_window</span>
          </div>
          <div className="accounts__base-container">{accountItems}</div>
        </div>
      </section>
    </>
  );
}

export default Accounts;
