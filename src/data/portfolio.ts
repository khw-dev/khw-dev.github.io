export interface SectionMeta {
  id: string;
  label: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  muted?: boolean;
  detail?: string[];
  links?: TimelineLink[];
}

export interface TimelineLink {
  type: "github" | "external";
  label: string;
  href?: string;
}

export interface StackItem {
  label: string;
  color: string;
}

export interface ContactLink {
  label: string;
  href: string;
  icon: "instagram" | "mail" | "github" | "linkedin";
}

export const sections: SectionMeta[] = [
  { id: "hero", label: "홈" },
  { id: "intro", label: "소개" },
  { id: "history", label: "약력" },
  { id: "projects", label: "프로젝트" },
  { id: "character", label: "캐릭터" },
  { id: "contact", label: "연락처" },
];

export const devRatio = 70; // 개발자 / 디자이너 비율 (0 ~ 100)

export const topics = [
  { label: "# AI", width: 232 },
  { label: "# Web", width: 210 },
  { label: "# App", width: 262 },
  { label: "# Security", width: 128 },
];

export const programmingStacks: StackItem[] = [
  { label: "JavaScript", color: "var(--stack-javascript)" },
  { label: "Typescript", color: "var(--stack-typescript)" },
  { label: "Python", color: "var(--stack-python)" },
  { label: "C/C++", color: "var(--stack-cpp)" },
  { label: "Swift", color: "var(--stack-swift)" },
  { label: "Rust", color: "var(--stack-rust)" },
  { label: "Kotlin", color: "var(--stack-kotlin)" },
];

export const databaseStacks: StackItem[] = [
  { label: "MongoDB", color: "var(--stack-mongodb)" },
  { label: "MySQL", color: "var(--stack-mysql)" },
  { label: "PostgreSQL", color: "var(--stack-postgresql)" },
];

