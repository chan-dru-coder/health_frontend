import React from 'react';
import { Clock, CheckCircle2, XCircle, FileCheck2, Ban } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();

  let badgeClass = 'badge-pending';
  let Icon = Clock;
  let label = 'Pending';

  switch (normalized) {
    case 'accepted':
      badgeClass = 'badge-accepted';
      Icon = CheckCircle2;
      label = 'Accepted';
      break;
    case 'rejected':
      badgeClass = 'badge-rejected';
      Icon = XCircle;
      label = 'Rejected';
      break;
    case 'completed':
      badgeClass = 'badge-completed';
      Icon = FileCheck2;
      label = 'Completed';
      break;
    case 'cancelled':
      badgeClass = 'badge-cancelled';
      Icon = Ban;
      label = 'Cancelled';
      break;
    case 'pending':
    default:
      badgeClass = 'badge-pending';
      Icon = Clock;
      label = 'Pending';
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={14} />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
