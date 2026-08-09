import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-forest-green hover:bg-opacity-95 text-surface shadow-sm focus:ring-forest-green',
    outline: 'border border-line-border bg-surface text-ink hover:bg-alt-bg focus:ring-line-border',
    quiet: 'bg-alt-bg text-ink hover:bg-line-border focus:ring-line-border',
    terracotta: 'bg-terracotta hover:bg-opacity-90 text-surface shadow-sm focus:ring-terracotta',
    text: 'text-forest-green hover:bg-green-soft hover:bg-opacity-40 focus:ring-forest-green'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
