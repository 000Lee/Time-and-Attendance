import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Group, Member, LeaveEntry, DbGroup, DbMember, DbLeave } from '../types';

interface AppContextType {
  group: Group | null;
  loading: boolean;
  loginWithCode: (code: string) => Promise<boolean>;
  createGroup: () => Promise<string | null>;
  addMember: (name: string, joinDate: string) => Promise<void>;
  updateMember: (id: string, updates: { name?: string; joinDate?: string }) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addLeave: (memberId: string, date: string, type: 'full' | 'am' | 'pm') => Promise<void>;
  deleteLeave: (id: string) => Promise<void>;
  getMemberLeaves: (memberId: string) => LeaveEntry[];
  logout: () => void;
  refreshData: () => Promise<void>;
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
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 저장된 그룹 코드로 자동 로그인
  useEffect(() => {
    const savedGroupCode = localStorage.getItem('groupCode');
    if (savedGroupCode) {
      loginWithCode(savedGroupCode).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 그룹 데이터 새로고침
  const refreshData = async () => {
    if (!group) return;
    
    const { data: members } = await supabase
      .from('members')
      .select('*')
      .eq('group_id', group.id);

    const { data: leaves } = await supabase
      .from('leaves')
      .select('*')
      .in('member_id', members?.map(m => m.id) || []);

    setGroup({
      ...group,
      members: (members || []).map(m => ({
        id: m.id,
        name: m.name,
        joinDate: m.join_date,
      })),
      leaves: (leaves || []).map(l => ({
        id: l.id,
        memberId: l.member_id,
        date: l.date,
        type: l.type,
      })),
    });
  };

  // 그룹 코드로 로그인
  const loginWithCode = async (code: string): Promise<boolean> => {
    const { data: groupData, error } = await supabase
      .from('groups')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !groupData) {
      return false;
    }

    const { data: members } = await supabase
      .from('members')
      .select('*')
      .eq('group_id', groupData.id);

    const memberIds = members?.map(m => m.id) || [];
    
    let leaves: DbLeave[] = [];
    if (memberIds.length > 0) {
      const { data: leavesData } = await supabase
        .from('leaves')
        .select('*')
        .in('member_id', memberIds);
      leaves = leavesData || [];
    }

    const newGroup: Group = {
      id: groupData.id,
      code: groupData.code,
      members: (members || []).map(m => ({
        id: m.id,
        name: m.name,
        joinDate: m.join_date,
      })),
      leaves: leaves.map(l => ({
        id: l.id,
        memberId: l.member_id,
        date: l.date,
        type: l.type,
      })),
    };

    setGroup(newGroup);
    localStorage.setItem('groupCode', code);
    return true;
  };

  // 새 그룹 생성
  const createGroup = async (): Promise<string | null> => {
    const code = `GROUP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('groups')
      .insert({ code })
      .select()
      .single();

    if (error || !data) {
      console.error('그룹 생성 실패:', error);
      return null;
    }

    return code;
  };

  // 멤버 추가
  const addMember = async (name: string, joinDate: string) => {
    if (!group) return;

    const { data, error } = await supabase
      .from('members')
      .insert({
        group_id: group.id,
        name,
        join_date: joinDate,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('멤버 추가 실패:', error);
      return;
    }

    setGroup({
      ...group,
      members: [...group.members, {
        id: data.id,
        name: data.name,
        joinDate: data.join_date,
      }],
    });
  };

  // 멤버 수정
  const updateMember = async (id: string, updates: { name?: string; joinDate?: string }) => {
    if (!group) return;

    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.joinDate) dbUpdates.join_date = updates.joinDate;

    const { error } = await supabase
      .from('members')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('멤버 수정 실패:', error);
      return;
    }

    setGroup({
      ...group,
      members: group.members.map(m =>
        m.id === id
          ? { ...m, ...updates }
          : m
      ),
    });
  };

  // 멤버 삭제
  const deleteMember = async (id: string) => {
    if (!group) return;

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('멤버 삭제 실패:', error);
      return;
    }

    setGroup({
      ...group,
      members: group.members.filter(m => m.id !== id),
      leaves: group.leaves.filter(l => l.memberId !== id),
    });
  };

  // 연차 추가
  const addLeave = async (memberId: string, date: string, type: 'full' | 'am' | 'pm') => {
    if (!group) return;

    const { data, error } = await supabase
      .from('leaves')
      .insert({
        member_id: memberId,
        date,
        type,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('연차 추가 실패:', error);
      return;
    }

    setGroup({
      ...group,
      leaves: [...group.leaves, {
        id: data.id,
        memberId: data.member_id,
        date: data.date,
        type: data.type,
      }],
    });
  };

  // 연차 삭제
  const deleteLeave = async (id: string) => {
    if (!group) return;

    const { error } = await supabase
      .from('leaves')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('연차 삭제 실패:', error);
      return;
    }

    setGroup({
      ...group,
      leaves: group.leaves.filter(l => l.id !== id),
    });
  };

  // 특정 멤버의 연차 목록
  const getMemberLeaves = (memberId: string): LeaveEntry[] => {
    if (!group) return [];
    return group.leaves.filter(l => l.memberId === memberId);
  };

  // 로그아웃
  const logout = () => {
    setGroup(null);
    localStorage.removeItem('groupCode');
  };

  return (
    <AppContext.Provider
      value={{
        group,
        loading,
        loginWithCode,
        createGroup,
        addMember,
        updateMember,
        deleteMember,
        addLeave,
        deleteLeave,
        getMemberLeaves,
        logout,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};