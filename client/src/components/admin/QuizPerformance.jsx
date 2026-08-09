import React from 'react';
import { ClipboardCheck, HelpCircle } from 'lucide-react';

const QuizPerformance = ({ moduleStats = [] }) => {
  return (
    <div className="bg-[#FFFDF7] p-6 rounded-2xl border border-[#D4CEC0] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold font-heading text-[#24302B] flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-[#176B4D]" /> Quiz performance
        </h3>
        <span className="text-xs font-mono text-[#5C665F] font-bold uppercase">NETWORK PASS RATES</span>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {moduleStats && moduleStats.length > 0 ? (
          moduleStats.map((item, idx) => {
            const attempts = item.attempts !== undefined ? item.attempts : (item.attemptsCount || 0);
            const avgScore = item.averageScore !== undefined ? item.averageScore : (item.averageScorePercent || 0);

            return (
              <div
                key={item.moduleId || idx}
                className="p-3.5 rounded-xl bg-[#F5F1E8] border border-[#D4CEC0] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <h4 className="font-bold font-heading text-[#24302B] truncate">{item.title}</h4>
                  <p className="text-[11px] font-mono text-[#5C665F] flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-[#C96B3C]" /> {attempts} {attempts === 1 ? 'attempt' : 'attempts'} recorded
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold font-heading text-[#176B4D] px-2.5 py-0.5 rounded-lg bg-[#D8E8DD]">
                    {avgScore}%
                  </span>
                  <span className="text-[9px] font-mono text-[#5C665F] block uppercase pt-0.5">Avg Score</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-[#5C665F] bg-[#F5F1E8] rounded-xl border border-[#D4CEC0]">
            No quiz attempts recorded in the network yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPerformance;
