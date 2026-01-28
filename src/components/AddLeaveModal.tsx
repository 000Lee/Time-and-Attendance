import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '../context/AppContext';
import { Toast } from './Toast';
import { LeaveType } from '../types';

interface AddLeaveModalProps {
  memberId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLeaveModal: React.FC<AddLeaveModalProps> = ({ memberId, open, onOpenChange }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState<LeaveType>('full');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { addLeave } = useApp();

  const handleSubmit = async () => {
    if (!date) {
      setToast({ open: true, title: '날짜를 선택해주세요', variant: 'error' });
      return;
    }

    setIsLoading(true);
    await addLeave(memberId, date, type);
    setIsLoading(false);

    setToast({ open: true, title: '연차가 추가되었습니다', variant: 'success' });
    setDate('');
    setType('full');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">연차 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-body text-foreground">
                날짜
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-body text-foreground">유형</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as LeaveType)}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="text-body-sm text-foreground cursor-pointer">
                      연차 (1일)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="am" id="am" />
                    <Label htmlFor="am" className="text-body-sm text-foreground cursor-pointer">
                      오전반차
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pm" id="pm" />
                    <Label htmlFor="pm" className="text-body-sm text-foreground cursor-pointer">
                      오후반차
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
            >
              {isLoading ? '추가 중...' : '추가하기'}
            </Button>
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