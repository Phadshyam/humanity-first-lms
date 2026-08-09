import React from 'react';

const MetricCard = ({ title, value, subtext, highlight = false, icon: Icon, iconBgClass = 'bg-emerald-50 text-emerald-600', className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold font-heading uppercase text-neutral-500 tracking-wider">{title}</h4>
        {Icon && (
          <div className={`p-2 rounded-full ${iconBgClass} shrink-0`}>
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="my-3">
        <div className={`text-3xl font-extrabold font-heading ${highlight ? 'text-emerald-700' : 'text-neutral-800'}`}>
          {value}
        </div>
      </div>

      {subtext && (
        <p className="text-xs text-neutral-500 flex items-center gap-1 font-sans font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
