export interface LeavePeriod {
  startDate: Date;
  endDate: Date;
  year: number; // 몇 년차인지
}

// 입사일 기준 현재 연차 주기 계산
export function getCurrentLeavePeriod(joinDate: string): LeavePeriod {
  const join = new Date(joinDate);
  const today = new Date();
  
  let periodStart = new Date(join);
  let year = 1;
  
  while (true) {
    const periodEnd = new Date(periodStart);
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    periodEnd.setDate(periodEnd.getDate() - 1);
    
    if (today <= periodEnd) {
      return {
        startDate: periodStart,
        endDate: periodEnd,
        year,
      };
    }
    
    periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() + 1);
    year++;
  }
}

// 특정 연차 주기 계산 (offset: 0=현재, -1=이전, 1=다음)
export function getLeavePeriodByOffset(joinDate: string, offset: number): LeavePeriod {
  const join = new Date(joinDate);
  const current = getCurrentLeavePeriod(joinDate);
  
  const targetYear = current.year + offset;
  if (targetYear < 1) {
    return current;
  }
  
  const startDate = new Date(join);
  startDate.setFullYear(startDate.getFullYear() + (targetYear - 1));
  
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  endDate.setDate(endDate.getDate() - 1);
  
  return {
    startDate,
    endDate,
    year: targetYear,
  };
}

// 한국 노동법 기준 연차 개수 계산
export function calculateTotalLeave(joinDate: string, periodYear: number): number {
  const join = new Date(joinDate);
  const today = new Date();
  
  const monthsDiff = (today.getFullYear() - join.getFullYear()) * 12 
    + (today.getMonth() - join.getMonth());
  
  // 1년 미만: 매월 1개 발생 (최대 11개)
  if (periodYear === 1 && monthsDiff < 12) {
    return Math.min(Math.max(monthsDiff, 0), 11);
  }
  
  // 1년 이상
  const workingYears = periodYear;
  
  if (workingYears <= 1) {
    return 15;
  }
  
  // 15개 + 2년마다 1개 추가 (최대 25개)
  const additionalLeave = Math.floor(workingYears / 2);
  return Math.min(15 + additionalLeave, 25);
}

// 사용한 연차 계산
export function calculateUsedLeave(
  leaves: Array<{ date: string; type: 'full' | 'am' | 'pm' }>,
  period: LeavePeriod
): number {
  return leaves
    .filter(leave => {
      const leaveDate = new Date(leave.date);
      return leaveDate >= period.startDate && leaveDate <= period.endDate;
    })
    .reduce((sum, leave) => {
      return sum + (leave.type === 'full' ? 1 : 0.5);
    }, 0);
}

// 날짜 포맷팅
export function formatPeriod(period: LeavePeriod): string {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  
  return `${formatDate(period.startDate)} ~ ${formatDate(period.endDate)}`;
}