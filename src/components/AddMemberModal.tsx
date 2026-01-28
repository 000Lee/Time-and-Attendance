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
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { addMember } = useApp();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setToast({ open: true, title: '이름을 입력해주세요', variant: 'error' });
      return;
    }
    if (!joinDate) {
      setToast({ open: true, title: '입사일을 입력해주세요', variant: 'error' });
      return;
    }

    setIsLoading(true);
    await addMember(name.trim(), joinDate);
    setIsLoading(false);

    setToast({ open: true, title: '멤버가 추가되었습니다', variant: 'success' });
    setName('');
    setJoinDate('');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">멤버 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
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