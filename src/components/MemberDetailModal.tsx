import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../context/AppContext';
import { Member } from '../types';
import { AddLeaveModal } from './AddLeaveModal';
import { Toast } from './Toast';
import {
  getCurrentLeavePeriod,
  getLeavePeriodByOffset,
  calculateTotalLeave,
  calculateUsedLeave,
  formatPeriod,
  LeavePeriod,
} from '../utils/leaveCalculator';

interface MemberDetailModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  open,
  onOpenChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJoinDate, setEditedJoinDate] = useState(member.joinDate);
  const [periodOffset, setPeriodOffset] = useState(0);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { updateMember, deleteMember, getMemberLeaves, deleteLeave, getLeaveAdjustment, setLeaveAdjustment } = useApp();

  // 현재 보고 있는 연차 주기
  const currentPeriod = getLeavePeriodByOffset(member.joinDate, periodOffset);
  const baseLeave = calculateTotalLeave(member.joinDate, currentPeriod.year);
  const adjustment = getLeaveAdjustment(member.id, currentPeriod.year);
  const totalLeave = baseLeave + adjustment;

  // 조정값 편집 상태
  const [isEditingAdjustment, setIsEditingAdjustment] = useState(false);
  const [editedAdjustment, setEditedAdjustment] = useState(adjustment.toString());

  // 년차가 변경되면 조정값 입력 초기화
  useEffect(() => {
    setEditedAdjustment(adjustment.toString());
    setIsEditingAdjustment(false);
  }, [periodOffset, adjustment]);

  const handleSaveAdjustment = async () => {
    const newAdjustment = parseInt(editedAdjustment, 10);
    if (isNaN(newAdjustment)) {
      setToast({ open: true, title: '올바른 숫자를 입력해주세요', variant: 'error' });
      return;
    }
    await setLeaveAdjustment(member.id, currentPeriod.year, newAdjustment);
    setIsEditingAdjustment(false);
    setToast({ open: true, title: '조정값이 저장되었습니다', variant: 'success' });
  };
  
  // 해당 주기의 연차만 필터링
  const allLeaves = getMemberLeaves(member.id);
  const periodLeaves = allLeaves.filter(leave => {
    const leaveDate = new Date(leave.date);
    return leaveDate >= currentPeriod.startDate && leaveDate <= currentPeriod.endDate;
  });
  const usedLeave = calculateUsedLeave(allLeaves, currentPeriod);
  const remainingLeave = totalLeave - usedLeave;

  const handlePrevPeriod = () => {
    if (currentPeriod.year > 1) {
      setPeriodOffset(periodOffset - 1);
    }
  };

  const handleNextPeriod = () => {
    const nextPeriod = getLeavePeriodByOffset(member.joinDate, periodOffset + 1);
    if (nextPeriod.startDate <= new Date()) {
      setPeriodOffset(periodOffset + 1);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedJoinDate) {
      setToast({ open: true, title: '입사일을 입력해주세요', variant: 'error' });
      return;
    }

    await updateMember(member.id, { joinDate: editedJoinDate });
    setIsEditing(false);
    setToast({ open: true, title: '정보가 수정되었습니다', variant: 'success' });
  };

  const handleDeleteMember = async () => {
    if (window.confirm(`${member.name} 멤버를 삭제하시겠습니까?`)) {
      await deleteMember(member.id);
      setToast({ open: true, title: '멤버가 삭제되었습니다', variant: 'success' });
      setTimeout(() => onOpenChange(false), 500);
    }
  };

  const handleDeleteLeave = async (leaveId: string) => {
    if (window.confirm('이 연차를 삭제하시겠습니까?')) {
      await deleteLeave(leaveId);
      setToast({ open: true, title: '연차가 삭제되었습니다', variant: 'success' });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-h2 text-foreground">{member.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 입사일 섹션 */}
            <div className="flex items-center justify-between bg-secondary rounded-lg p-4">
              {isEditing ? (
                <div className="flex-1 flex items-center gap-3">
                  <Label htmlFor="editJoinDate" className="text-body text-secondary-foreground">
                    입사일:
                  </Label>
                  <Input
                    id="editJoinDate"
                    type="date"
                    value={editedJoinDate}
                    onChange={(e) => setEditedJoinDate(e.target.value)}
                    className="h-9 max-w-xs"
                  />
                  <Button
                    onClick={handleSaveEdit}
                    size="sm"
                    className="h-9 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
                  >
                    저장
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedJoinDate(member.joinDate);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-transparent text-secondary-foreground font-normal hover:bg-secondary-hover hover:text-secondary-foreground"
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-body text-secondary-foreground">
                    입사일: {member.joinDate}
                  </p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    size="sm"
                    className="bg-transparent text-secondary-foreground font-normal hover:bg-secondary-hover hover:text-secondary-foreground"
                  >
                    수정
                  </Button>
                </>
              )}
            </div>

            {/* 연차 주기 섹션 */}
            <div className="bg-tertiary rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-sans text-tertiary-foreground">
                  {currentPeriod.year}년차
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevPeriod}
                    disabled={currentPeriod.year <= 1}
                    className="bg-transparent text-tertiary-foreground font-normal hover:bg-gray-200 hover:text-tertiary-foreground disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                  <span className="text-body-sm text-tertiary-foreground min-w-[180px] text-center">
                    {formatPeriod(currentPeriod)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPeriod}
                    className="bg-transparent text-tertiary-foreground font-normal hover:bg-gray-200 hover:text-tertiary-foreground"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-card rounded-md p-4 text-center border border-border">
                  <p className="text-caption text-muted-foreground mb-1">총 연차</p>
                  <p className="text-h3 font-sans text-foreground">{totalLeave}</p>
                </div>
                <div className="bg-card rounded-md p-4 text-center border border-border">
                  <p className="text-caption text-muted-foreground mb-1">사용</p>
                  <p className="text-h3 font-sans text-foreground">{usedLeave}</p>
                </div>
                <div className="bg-card rounded-md p-4 text-center border border-border">
                  <p className="text-caption text-muted-foreground mb-1">남음</p>
                  <p className="text-h3 font-sans text-primary">{remainingLeave}</p>
                </div>
              </div>

              {/* 연차 조정 섹션 */}
              <div className="bg-card rounded-md p-3 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-body-sm">
                    <span className="text-muted-foreground">기본 {baseLeave}일</span>
                    <span className="text-muted-foreground">+</span>
                    {isEditingAdjustment ? (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">조정</span>
                        <Input
                          type="number"
                          value={editedAdjustment}
                          onChange={(e) => setEditedAdjustment(e.target.value)}
                          className="h-8 w-16 text-center"
                        />
                        <span className="text-muted-foreground">일</span>
                        <Button
                          onClick={handleSaveAdjustment}
                          size="sm"
                          className="h-8 px-2 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
                        >
                          저장
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingAdjustment(false);
                            setEditedAdjustment(adjustment.toString());
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                        >
                          취소
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={adjustment !== 0 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                          조정 {adjustment >= 0 ? '+' : ''}{adjustment}일
                        </span>
                        <span className="text-muted-foreground">=</span>
                        <span className="text-foreground font-medium">총 {totalLeave}일</span>
                      </>
                    )}
                  </div>
                  {!isEditingAdjustment && (
                    <Button
                      onClick={() => setIsEditingAdjustment(true)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:text-foreground"
                    >
                      조정
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 사용 내역 섹션 */}
            <div>
              <h3 className="text-h4 font-sans text-foreground mb-3">사용 내역</h3>
              {periodLeaves.length === 0 ? (
                <p className="text-body-sm text-muted-foreground text-center py-8">
                  이 주기에 사용한 연차가 없습니다
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[...periodLeaves].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between bg-secondary rounded-md p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-body text-secondary-foreground">{leave.date}</span>
                        <span
                          className={`text-caption px-2 py-1 rounded ${
                            leave.type === 'full'
                              ? 'bg-primary text-primary-foreground'
                              : leave.type === 'am'
                              ? 'bg-amber-400 text-amber-900'
                              : 'bg-violet-300 text-violet-800'
                          }`}
                        >
                          {leave.type === 'full' ? '연차' : leave.type === 'am' ? '오전' : '오후'}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleDeleteLeave(leave.id)}
                        variant="ghost"
                        size="sm"
                        className="bg-transparent text-error font-normal hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 버튼 섹션 */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAddLeaveModal(true)}
                className="flex-1 h-11 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
              >
                <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
                연차 추가
              </Button>
              <Button
                onClick={handleDeleteMember}
                variant="destructive"
                className="flex-1 h-11 bg-destructive text-destructive-foreground font-normal hover:bg-destructive/90"
              >
                <Trash2 className="w-5 h-5 mr-2" strokeWidth={1.5} />
                멤버 삭제
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddLeaveModal
        memberId={member.id}
        open={showAddLeaveModal}
        onOpenChange={setShowAddLeaveModal}
      />

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
        title={toast.title}
        variant={toast.variant}
      />
    </>
  );
};