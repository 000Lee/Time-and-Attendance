import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '../context/AppContext';
import { LeaveType } from '../types';
import { Toast } from './Toast';

interface AddLeaveModalProps {
  memberId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLeaveModal: React.FC<AddLeaveModalProps> = ({
  memberId,
  open,
  onOpenChange,
}) => {
  const [date, setDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('full');
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { addLeave } = useApp();

  const handleSubmit = () => {
    if (!date) {
      setToast({ open: true, title: '날짜를 선택해주세요', variant: 'error' });
      return;
    }

    addLeave({
      memberId,
      date,
      type: leaveType,
    });

    setToast({ open: true, title: '연차가 추가되었습니다', variant: 'success' });
    setDate('');
    setLeaveType('full');
    setTimeout(() => onOpenChange(false), 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">연차 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="leaveDate" className="text-body text-foreground">
                날짜
              </Label>
              <Input
                id="leaveDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-body text-foreground">연차 종류</Label>
              <RadioGroup value={leaveType} onValueChange={(value) => setLeaveType(value as LeaveType)}>
                <div className="flex items-center space-x-3 bg-secondary rounded-md p-3">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="text-body text-secondary-foreground cursor-pointer flex-1">
                    연차 (1일)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-secondary rounded-md p-3">
                  <RadioGroupItem value="am" id="am" />
                  <Label htmlFor="am" className="text-body text-secondary-foreground cursor-pointer flex-1">
                    오전 반차 (0.5일)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-secondary rounded-md p-3">
                  <RadioGroupItem value="pm" id="pm" />
                  <Label htmlFor="pm" className="text-body text-secondary-foreground cursor-pointer flex-1">
                    오후 반차 (0.5일)
                  </Label>
                </div>
              </RadioGroup>
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
