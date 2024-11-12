import React from 'react';

import DragIndicatorIcon from '../../../../components/icons/DragIndicatorIcon';

import './AccountItem.scss';

interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
  onClick: (accountId: string) => void;
  accountId: string;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  draggable: boolean;
}

export default function AccountItem({
  accountName,
  balance,
  customBackgroundColor,
  customColor,
  onClick,
  accountId,
  onDragStart,
  onDragOver,
  onDrop,
  draggable,
}: AccountItemProps) {
  return (
    <div
      className='account-item'
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
      onClick={() => onClick(accountId)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className='account-item__details'>
        {/* Icon to indicate that the item can be dragged */}
        <DragIndicatorIcon className='account-item__drag-icon' />
        {/* Display the account name */}
        <div className='account-item__name'>{accountName}</div>
        {/* Display the account balance */}
        <div className='account-item__balance'>{balance}</div>
      </div>
    </div>
  );
}
