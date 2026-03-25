import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { exportLeaveToExcel, getExportPreviewData } from '../utils/exportExcel';

export const Export: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const { group } = useApp();

  const previewData = group
    ? getExportPreviewData(group.members, group.leaves, year)
    : [];

  const totalUsed = previewData.reduce((sum, m) => sum + m.usedLeave, 0);

  const handleDownload = () => {
    if (!group) return;
    exportLeaveToExcel({
      members: group.members,
      leaves: group.leaves,
      year,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-h2 font-sans text-foreground mb-6">엑셀 다운로드</h1>

        {/* 컨트롤 영역 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label htmlFor="year-select" className="text-body text-foreground whitespace-nowrap">
              연도 선택
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 px-3 rounded-md border border-border bg-card text-foreground text-body-sm"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleDownload}
            className="bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
            disabled={!group?.members.length}
          >
            <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
            {year}년 연차현황 다운로드
          </Button>
        </div>

        {/* 미리보기 */}
        {!group?.members.length ? (
          <div className="bg-card rounded-lg shadow-md border border-border p-12 text-center">
            <p className="text-body text-muted-foreground">등록된 멤버가 없습니다</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-h4 font-sans text-foreground">미리보기</h2>
              <span className="text-body-sm text-muted-foreground">
                총 {totalUsed}일 사용
              </span>
            </div>

            {/* 데스크톱 테이블 */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-6 py-3 text-caption text-secondary-foreground font-medium">이름</th>
                    <th className="px-6 py-3 text-caption text-secondary-foreground font-medium">입사일</th>
                    <th className="px-6 py-3 text-caption text-secondary-foreground font-medium text-right">사용 연차</th>
                    <th className="px-6 py-3 text-caption text-secondary-foreground font-medium">사용 내역</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((member) => (
                    <tr key={member.name} className="border-b border-border last:border-b-0">
                      <td className="px-6 py-4 text-body text-foreground font-medium">{member.name}</td>
                      <td className="px-6 py-4 text-body-sm text-muted-foreground">{member.joinDate}</td>
                      <td className="px-6 py-4 text-body text-foreground text-right">{member.usedLeave}일</td>
                      <td className="px-6 py-4">
                        {member.leaves.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {member.leaves.map((l, i) => (
                              <span
                                key={i}
                                className={`text-caption px-2 py-0.5 rounded ${
                                  l.type === 'full'
                                    ? 'bg-primary/10 text-primary'
                                    : l.type === 'am'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-violet-100 text-violet-700'
                                }`}
                              >
                                {l.date} ({l.label})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-body-sm text-muted-foreground">없음</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="sm:hidden divide-y divide-border">
              {previewData.map((member) => (
                <div key={member.name} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-body text-foreground font-medium">{member.name}</span>
                    <span className="text-body-sm text-primary font-medium">{member.usedLeave}일 사용</span>
                  </div>
                  <p className="text-caption text-muted-foreground">입사일: {member.joinDate}</p>
                  {member.leaves.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.leaves.map((l, i) => (
                        <span
                          key={i}
                          className={`text-caption px-2 py-0.5 rounded ${
                            l.type === 'full'
                              ? 'bg-primary/10 text-primary'
                              : l.type === 'am'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-violet-100 text-violet-700'
                          }`}
                        >
                          {l.date} ({l.label})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-caption text-muted-foreground">사용 내역 없음</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
