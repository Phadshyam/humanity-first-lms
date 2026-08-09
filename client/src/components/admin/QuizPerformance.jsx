import React from 'react';
import { ClipboardCheck, HelpCircle } from 'lucide-react';

const QuizPerformance = ({ moduleStats = [] }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-heading text-neutral-900 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-emerald-700" /> Quiz performance
        </h3>
        <span className="text-xs font-mono text-neutral-500 font-bold uppercase">NETWORK PASS RATES</span>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {moduleStats && moduleStats.length > 0 ? (
          moduleStats.map((item, idx) => {
            const attempts = item.attempts !== undefined ? item.attempts : (item.attemptsCount || 0);
            const avgScore = item.averageScore !== undefined ? item.averageScore : (item.averageScorePercent || 0);

            return (
              <div
                key={item.moduleId || idx}
                className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-bold font-heading text-neutral-900 truncate text-sm">{item.title}</h4>
                    <p className="text-xs font-sans text-neutral-500 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> {attempts} {attempts === 1 ? 'attempt' : 'attempts'} recorded
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold font-heading text-emerald-700 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      {avgScore}%
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase pt-0.5">Avg Score</span>
                  </div>
                </div>

                {/* Progress Visualizer Bar */}
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                    style={{ width: `${avgScore}%` }} 
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-200/80">
            No quiz attempts recorded in the network yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPerformance;
