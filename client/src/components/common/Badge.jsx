import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ role, variant, children, className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-mono';

  const roleStyles = {
    volunteer: 'bg-green-soft text-forest-green border border-forest-green/20',
    field_worker: 'bg-terracotta-soft text-terracotta border border-terracotta/20',
    trainer: 'bg-alt-bg text-ink border border-line-border',
    admin: 'bg-forest-green text-surface shadow-xs'
  };

  const selectedClass = role ? (roleStyles[role] || roleStyles.volunteer) : (variant || roleStyles.volunteer);

  return (
    <span className={twMerge(clsx(baseStyles, selectedClass, className))}>
      {children || role || 'volunteer'}
    </span>
  );
};

export default Badge;
