import React, { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../context/AppContext';
import { Member } from '../types';
import { AddLeaveModal } from './AddLeaveModal';
import { Toast } from './Toast';

interface MemberDetailModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LeaveItemProps {
  leave: any;
  onDelete: (id: string) => void;
}

const LeaveItem: React.FC<LeaveItemProps> = ({ leave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState(leave.date);
  const [editedType, setEditedType] = useState(leave.type);
  const { group, setGroup } = useApp();

  const handleSave = () => {
    if (!group) return;

    const updatedLeaves = group.leaves.map(l =>
      l.id === leave.id
        ? { ...l, date: editedDate, type: editedType }
        : l
    );

    setGroup({
      ...group,
      leaves: updatedLeaves,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDate(leave.date);
    setEditedType(leave.type);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-secondary rounded-md p-3 space-y-3">
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            className="h-9 flex-1"
          />
          <select
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-card text-foreground text-body-sm"
          >
            <option value="full">연차</option>
            <option value="am">AM</option>
            <option value="pm">PM</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
          >
            저장
          </Button>
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="sm"
            className="h-8 bg-transparent text-secondary-foreground font-normal hover:bg-secondary-hover hover:text-secondary-foreground"
          >
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-secondary rounded-md p-3">
      <div className="flex items-center gap-3">
        <span className="text-body text-secondary-foreground">{leave.date}</span>
        <span
          className={`text-caption px-2 py-1 rounded ${
            leave.type === 'full'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          }`}
        >
          {leave.type === 'full' ? '연차' : leave.type === 'am' ? 'AM' : 'PM'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
          className="bg-transparent text-secondary-foreground font-normal hover:bg-secondary-hover hover:text-secondary-foreground"
        >
          수정
        </Button>
        <Button
          onClick={() => onDelete(leave.id)}
          variant="ghost"
          size="sm"
          className="bg-transparent text-error font-normal hover:bg-error/10 hover:text-error"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  open,
  onOpenChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJoinDate, setEditedJoinDate] = useState(member.joinDate);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { updateMember, deleteMember, getMemberLeaves, deleteLeave, group, setGroup } = useApp();

  const memberLeaves = getMemberLeaves(member.id);

  const handleSaveEdit = () => {
    if (!editedJoinDate) {
      setToast({ open: true, title: '입사일을 입력해주세요', variant: 'error' });
      return;
    }

    updateMember(member.id, { joinDate: editedJoinDate });
    setIsEditing(false);
    setToast({ open: true, title: '정보가 수정되었습니다', variant: 'success' });
  };

  const handleDeleteMember = () => {
    if (window.confirm(`${member.name} 멤버를 삭제하시겠습니까?`)) {
      deleteMember(member.id);
      setToast({ open: true, title: '멤버가 삭제되었습니다', variant: 'success' });
      setTimeout(() => onOpenChange(false), 500);
    }
  };

  const handleDeleteLeave = (leaveId: string) => {
    if (window.confirm('이 연차를 삭제하시겠습니까?')) {
      deleteLeave(leaveId);
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

            <div className="bg-tertiary rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-sans text-tertiary-foreground">연차 주기</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-transparent text-tertiary-foreground font-normal hover:bg-gray-200 hover:text-tertiary-foreground"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                  <span className="text-body text-tertiary-foreground">
                    {format(new Date(), 'yyyy년', { locale: ko })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-transparent text-tertiary-foreground font-normal hover:bg-gray-200 hover:text-tertiary-foreground"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-md p-4 text-center border border-border">
                  <p className="text-caption text-muted-foreground mb-1">총 연차</p>
                  <p className="text-h3 font-sans text-foreground">{member.totalLeave}</p>
                </div>
                <div className="bg-card rounded-md p-4 text-center border border-border">
                  <p className="text-caption text-muted-foreground mb-1">사용</p>
                  <p className="text-h3 font-sans text-foreground">{member.usedLeave}</p>
                </div>
                <div className="bg-card rounded-md p-4 text-center border border-border">
                  <p className="text-caption text-muted-foreground mb-1">남음</p>
                  <p className="text-h3 font-sans text-primary">{member.totalLeave - member.usedLeave}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-h4 font-sans text-foreground mb-3">사용 내역</h3>
              {memberLeaves.length === 0 ? (
                <p className="text-body-sm text-muted-foreground text-center py-8">
                  아직 사용한 연차가 없습니다
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {memberLeaves.map((leave) => (
                    <LeaveItem
                      key={leave.id}
                      leave={leave}
                      onDelete={handleDeleteLeave}
                    />
                  ))}
                </div>
              )}
            </div>

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
