import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { AddMemberModal } from '../components/AddMemberModal';
import { MemberDetailModal } from '../components/MemberDetailModal';
import { Member } from '../types';
import { getCurrentLeavePeriod, calculateTotalLeave, calculateUsedLeave } from '../utils/leaveCalculator';

export const Members: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { group, getMemberLeaves } = useApp();

  const getMemberStats = (member: Member) => {
    const period = getCurrentLeavePeriod(member.joinDate);
    const totalLeave = calculateTotalLeave(member.joinDate, period.year);
    const leaves = getMemberLeaves(member.id);
    const usedLeave = calculateUsedLeave(leaves, period);
    const remainingLeave = totalLeave - usedLeave;

    return { totalLeave, usedLeave, remainingLeave };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-h2 font-sans text-foreground">멤버관리</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
          >
            <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
            멤버 추가
          </Button>
        </div>

        {!group?.members.length ? (
          <div className="bg-card rounded-lg shadow-md border border-border p-12 text-center">
            <p className="text-body text-muted-foreground mb-4">아직 등록된 멤버가 없습니다</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-primary-foreground font-normal hover:bg-primary-hover"
            >
              첫 멤버 추가하기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.members.map((member) => {
              const stats = getMemberStats(member);
              
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="bg-card rounded-lg shadow-md border border-border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <h3 className="text-h3 font-sans text-foreground mb-2">{member.name}</h3>
                  <p className="text-body-sm text-muted-foreground mb-4">
                    입사일: {member.joinDate}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-secondary rounded-md p-3 text-center">
                      <p className="text-caption text-secondary-foreground mb-1">총 연차</p>
                      <p className="text-h4 font-sans text-secondary-foreground">{stats.totalLeave}</p>
                    </div>
                    <div className="bg-tertiary rounded-md p-3 text-center">
                      <p className="text-caption text-tertiary-foreground mb-1">사용</p>
                      <p className="text-h4 font-sans text-tertiary-foreground">{stats.usedLeave}</p>
                    </div>
                    <div className="bg-primary/10 rounded-md p-3 text-center">
                      <p className="text-caption text-primary mb-1">남음</p>
                      <p className="text-h4 font-sans text-primary">{stats.remainingLeave}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AddMemberModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
        />
      )}
    </div>
  );
};