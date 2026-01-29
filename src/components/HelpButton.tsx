import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export const HelpButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 플로팅 도움말 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="도움말"
      >
        <HelpCircle className="w-7 h-7" />
      </button>

      {/* 가이드 모달 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">사용 가이드</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            {/* Step 1 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 1: 그룹 만들기 (최초 1회)</h3>
              <p className="text-gray-600 mb-2">처음 사용하는 경우 새 그룹을 생성해야 합니다.</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>사이트 접속</li>
                <li>"새 그룹 만들기" 버튼 클릭</li>
                <li>생성 완료 → 초대 코드 자동 발급</li>
              </ol>
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                💡 초대 코드는 다른 사람이 같은 그룹에 참여할 때 필요합니다. 꼭 메모해 두세요!
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 2: 기존 그룹 참여하기 (선택)</h3>
              <p className="text-gray-600 mb-2">이미 만들어진 그룹에 참여하는 경우:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>사이트 접속</li>
                <li>"초대 코드로 참여" 선택</li>
                <li>받은 초대 코드 입력</li>
                <li>그룹 참여 완료</li>
              </ol>
            </section>

            {/* Step 3 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 3: 멤버 추가하기</h3>
              <p className="text-gray-600 mb-2">그룹에 직원/멤버를 등록합니다.</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>그룹 메인 화면에서 "멤버 추가" 클릭</li>
                <li>필수 정보 입력:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>이름: 직원 이름</li>
                    <li>입사일: YYYY-MM-DD 형식</li>
                  </ul>
                </li>
                <li>저장 클릭</li>
              </ol>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800">
                🎯 <strong>연차 자동 계산:</strong> 입사일 기준으로 근속연수에 따라 연차가 자동 계산됩니다!
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>1년 미만: 매월 1일씩 발생</li>
                  <li>1년 이상: 15일 + 2년마다 1일 추가</li>
                </ul>
              </div>
            </section>

            {/* Step 4 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 4: 휴가 등록하기</h3>
              <p className="text-gray-600 mb-2">직원의 연차/반차를 등록합니다.</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>멤버 목록에서 해당 직원 선택</li>
                <li>"휴가 등록" 버튼 클릭</li>
                <li>휴가 정보 입력:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>휴가 유형: 연차 / 오전반차 / 오후반차</li>
                    <li>날짜: 휴가 사용일</li>
                  </ul>
                </li>
                <li>등록 완료</li>
              </ol>
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800">
                📊 <strong>잔여 연차 자동 차감:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>연차: -1일</li>
                  <li>반차: -0.5일</li>
                </ul>
              </div>
            </section>

            {/* Step 5 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 5: 달력에서 휴가자 확인</h3>
              <p className="text-gray-600 mb-2">달력 화면에서 전체 휴가 현황을 한눈에 확인할 수 있습니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">색상</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">의미</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">🔴 빨간색</td>
                      <td className="border border-gray-300 px-3 py-2">연차 (종일 휴가)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">🟠 주황색</td>
                      <td className="border border-gray-300 px-3 py-2">오전반차</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">🟣 보라색</td>
                      <td className="border border-gray-300 px-3 py-2">오후반차</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>날짜 클릭 → 해당 날짜의 휴가자 목록 표시</li>
                <li>월별 이동으로 과거/미래 휴가 확인 가능</li>
              </ul>
            </section>

            {/* Step 6 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 6: 잔여 연차 확인</h3>
              <p className="text-gray-600 mb-2">멤버별 연차 현황을 확인합니다:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong>총 연차:</strong> 입사일 기준 자동 계산된 연간 연차</li>
                <li><strong>사용 연차:</strong> 등록된 휴가 일수 합계</li>
                <li><strong>잔여 연차:</strong> 총 연차 - 사용 연차</li>
              </ul>
            </section>

            {/* Step 7 */}
            <section>
              <h3 className="font-bold text-base mb-2">📌 Step 7: 연차 조정하기 (선택)</h3>
              <p className="text-gray-600 mb-2">특수한 상황에서 총 연차를 수동으로 조정할 수 있습니다.</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>멤버 목록에서 해당 직원 선택</li>
                <li>"조정" 버튼 클릭</li>
                <li>조정값 입력 (예: +2, -1)</li>
                <li>저장</li>
              </ol>
              <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-purple-800">
                💡 <strong>언제 사용하나요?</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>전년도 미사용 연차 이월 시 (+)</li>
                  <li>특별 휴가 부여 시 (+)</li>
                  <li>경조사 휴가 별도 지급 시 (+)</li>
                  <li>징계 등으로 연차 차감 시 (-)</li>
                </ul>
              </div>
              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                📊 <strong>계산 방식:</strong> 총 연차 = 기본 연차(자동 계산) + 조정값
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
