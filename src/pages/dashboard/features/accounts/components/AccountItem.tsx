import React from 'react';

import { formatCurrency } from '../../../../../helpers/functions';
import { useUser } from '../../../../../context/useUser';

import DragIndicatorIcon from '../../../../../components/icons/DragIndicatorIcon';

import './AccountItem.scss';

interface AccountItemProps {
  accountName: string;
  balance: number;
  customBackgroundColor: string;
  customColor: string;
  onClick: (accountId: string) => void;
  accountId: string;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  draggable?: boolean;
  isInactive: boolean;
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
  isInactive
}: AccountItemProps) {
  const { user } = useUser();

  return (
    <div
      className={`account-item ${isInactive ? 'account-item--inactive' : ''}`}
      style={{ backgroundColor: customBackgroundColor, color: customColor }}
      onClick={() => onClick(accountId)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className='account-item__details'>
        <DragIndicatorIcon className='account-item__drag-icon' />
        <div className='account-item__name'>{accountName}</div>
        <div className='account-item__balance'>
          {formatCurrency(balance, user?.currency || 'USD')}
        </div>
      </div>
    </div>
  );
}
