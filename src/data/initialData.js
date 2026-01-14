export const initialStudyData = {
  user: {
    name: "Team 08",
    targetDate: "2026-11-19", // Expected CSAT 2026 date
    goalDescription: "정시 Team 08 레츠기릿 NO재수"
  },
  subjects: [
    {
      id: "korean",
      name: "국어",
      subSubjects: ["독서", "문학", "언어와 매체"],
      color: "#ef4444", // Red
      tasks: [
        { id: "k1", title: "박광일 국어 다지기 Text 완강", status: "completed", note: "노트필기 완료" },
        { id: "k2", title: "박광일 독기본서", status: "planned", note: "홀수 기출로 문제적용 훈련예정" },
        { id: "k3", title: "수능특강 독서 풀이", status: "todo", note: "강의 나오면 복습 및 분석 (3월까지 목표)" },
        { id: "k4", title: "수특 독서 주제 별 정리노트", status: "todo" },
        { id: "k5", title: "리미티드(박광일)", status: "todo" },
        { id: "k6", title: "박광일 훈련도감", status: "todo", note: "홀수 기출로 문제적용" },
        { id: "k7", title: "수특 문학작품 정리노트", status: "todo" },
        { id: "k8", title: "문학시간 단축훈련(박광일)", status: "todo" },
        { id: "k9", title: "마더텅 언매", status: "todo", note: "방학때 끝내기" },
        { id: "k10", title: "문법백제(박광일)", status: "todo" },
        { id: "k_final", title: "파이널 구주연마의 서", status: "todo" }
      ],
      routines: [
        { title: "아침 모의고사", frequency: "2주 1회", note: "아침에 풀기" }
      ]
    },
    {
      id: "math",
      name: "수학",
      subSubjects: ["수학1", "수학2", "확률과 통계"],
      color: "#3b82f6", // Blue
      tasks: [
        { id: "m1", title: "학산학원 커리큘럼", status: "in-progress" },
        { id: "m2", title: "한완수 수1 1회독", status: "completed" },
        { id: "m3", title: "한완수 수1 3개년 기출", status: "in-progress", note: "N회독 예정" },
        { id: "m4", title: "한완수 수2 1회독", status: "completed" },
        { id: "m5", title: "한완수 수2 3개년 기출", status: "in-progress", note: "N회독 예정" },
        { id: "m6", title: "한완수 확통 개념 1회독", status: "completed" },
        { id: "m7", title: "수능적 해법 (확통)", status: "todo" }
      ]
    },
    {
      id: "english",
      name: "영어",
      subSubjects: [],
      color: "#eab308", // Yellow
      tasks: [
        { id: "e1", title: "영어 과외", status: "in-progress", note: "시키는거 열심히 하기" },
        { id: "e2", title: "강성태 영단어 5회독", status: "in-progress" },
        { id: "e3", title: "수능 2000 3회독", status: "in-progress" },
        { id: "e4", title: "수능특강 26 영어듣기", status: "in-progress" },
        { id: "e5", title: "27 마더텅 영어독해", status: "in-progress" },
        { id: "e6", title: "27 마더텅 어법어휘", status: "in-progress" },
        { id: "e7", title: "천일문 완성 MASTER", status: "in-progress" }
      ]
    },
    {
      id: "inquiry",
      name: "탐구 (생윤/사문)",
      subSubjects: ["생활과 윤리", "사회문화"],
      color: "#22c55e", // Green
      tasks: [
        { id: "i1", title: "26 이지영 출제자의 눈 완강", status: "completed", note: "노트필기 완 (25년)" },
        { id: "i2", title: "27 출제자의 눈 수강", status: "in-progress", note: "토요일 3강 몰아듣기" },
        { id: "i3", title: "개념 워크북 + 진도개 복습", status: "in-progress", note: "평일 진행" },
        { id: "i4", title: "수능특강 풀이", status: "todo", note: "3월 초~말 예정" },
        { id: "i5", title: "심.기.일.전", status: "todo" },
        { id: "i6", title: "4-STEP 문제풀이", status: "todo" },
        { id: "i7", title: "파이널 샤프 모의고사", status: "todo" }
      ]
    }
  ],
  goals: {
    march: {
      korean: "90",
      math: "확통 만점 + 14,15,21,22 제외 만점",
      english: "85+",
      inquiry: "안정 2등급",
      history: "1등급"
    }
  }
};
