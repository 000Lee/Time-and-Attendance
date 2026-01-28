import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../context/AppContext';
import { Toast } from './Toast';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { addMember } = useApp();

  const calculateAnnualLeave = (joinDateStr: string): number => {
    const join = new Date(joinDateStr);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
    
    if (monthsDiff < 12) {
      return Math.floor(monthsDiff);
    }
    
    const years = Math.floor(monthsDiff / 12);
    return 15 + Math.min(years - 1, 10);
  };

  const handleSubmit = () => {
    if (!name.trim() || !joinDate) {
      setToast({ open: true, title: '모든 필드를 입력해주세요', variant: 'error' });
      return;
    }

    const totalLeave = calculateAnnualLeave(joinDate);

    addMember({
      name: name.trim(),
      joinDate,
      totalLeave,
      usedLeave: 0,
    });

    setToast({ open: true, title: '멤버가 추가되었습니다', variant: 'success' });
    setName('');
    setJoinDate('');
    setTimeout(() => onOpenChange(false), 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">멤버 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-body text-foreground">
                이름
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate" className="text-body text-foreground">
                입사일
              </Label>
              <Input
                id="joinDate"
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                className="flex-1 h-11 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
              >
                추가
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="ghost"
                className="flex-1 h-11 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
        title={toast.title}
        variant={toast.variant}
      />
    </>
  );
};
