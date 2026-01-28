import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { Toast } from '../components/Toast';

export const Login: React.FC = () => {
  const [groupCode, setGroupCode] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupCode, setNewGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; title: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    variant: 'success',
  });
  const { loginWithCode, createGroup } = useApp();
  const navigate = useNavigate();

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      setToast({ open: true, title: '그룹 코드를 입력해주세요', variant: 'error' });
      return;
    }

    setIsLoading(true);
    const success = await loginWithCode(groupCode.trim());
    setIsLoading(false);

    if (success) {
      navigate('/home');
    } else {
      setToast({ open: true, title: '존재하지 않는 그룹 코드입니다', variant: 'error' });
    }
  };

  const handleCreateGroup = async () => {
    setIsLoading(true);
    const code = await createGroup();
    setIsLoading(false);

    if (code) {
      setNewGroupCode(code);
      setShowNewGroupModal(true);
    } else {
      setToast({ open: true, title: '그룹 생성에 실패했습니다', variant: 'error' });
    }
  };

  const handleProceedToGroup = async () => {
    setIsLoading(true);
    const success = await loginWithCode(newGroupCode);
    setIsLoading(false);

    if (success) {
      setShowNewGroupModal(false);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-md border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary rounded-full p-4 mb-4">
              <Calendar className="w-8 h-8 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <h1 className="text-h2 font-sans text-foreground mb-2">연차관리</h1>
            <p className="text-body-sm text-muted-foreground text-center">
              팀의 연차를 간편하게 관리하세요
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="groupCode" className="text-body text-foreground">
                그룹 코드
              </Label>
              <Input
                id="groupCode"
                type="text"
                placeholder="그룹 코드를 입력하세요"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinGroup()}
                className="h-11"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleJoinGroup}
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
            >
              {isLoading ? '접속 중...' : '입장하기'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-body-sm">
                <span className="bg-card px-4 text-muted-foreground">또는</span>
              </div>
            </div>

            <Button
              onClick={handleCreateGroup}
              disabled={isLoading}
              variant="ghost"
              className="w-full h-11 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground"
            >
              {isLoading ? '생성 중...' : '새 그룹 만들기'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showNewGroupModal} onOpenChange={setShowNewGroupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">그룹이 생성되었습니다</DialogTitle>
            <DialogDescription className="text-body-sm text-muted-foreground">
              아래 그룹 코드를 팀원들과 공유하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-secondary rounded-lg p-6 text-center">
              <p className="text-body-sm text-secondary-foreground mb-2">그룹 코드</p>
              <p className="text-h2 font-sans text-secondary-foreground font-medium">{newGroupCode}</p>
            </div>
            <Button
              onClick={handleProceedToGroup}
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
            >
              {isLoading ? '접속 중...' : '시작하기'}
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
    </div>
  );
};