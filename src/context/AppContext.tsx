import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Group, Member, LeaveEntry } from '../types';

interface AppContextType {
  group: Group | null;
  setGroup: (group: Group | null) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addLeave: (leave: Omit<LeaveEntry, 'id'>) => void;
  deleteLeave: (id: string) => void;
  getMemberLeaves: (memberId: string) => LeaveEntry[];
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [group, setGroupState] = useState<Group | null>(() => {
    const stored = localStorage.getItem('annualLeaveGroup');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (group) {
      localStorage.setItem('annualLeaveGroup', JSON.stringify(group));
    } else {
      localStorage.removeItem('annualLeaveGroup');
    }
  }, [group]);

  const setGroup = (newGroup: Group | null) => {
    setGroupState(newGroup);
  };

  const addMember = (member: Omit<Member, 'id'>) => {
    if (!group) return;
    
    const newMember: Member = {
      ...member,
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setGroupState({
      ...group,
      members: [...group.members, newMember],
    });
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    if (!group) return;

    setGroupState({
      ...group,
      members: group.members.map(m => m.id === id ? { ...m, ...updates } : m),
    });
  };

  const deleteMember = (id: string) => {
    if (!group) return;

    setGroupState({
      ...group,
      members: group.members.filter(m => m.id !== id),
      leaves: group.leaves.filter(l => l.memberId !== id),
    });
  };

  const addLeave = (leave: Omit<LeaveEntry, 'id'>) => {
    if (!group) return;

    const newLeave: LeaveEntry = {
      ...leave,
      id: `leave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const member = group.members.find(m => m.id === leave.memberId);
    if (!member) return;

    const leaveValue = leave.type === 'full' ? 1 : 0.5;
    const updatedMembers = group.members.map(m =>
      m.id === leave.memberId
        ? { ...m, usedLeave: m.usedLeave + leaveValue }
        : m
    );

    setGroupState({
      ...group,
      members: updatedMembers,
      leaves: [...group.leaves, newLeave],
    });
  };

  const deleteLeave = (id: string) => {
    if (!group) return;

    const leave = group.leaves.find(l => l.id === id);
    if (!leave) return;

    const leaveValue = leave.type === 'full' ? 1 : 0.5;
    const updatedMembers = group.members.map(m =>
      m.id === leave.memberId
        ? { ...m, usedLeave: Math.max(0, m.usedLeave - leaveValue) }
        : m
    );

    setGroupState({
      ...group,
      members: updatedMembers,
      leaves: group.leaves.filter(l => l.id !== id),
    });
  };

  const getMemberLeaves = (memberId: string): LeaveEntry[] => {
    if (!group) return [];
    return group.leaves.filter(l => l.memberId === memberId);
  };

  const logout = () => {
    setGroupState(null);
  };

  return (
    <AppContext.Provider
      value={{
        group,
        setGroup,
        addMember,
        updateMember,
        deleteMember,
        addLeave,
        deleteLeave,
        getMemberLeaves,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
