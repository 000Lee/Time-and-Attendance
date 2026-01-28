export interface Member {
  id: string;
  name: string;
  joinDate: string;
  totalLeave: number;
  usedLeave: number;
}

export interface LeaveEntry {
  id: string;
  memberId: string;
  date: string;
  type: 'full' | 'am' | 'pm';
}

export interface Group {
  code: string;
  members: Member[];
  leaves: LeaveEntry[];
}

export type LeaveType = 'full' | 'am' | 'pm';
