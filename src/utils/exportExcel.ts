import * as XLSX from 'xlsx';
import { Member, LeaveEntry } from '../types';

interface ExportParams {
  members: Member[];
  leaves: LeaveEntry[];
  year: number;
}

// 선택한 캘린더 연도(1/1~12/31) 기준으로 필터링
function filterLeavesByYear(leaves: LeaveEntry[], memberId: string, year: number) {
  return leaves
    .filter((l) => l.memberId === memberId && new Date(l.date).getFullYear() === year)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function leaveTypeLabel(type: 'full' | 'am' | 'pm') {
  return type === 'full' ? '연차' : type === 'am' ? '오전반차' : '오후반차';
}

function leaveDays(type: 'full' | 'am' | 'pm') {
  return type === 'full' ? 1 : 0.5;
}

export function exportLeaveToExcel({ members, leaves, year }: ExportParams) {
  const wb = XLSX.utils.book_new();

  // --- 요약 시트 ---
  const summaryData = members.map((member) => {
    const yearLeaves = filterLeavesByYear(leaves, member.id, year);
    const usedLeave = yearLeaves.reduce((sum, l) => sum + leaveDays(l.type), 0);

    const leaveDetail = yearLeaves
      .map((l) => `${l.date} (${leaveTypeLabel(l.type)})`)
      .join(', ');

    return {
      이름: member.name,
      입사일: member.joinDate,
      [`${year}년 사용 연차`]: usedLeave,
      '사용 내역': leaveDetail || '없음',
    };
  });

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 12 }, // 이름
    { wch: 12 }, // 입사일
    { wch: 16 }, // 사용 연차
    { wch: 60 }, // 사용 내역
  ];

  XLSX.utils.book_append_sheet(wb, summarySheet, '연차 요약');

  // --- 상세 시트 ---
  const memberMap = new Map(members.map((m) => [m.id, m.name]));
  const allYearLeaves = leaves
    .filter((l) => new Date(l.date).getFullYear() === year)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const detailData = allYearLeaves.map((leave) => ({
    이름: memberMap.get(leave.memberId) || '',
    날짜: leave.date,
    유형: leaveTypeLabel(leave.type),
    '차감 일수': leaveDays(leave.type),
  }));

  const detailSheet = XLSX.utils.json_to_sheet(
    detailData.length > 0 ? detailData : [{ 이름: '', 날짜: '', 유형: '', '차감 일수': '' }]
  );
  detailSheet['!cols'] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
  ];

  XLSX.utils.book_append_sheet(wb, detailSheet, '사용 내역');

  XLSX.writeFile(wb, `연차현황_${year}.xlsx`);
}

// 미리보기용 데이터 반환
export function getExportPreviewData(members: Member[], leaves: LeaveEntry[], year: number) {
  return members.map((member) => {
    const yearLeaves = filterLeavesByYear(leaves, member.id, year);
    const usedLeave = yearLeaves.reduce((sum, l) => sum + leaveDays(l.type), 0);
    return {
      name: member.name,
      joinDate: member.joinDate,
      usedLeave,
      leaves: yearLeaves.map((l) => ({
        date: l.date,
        type: l.type,
        label: leaveTypeLabel(l.type),
        days: leaveDays(l.type),
      })),
    };
  });
}
