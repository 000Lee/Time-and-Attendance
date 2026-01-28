import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { group } = useApp();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const leavesMap = useMemo(() => {
    if (!group) return new Map();
    
    const map = new Map<string, Array<{ memberId: string; memberName: string; type: string }>>();
    
    group.leaves.forEach(leave => {
      const member = group.members.find(m => m.id === leave.memberId);
      if (!member) return;
      
      if (!map.has(leave.date)) {
        map.set(leave.date, []);
      }
      map.get(leave.date)!.push({
        memberId: leave.memberId,
        memberName: member.name,
        type: leave.type,
      });
    });
    
    return map;
  }, [group]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card rounded-lg shadow-md border border-border p-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={handlePrevMonth}
              className="bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </Button>
            
            <h2 className="text-h2 font-sans text-foreground">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h2>
            
            <Button
              variant="ghost"
              onClick={handleNextMonth}
              className="bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div
                key={day}
                className={`text-center py-3 text-body-sm font-medium ${
                  index === 0 ? 'text-error' : index === 6 ? 'text-primary' : 'text-foreground'
                }`}
              >
                {day}
              </div>
            ))}

            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="min-h-24"></div>
            ))}

            {daysInMonth.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayLeaves = leavesMap.get(dateStr) || [];
              const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

              return (
                <div
                  key={dateStr}
                  className={`min-h-24 border border-border rounded-md p-2 transition-colors duration-200 ${
                    isToday ? 'bg-primary/5 border-primary' : 'bg-card hover:bg-secondary/30'
                  }`}
                >
                  <div className={`text-body-sm mb-2 ${isToday ? 'text-primary font-medium' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayLeaves.map((leave, idx) => (
                      <div
                        key={`${leave.memberId}-${idx}`}
                        className={`text-caption px-2 py-1 rounded truncate ${
                          leave.type === 'full'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-accent-foreground'
                        }`}
                        title={`${leave.memberName} - ${leave.type === 'full' ? '연차' : leave.type === 'am' ? 'AM' : 'PM'}`}
                      >
                        {leave.memberName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