export const timeline: TimelineItem[] = [
  {
    date: "2024.03",
    title: "전북과학고등학교 34기 입학",
    muted: true,
  },
  {
    date: "2024.07",
    title: "제2회 SW·AI Challenge 1위 (전북특별자치도 도지사상)",
    detail: [
      "스미싱 피해를 예방하기 위해 모델이 한국어 스팸 문자를 인식하도록 파인 튜닝한 후, 스팸 문자를 분류하고 사용자에게 경고하는 서비스를 개발했어요.",
      "4인 팀으로 출전한 대회에서 [ 데이터 수집, 모델 파인 튜닝, 발표 ] 역할을 맡아 리더로서 팀을 이끌었어요.",
    ],
  },
  {
    date: "2025.08",
    title: "CCE 사이버공격방어대회 예선 11위",
    muted: true,
  },
  {
    date: "2025.08",
    title: "전북대학교 오디세우스 프로그램 수료",
    detail: [
      '예방접종, 진료, 산책 등 반려동물의 건강/생활 정보가 분산되어 체계적으로 관리되기 어렵다는 문제를 해결하기 위해 안드로이드 애플리케이션 "P.PET"을 개발했어요.',
      "반려동물의 이름, 나이, 품종, 체중과 같은 기본 정보를 등록하는 프로필 기능과 예방접종 이력 및 다음 접종 일정 관리, 현재 위치를 기반으로 한 주변 동물병원 탐색 기능을 탐재하고 있어요.",
      "또한 산책, 사료 급여 등의 활동을 퀘스트와 포인트로 구성하여 사용자가 지속적으로 돌봄에 참여하도록 유도했답니다.",
      "5인 팀으로 활동하며 [ 앱 디자인, 앱 개발, 발표 ] 역할을 도맡아 리더로서 팀을 이끌었어요.",
    ],
    links: [
      {
        type: "github",
        label: "Odysseus-Renewal",
        href: "https://github.com/khw-dev/Odysseus-Renewal",
      },
    ],
  },
  {
    date: "2025.09",
    title: "전국과학전람회 '산업 및 에너지 (SW·IT 융합 분야 포함)' 부문 장려상",
    detail: [
      "생성형 인공지능과 문서 자동화 기술이 발전하면서 공개된 PDF가 작성자의 의사와 관계없이 학습 데이터로 수집되거나 자동 분석될 수 있다는 문제에 주목했어요.",
      "그리고 사람이 문서를 읽을 때의 가독성과 전체적인 형태는 유지하면서, 인공지능의 텍스트 추출, ocr, 이미지 이해 성능은 저하시키는 PDF 난독화 시스템을 연구하고 이를 Python 기반 프로그램으로 구현하게 되었어요.",
      "3인 팀으로 출전한 대회에서 [ 개발, 발표 ] 역할을 맡아 팀을 이끌었어요.",
    ],
    links: [
      {
        type: "github",
        label: "ScienceFair_Final",
        href: "https://github.com/khw-dev/ScienceFair_Final",
      },
    ],
  },
  {
    date: "2025.10",
    title: "미래융합 인재 발굴 소프트웨어 챌린지 본선 진출",
    detail: [
      "개인정보 처리방침은 사용자의 권리를 보장하는 중요한 문서이지만 분량이 길고 법률 표현이 복잡해 실제로 내용을 모두 확인하기 어렵다는 문제를 겪었어요.",
      "Chrome 확장 프로그램의 Manifest V3 구조를 적용하여 현재 탭에서 개인정보 처리방침 본문을 직접 추출하고 분석하도록 구현했고, 기준에 따라 점수를 부여하도록 했어요.",
      "3인 팀으로 출전한 대회에서 [ 아이디어 제공, 개발, 발표 자료 제작, 발표 ] 역할을 도맡아 리더로서 팀을 이끌었어요.",
    ],
  },
  {
    date: "2025.10",
    title: "한국코드페어 SW 해커톤 2위 (과학기술정보통신부 장관상)",
    detail: [
      "청소년층이 감정 표현을 하지 못해 발생하는 우울증, 극단적 선택 등을 예방하기 위하여 이모티콘 클릭만으로 현재 감정을 기록하는 '바이브티콘 (Vibe티콘)'을 개발했어요.",
      "특히 일기처럼 긴 글을 작성하는 것에 부담을 느낄 수 있어 클릭 한 번이면 현재 감정을 기록할 수 있게 했고, 시간대별로 감정 지정이 가능해서 하루 동안의 감정 기복도 모니터링 할 수 있는 기능도 제공해요.",
      "AI 기술을 활용해 일별, 주별, 월별 감정 통계를 내주고 각 단계에 맞는 감정 조언을 해주는 시스템도 구현했어요.",
      "팀으로 출전한 대회에서 [ 아이디어 제공, 프론트엔드 디자인, 개발, 발표 자료 제작, 발표 ] 역할을 도맡아 리더로서 팀을 이끌었어요.",
    ],
  },
  {
    date: "2026.02",
    title: "피싱·스캠 예방을 위한 서비스 개발 경진대회 예선 1위",
    detail: [
      "QR 코드를 악용한 피싱 수법인 '큐싱'을 분석하고, URL 위험도 분석과 워터마크 검증을 포함한 예방 서비스를 개발했어요.",
      "QR 코드에서 추출한 URL의 신고 이력을 조회하고, 머신러닝 모델 API를 연동해 피싱 확률과 위험도를 제공하도록 구현했어요.",
      "HMAC-SHA256 기반으로 워터마크 패턴을 생성하고, 이미지에서 추출한 패턴과의 유사도를 비교해 위조 여부를 검증하도록 설계했어요.",
      "개인으로 출전한 대회에서 [ 문제 정의, 개발, 발표 자료 제작, 발표 ] 과정을 혼자 수행했어요.",
    ],
    links: [
      {
        type: "external",
        label: "https://qr.1soom.xyz",
        href: "https://qr.1soom.xyz",
      },
    ],
  },
  {
    date: "2026.06",
    title: "한국통신학회 하계종합학술발표회 (with KENTECH)",
    detail: [
      "npm 패키지의 공급망 공격을 사전에 예방하기 위해 기존 탐지 방식에서 오탐을 줄이는 방법을 연구했어요.",
      "의존성 변경 전후 버전을 서로 비교하고, lifecycle script에서 위험 API까지 이어지는 경로를 추적해 설치 과정에서 실행 가능한 경로인지 분석하도록 설계했어요.",
      "위험 API 인자까지 이어지는 경로를 경량 taint 분석으로 확인해, 추가 검토가 필요한 업데이트를 선별하는 필터를 검증하고자 했어요.",
      "팀으로 참여해 [ 아이디어 제공, 개발, 발표 자료 제작, 발표 ] 역할을 도맡아 리더로서 팀을 이끌었어요.",
      "* KENTECH 소속 연구원분들과 함께 논문을 작성했어요.",
    ],
    links: [
      {
        type: "github",
        label: "npm-supply-chain-guard",
        href: "https://github.com/kentech-stis-lab/npm-supply-chain-guard",
      },
      {
        type: "external",
        label: "DBpia 논문집",
        href: "https://www.dbpia.co.kr/journal/voisDetail?voisId=VOIS00822083d",
      },
    ],
  },
  {
    date: "2026.06",
    title: "문화체육관광 인공지능데이터 활용 공모전",
    muted: true,
  },
  {
    date: `${new Date().getFullYear()}.xx`,
    title: "다양한 활동을 이어나가고 있어요 :)",
    muted: true,
  },
];

export interface ProjectItem {
  title: string;
  date: string;
  image?: string;
  description: string[];
  links?: ProjectLink[];
}

export interface ProjectLink {
  type: "github" | "external";
  label: string;
  href: string;
}

export const projects: ProjectItem[] = [
  {
    title: "준비 중이에요.",
    date: "-",
    description: ["본격적으로 운영하는 서비스가 생길 경우 작성할 예정이에요."],
    links: [
      // {
      //   type: "github",
      //   label: "비공개 레포지토리",
      //   href: "https://github.com/khw-dev",
      // },
      // {
      //   type: "external",
      //   label: "서비스 보기",
      //   href: "https://khw.dev",
      // },
    ],
  },
];

export const contacts: ContactLink[] = [
  {
    label: "@khw.dev",
    href: "https://www.instagram.com/khw.dev/",
    icon: "instagram",
  },
  { label: "me@khw.dev", href: "mailto:me@khw.dev", icon: "mail" },
  {
    label: "https://github.com/khw-dev",
    href: "https://github.com/khw-dev",
    icon: "github",
  },
  {
    label: "https://linkedin.com/in/khwdev",
    href: "https://linkedin.com/in/khwdev",
    icon: "linkedin",
  },
];

export const externalButtons = [
  {
    label: "Blog 보러가기",
    href: "https://khw.dev/blog",
  },
  {
    label: "Playground 보러가기",
    href: "https://khw.dev/playground",
  },
];
