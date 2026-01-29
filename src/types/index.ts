// DB 테이블 타입
export interface DbGroup {
  id: string;
  code: string;
  created_at: string;
}

export interface DbMember {
  id: string;
  group_id: string;
  name: string;
  join_date: string;
  created_at: string;
}

export interface DbLeave {
  id: string;
  member_id: string;
  date: string;
  type: 'full' | 'am' | 'pm';
  created_at: string;
}

// 프론트엔드용 타입 (기존 호환)
export interface Member {
  id: string;
  name: string;
  joinDate: string;
}

export interface LeaveEntry {
  id: string;
  memberId: string;
  date: string;
  type: 'full' | 'am' | 'pm';
}

export interface Group {
  id: string;
  code: string;
  members: Member[];
  leaves: LeaveEntry[];
}

export type LeaveType = 'full' | 'am' | 'pm';

// DB 테이블 타입
export interface DbLeaveAdjustment {
  id: string;
  member_id: string;
  year: number;
  adjustment: number;
  created_at: string;
}

// 프론트엔드용 타입
export interface LeaveAdjustment {
  id: string;
  memberId: string;
  year: number;
  adjustment: number;
}