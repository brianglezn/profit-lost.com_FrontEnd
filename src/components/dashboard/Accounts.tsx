import { useState } from 'react';

import './Accounts.css';

import AccountItem from './AccountItem.tsx';

function Accounts() {
  const [accountBgColor, setAccountBgColor] = useState('var(--color-orange)'); //setColor se usará para ponerle el color que el usuario quiera
  const [accountColor, setAccountColor] = useState('var(--color-white)'); //setColor se usará para ponerle el color que el usuario quiera

  const balanceValue = '4.100,75';
  const balanceAsFloat = parseFloat(balanceValue.replace(',', '.'));
  const isPositive = balanceAsFloat >= 0;

  function getPreviousMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Octr',
      'Nov',
      'Dec',
    ];
    return monthNames[previousMonth];
  }

  const previousMonth = getPreviousMonth();

  return (
    <>
      <section className='accounts'>
        <div className='accounts__main'>
          <h2>23.297,16 €</h2>
          <p className={isPositive ? 'positive-balance' : 'negative-balance'}>
            {isPositive ? `+${balanceValue}` : balanceValue}€{' '}
            <span>{previousMonth}</span>
          </p>
        </div>
        <div className='accounts__base'>
          <div className='accounts__base-text'>
            <p>Accounts</p>
            <span className='material-symbols-rounded'>new_window</span>
          </div>
          <div className='accounts__base-container'>
            <AccountItem
              accountName='ImaginBank'
              balance='13.715,56€'
              customBackgroundColor={accountBgColor}
              customColor={accountColor}
            />
            <AccountItem
              accountName='Abanca'
              balance='7.456,60€'
              customBackgroundColor={accountBgColor}
              customColor={accountColor}
            />
            <AccountItem
              accountName='Savings'
              balance='2.125€'
              customBackgroundColor={accountBgColor}
              customColor={accountColor}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Accounts;
