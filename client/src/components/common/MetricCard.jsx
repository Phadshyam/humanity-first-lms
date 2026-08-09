import React from 'react';

const MetricCard = ({ title, value, subtext, highlight = false, icon: Icon, className = '' }) => {
  return (
    <div className={`bg-surface p-6 rounded-2xl border border-line-border shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold font-heading uppercase text-muted-text tracking-wider">{title}</h4>
        {Icon && <Icon className="w-5 h-5 text-forest-green opacity-80" />}
      </div>

      <div className="my-3">
        <div className={`text-3xl font-extrabold font-heading ${highlight ? 'text-forest-green' : 'text-ink'}`}>
          {value}
        </div>
      </div>

      {subtext && (
        <p className="text-xs text-muted-text flex items-center gap-1 font-sans">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
