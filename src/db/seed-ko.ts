/**
 * Korean translations for the demo content. The public site falls back to the
 * English value whenever a Korean field is empty, so these are optional.
 */

type AreaKorean = {
  titleKo: string;
  taglineKo: string;
  summaryKo: string;
  overviewKo: string;
  objectivesKo: string[];
  methodologiesKo: string[];
};

export const areaKorean: Record<string, AreaKorean> = {
  "neuromorphic-circuit-design": {
    titleKo: "뉴로모픽 회로 설계",
    taglineKo: "소자 물리부터 아키텍처까지, 뇌를 닮은 실리콘",
    summaryKo:
      "생물학적 뉴런과 시냅스의 스파이크 동역학을 모사하는 혼성 신호·디지털 회로를 설계하여, 마이크로와트 전력으로 상시 동작하는 추론을 구현합니다.",
    overviewKo:
      "뉴로모픽 연구는 첨단 CMOS 공정의 소형 뉴런·시냅스 기본 소자, 멤리스터 소자 특성 분석, 이벤트 기반 온칩 통신 구조, 그리고 그 위에서 동작하는 학습 규칙까지 아우릅니다. 소자 물리 연구진 및 알고리즘 연구진과 긴밀히 협력하여, 불일치·누설·컨덕턴스 드리프트와 같은 실리콘 수준의 비이상성을 테이프아웃 이전에 모델링하고 아키텍처에서 보상합니다.\n\n현재 실리콘 세대는 누설 적분 발화 뉴런과 프로그램 가능한 시냅스 배열, 비동기 주소 이벤트 라우팅을 통합합니다. 파이썬 기반 거동 시뮬레이션, 트랜지스터 수준 검증, 레이아웃 이후 전력·면적 모델링을 연결한 폐루프 설계 흐름을 통해 한 학기 안에 새로운 가속기 개념을 반복 설계할 수 있습니다.",
    objectivesKo: [
      "상시 동작 엣지 추론을 위한 시냅스당 피코줄 이하 기본 소자 개발",
      "혼성 신호 학습 회로에서 소자 비이상성의 모델링과 보상",
      "멀티코어 배열을 위한 확장 가능하고 교착 없는 주소 이벤트 라우팅 구조 구현",
      "뉴로모픽 연구 공동체를 위한 공개·재현 가능한 참조 설계 제공",
    ],
    methodologiesKo: [
      "28nm 및 65nm CMOS 공정의 Cadence Virtuoso 회로·레이아웃 설계",
      "뉴런·시냅스 동역학의 Spectre/AMS 공동 시뮬레이션",
      "알고리즘-하드웨어 공동 설계를 위한 Brian2 및 Nengo 거동 모델링",
      "PVT 코너 전반의 레이아웃 이후 몬테카를로 분석",
      "테이프아웃 이전 디지털 스파이킹 구조의 FPGA 프로토타이핑",
    ],
  },
  "rf-analog-circuit-design": {
    titleKo: "RF 및 아날로그 회로 설계",
    taglineKo: "가장 미세한 신호를 듣는 프런트엔드",
    summaryKo:
      "신경 신호 기록, 레이더 센싱, 무선 전력 임플란트 소자를 위한 저잡음 증폭기, 믹서, 데이터 변환기를 설계합니다.",
    overviewKo:
      "RF 및 아날로그 그룹은 잡음, 선형성, 전력을 신중하게 맞바꾸는 에너지 효율적인 프런트엔드를 개발합니다. 60GHz 센싱용 광대역 저잡음 증폭기, 마이크로볼트 신경 신호용 초퍼 안정화 증폭기, 그리고 뉴로모픽 코어와 결합하는 축차 근사 ADC를 연구합니다.\n\n모든 설계는 측정으로 검증합니다. 연구실은 프로브 스테이션, 67GHz 벡터 네트워크 분석기, 잡음 지수와 위상 잡음을 측정하는 차폐 벤치를 갖추고 있어, 제작 후 수 주 안에 시뮬레이션과 실리콘을 동일한 벤치에서 비교할 수 있습니다.",
    objectivesKo: [
      "밀리미터파 센싱을 위한 1dB 이하 잡음 지수 수신기 설계",
      "채널당 10µW 이하의 신경 기록 프런트엔드 구현",
      "변환 병목을 제거하기 위한 데이터 변환기와 이벤트 기반 연산의 공동 설계",
      "모든 실리콘 시제품과 함께 전체 측정 데이터 공개",
    ],
    methodologiesKo: [
      "67GHz까지의 로드풀 및 잡음 파라미터 특성 분석",
      "ADS와 HFSS를 이용한 전자기 공동 시뮬레이션",
      "생체전위 증폭기를 위한 초퍼 안정화 및 오프셋 제거",
      "상관 이중 샘플링 기반 SAR ADC 구조",
    ],
  },
  "fpga-circuit-and-image-analysis": {
    titleKo: "FPGA 회로 및 영상 분석",
    taglineKo: "실시간 영상 처리를 위한 재구성 가능한 하드웨어",
    summaryKo:
      "이벤트 기반 비전, 실시간 영상 분할, 결정론적 인지 파이프라인을 FPGA와 임베디드 소프트웨어로 구현합니다.",
    overviewKo:
      "FPGA 그룹은 알고리즘을 실시간 하드웨어로 옮기는 일을 합니다. 스트리밍 영상 분할, 이벤트 카메라 인터페이스, 신경망 가속기용 메모리 계층을 연구하며, 합성 가능한 RTL 라이브러리를 연구실 전체가 공유합니다.\n\n설계는 카메라에서 결과까지의 지연 시간을 기준으로 평가합니다. 120fps에서 4ms 이하의 지연을 목표로 하며, 호스트 소프트웨어와 하드웨어를 함께 최적화합니다.",
    objectivesKo: [
      "120fps 실시간 영상 분할을 위한 스트리밍 파이프라인 구현",
      "이벤트 카메라와 스파이킹 분류기를 연결하는 인터페이스 개발",
      "합성 가능한 재사용 RTL 라이브러리 구축",
      "하드웨어-소프트웨어 공동 최적화 방법론 정립",
    ],
    methodologiesKo: [
      "Zynq 플랫폼 기반 스트리밍 아키텍처 설계",
      "고수준 합성(HLS)과 RTL 혼합 설계 흐름",
      "DDR4 캡처와 듀얼 카메라 인터페이스 통합",
      "프레임 단위 지연 시간 및 처리량 측정",
    ],
  },
  "robotics-control-circuit-design": {
    titleKo: "로보틱스 제어 회로 설계",
    taglineKo: "결정론적 제어를 위한 전력 전자",
    summaryKo:
      "스파이킹 정책이 1kHz로 로봇을 제어할 수 있도록 GaN 모터 드라이버와 결정론적 제어 루프를 설계합니다.",
    overviewKo:
      "로보틱스 그룹은 전력 전자와 제어 회로를 함께 설계합니다. GaN 기반 모터 드라이버, 1kHz 제어 루프, 하드웨어-인-더-루프 테스트베드를 통해 스파이킹 정책을 실제 로봇에서 검증합니다.\n\n모든 제어 주기는 측정으로 확인합니다. 최악 조건의 루프 지터와 정션 온도를 기록하고, 현장 주행 데이터와 함께 공개합니다.",
    objectivesKo: [
      "1kHz 스파이킹 제어 루프를 위한 결정론적 하드웨어 구현",
      "고효율 GaN 모터 드라이버 설계",
      "하드웨어-인-더-루프 테스트베드 구축",
      "실제 환경에서 보행 및 조작 성능 검증",
    ],
    methodologiesKo: [
      "GaN 전력단 설계 및 열 특성 분석",
      "실시간 제어 루프 지터 측정",
      "ROS 2 기반 소프트웨어 브리지",
      "야외 주행 및 조작 실험",
    ],
  },
};

type MemberKorean = {
  nameKo: string;
  designationKo: string;
  bioKo?: string;
  interestsKo?: string[];
  alumniPositionKo?: string;
};

export const memberKorean: Record<string, MemberKorean> = {
  "ayesha-rahman": {
    nameKo: "아예샤 라만",
    designationKo: "교수 · NCDL 소장",
    bioKo:
      "아예샤 라만은 NCDL을 이끌며 전자·전기공학과 교수로 재직하고 있습니다. 소자 물리와 컴퓨터 아키텍처의 경계에서 연구하며, 특히 마이크로와트 영역에서 동작하는 스파이킹 가속기에 집중합니다. 지금까지 일곱 개의 테스트 칩을 테이프아웃했고, 열두 명의 박사 과정 학생을 지도하며, 대학원 아날로그 집적회로 설계 과목을 가르칩니다.\n\n학계로 돌아오기 전에는 임플란트 의료기기용 데이터 변환기를 설계하며 산업계에서 4년을 보냈고, 이 경험은 지금도 '시뮬레이션이 아닌 측정'을 고집하는 연구실 문화의 바탕이 되고 있습니다.",
    interestsKo: ["뉴로모픽 컴퓨팅", "혼성 신호 VLSI", "저전력 SoC", "멤리스터 소자"],
  },
  "markus-lindqvist": {
    nameKo: "마르쿠스 린드크비스트",
    designationKo: "교수 · RF 및 아날로그 IC 설계",
    interestsKo: ["밀리미터파 회로", "저잡음 증폭기", "데이터 변환기", "전자기 공동 시뮬레이션"],
  },
  "tanvir-hasan": {
    nameKo: "탄비르 하산",
    designationKo: "부교수 · 임베디드 시스템",
    interestsKo: ["FPGA 아키텍처", "임베디드 비전", "고수준 합성", "실시간 시스템"],
  },
  "sadia-islam": {
    nameKo: "사디아 이슬람",
    designationKo: "박사 과정 · 뉴로모픽 소자",
    interestsKo: ["멤리스터 시냅스", "온칩 학습", "소자 모델링"],
  },
  "rezaul-karim": {
    nameKo: "레자울 카림",
    designationKo: "박사 과정 · 스파이킹 가속기",
    interestsKo: ["온칩 네트워크", "스파이킹 아키텍처", "디지털 VLSI"],
  },
  "wei-chen": {
    nameKo: "웨이 천",
    designationKo: "박사 과정 · 이벤트 기반 비전",
    interestsKo: ["이벤트 카메라", "센서 인터페이스", "뉴로모픽 비전"],
  },
  "nusrat-jahan": {
    nameKo: "누스라트 자한",
    designationKo: "박사 과정 · 로보틱스 제어 하드웨어",
    interestsKo: ["모터 제어", "전력 전자", "족형 로봇"],
  },
  "arif-mahmud": {
    nameKo: "아리프 마흐무드",
    designationKo: "석사 과정 · 아날로그 프런트엔드",
    interestsKo: ["생체전위 증폭기", "저잡음 설계"],
  },
  "farhana-akter": {
    nameKo: "파르하나 악테르",
    designationKo: "석사 과정 · FPGA 비전",
    interestsKo: ["FPGA", "영상 분할", "고수준 합성"],
  },
  "rakib-hossain": {
    nameKo: "라키브 호세인",
    designationKo: "석사 과정 · RF 설계",
    interestsKo: ["밀리미터파 저잡음 증폭기", "레이더 센싱"],
  },
  "linh-nguyen": {
    nameKo: "린 응우옌",
    designationKo: "석사 과정 · 뉴로모픽 센싱",
    interestsKo: ["뉴로모픽 후각", "센서 회로"],
  },
  "tahsin-ahmed": {
    nameKo: "타신 아흐메드",
    designationKo: "석사 과정 · 로봇 전자",
    interestsKo: ["ROS 2", "전력단", "임베디드 펌웨어"],
  },
  "imran-chowdhury": {
    nameKo: "임란 초우두리",
    designationKo: "박사 2023",
    alumniPositionKo: "박사후 연구원, ETH 취리히",
    interestsKo: ["극저온 CMOS", "스파이킹 패브릭"],
  },
  "priya-nair": {
    nameKo: "프리야 나이르",
    designationKo: "박사 2022",
    alumniPositionKo: "아날로그 설계 엔지니어, 텍사스 인스트루먼트",
    interestsKo: ["데이터 변환기", "정밀 아날로그"],
  },
  "sabbir-ahmed": {
    nameKo: "사비르 아흐메드",
    designationKo: "석사 2024",
    alumniPositionKo: "박사 과정, TU 델프트",
    interestsKo: ["온칩 네트워크", "FPGA 프로토타이핑"],
  },
  "elena-petrova": {
    nameKo: "엘레나 페트로바",
    designationKo: "박사 2021",
    alumniPositionKo: "조교수, 자그레브 대학교",
    interestsKo: ["멤리스터", "차세대 메모리"],
  },
  "mahmudul-hasan": {
    nameKo: "마흐무둘 하산",
    designationKo: "석사 2023",
    alumniPositionKo: "FPGA 엔지니어, AMD",
    interestsKo: ["RTL 설계", "컴퓨터 비전"],
  },
};

type NewsKorean = {
  titleKo: string;
  excerptKo: string;
  contentKo: string;
};

export const newsKorean: Record<string, NewsKorean> = {
  "ncdl-spark-tapeout-returns": {
    titleKo: "NCDL-SPARK 테스트 칩, 28nm 셔틀에서 귀환",
    excerptKo:
      "16개의 스파이킹 코어와 4MB 시냅스 SRAM, 계층형 이벤트 라우터가 첫 실리콘에서 정상 동작했습니다.",
    contentKo:
      "연구실의 열여섯 번째 테스트 칩 NCDL-SPARK가 이번 주 파운드리에서 돌아왔고, 첫 브링업에서 정상 동작을 확인했습니다. 이 다이는 16개의 스파이킹 코어, 4MB의 시냅스 SRAM, 그리고 레자울 카림 그룹이 개발한 계층형 주소 이벤트 라우터를 통합합니다.\n\n초기 측정 결과 47mW에서 초당 1.1×10⁹ 시냅스 이벤트를 처리했으며, 이는 레이아웃 이전 추정치보다 약간 우수한 값입니다. 온칩 활동 카운터가 1Gb/s 직렬 링크로 데이터를 전송하므로, 전체 키워드 스포팅 벤치마크를 일주일이 아니라 반나절 만에 특성화할 수 있습니다.\n\n연구팀은 5월 ISCAS에서 상세 결과를 발표할 예정이며, 전체 특성화 보고서와 측정 스크립트도 논문과 함께 공개합니다.",
  },
  "best-paper-award-iscas-2026": {
    titleKo: "IEEE ISCAS 2026 최우수 논문상 수상",
    excerptKo:
      "혼잡 인식 이벤트 라우팅 연구가 신경 시스템 및 응용 트랙에서 최우수 논문상을 받았습니다.",
    contentKo:
      "레자울 카림, 임란 초우두리, 아예샤 라만이 IEEE ISCAS 2026에서 \"전역 중재 없는 계층형 주소 이벤트 라우팅\"으로 최우수 논문상을 수상했습니다.\n\n이 논문은 중앙 중재기 없이 멀티코어 스파이킹 패브릭의 최악 조건 이벤트 지연을 제한하는 라우터를 제안합니다. 이는 이전 세대의 확장을 제한했던 병목을 해결합니다.\n\n실리콘 팀과 형식적 증명을 요구한 심사위원들께 감사드립니다.",
  },
  "winter-school-2026-announced": {
    titleKo: "뉴로모픽 하드웨어 설계 겨울학교 1월 개최",
    excerptKo:
      "회로 설계, 라우팅, FPGA 프로토타이핑을 다루는 5일 과정으로, 개발도상국 학생을 위한 장학금을 제공합니다.",
    contentKo:
      "여섯 번째 겨울학교가 2027년 1월 12일부터 16일까지 NCDL 건물에서 열립니다. 프로그램은 스파이킹 뉴런 회로, 이벤트 기반 라우팅, 시냅스 소자 특성 분석, FPGA 프로토타이핑을 다루며, 테이프아웃 준비가 된 참조 설계로 마무리됩니다.\n\n지난해에는 11개국에서 84명이 참가했습니다. 올해도 산업 파트너의 지원으로 개발도상국 학생 10명에게 항공료와 숙박을 포함한 전액 장학금을 제공합니다.\n\n지원 마감은 11월 30일이며, 간단한 이력서와 연구 관심사 한 문단을 연락처 페이지로 보내주시면 됩니다.",
  },
  "memristor-array-milestone": {
    titleKo: "멤리스터 배열, 백만 회 안정적 가중치 갱신 달성",
    excerptKo:
      "사디아 이슬람의 드리프트 보상 루프가 10⁶회 갱신 동안 분류 정확도를 1.4% 이내로 유지했습니다.",
    contentKo:
      "11개월 연속 운용 끝에 연구실의 64×64 HfO₂ 시냅스 배열이 드리프트 보상 루프를 켠 상태로 백만 회의 가중치 갱신을 완료했습니다. MNIST 기반 벤치마크에서 정확도는 초기 프로그램 기준 대비 1.4% 이내를 유지했습니다.\n\n이 결과는 IEEE Transactions on Electron Devices에 게재 승인되었으며, 이 규모에서 아날로그 온칩 학습에 제기되던 핵심 반론을 해소합니다.",
  },
  "quadruped-field-trial": {
    titleKo: "스파이킹 사족보행 로봇, 2km 자율 주행 완료",
    excerptKo:
      "자체 모터 제어 스택이 단일 배터리로 94분간 비포장 지형을 주행했습니다.",
    contentKo:
      "누스라트 자한의 스파이킹 보행 제어기가 지난달 캠퍼스 외곽 2km를 자율 주행했습니다. 로봇은 한 번의 충전으로 94분을 걸었고, 자체 GaN 드라이버 보드는 최고 접합 온도 68°C를 기록했습니다.\n\n이번 시험은 결정론적 제어 루프를 검증하기 위해 설계되었습니다. 경로에는 두 개의 급경사로와 자갈, 연마된 석재 구간이 포함되었으며, 보행 실패는 없었고 최악 조건 제어 루프 지터는 11µs로 기록되었습니다.",
  },
  "imec-collaboration-renewed": {
    titleKo: "imec과의 연구 협력 3년 연장",
    excerptKo:
      "첨단 CMOS 셔틀과 멤리스터 소자 스택에 대한 접근이 다음 두 세대 실리콘을 지원합니다.",
    contentKo:
      "NCDL과 imec이 연구 협력을 3년 더 연장했습니다. 이 협약으로 연구실은 첨단 CMOS 셔틀 런과 시냅스 특성 분석용 멤리스터 소자 스택에 접근할 수 있게 되었습니다.\n\n이번 연장으로 두 개의 공동 박사 과정이 신설되며, 한 명은 루벤에, 한 명은 다카에 기반을 두고 각 사이트에서 최소 6개월씩 연구합니다.",
  },
};

export const settingsKorean = {
  labNameKo: "뉴로모픽 칩 설계 연구실",
  institutionKo: "전기·전자공학과",
  taglineKo: "차세대 지능형 기계를 위한 뇌 모방 실리콘.",
  mottoKo: "뇌에서 배우고, 실리콘으로 구현한다.",
  missionKo:
    "NCDL은 생물학적 뇌의 연산 방식과 기계가 만들어지는 방식 사이의 간극을 좁히기 위해 존재합니다. 우리는 동전 전지 하나로 몇 달을 동작해야 하는 기기에 이벤트 기반의 에너지 비례 지능을 부여하는 맞춤형 집적회로, RF 프런트엔드, FPGA 시스템을 설계하며, 아이디어를 화이트보드에서 측정된 실리콘 다이까지 끌고 갈 수 있는 차세대 엔지니어를 양성합니다.",
  addressKo:
    "방글라데시 다카 1207, 대학 캠퍼스, 전기·전자공학과, 학술관 B동 402호",
  officeHoursKo: "일요일 – 목요일 · 09:00 – 17:00 (GMT+6)",
};

/** Keyed by the English position title. */
export const positionKorean: Record<
  string,
  { titleKo: string; descriptionKo: string }
> = {
  "PhD position — Spiking accelerator architecture": {
    titleKo: "박사과정 — 스파이킹 가속기 아키텍처",
    descriptionKo:
      "차세대 이벤트 기반 추론 패브릭을 설계하고 테이프아웃하며, 확장 가능한 라우팅과 온칩 학습 지원에 집중합니다.",
  },
  "PhD position — Analog front-ends for neural interfaces": {
    titleKo: "박사과정 — 신경 인터페이스용 아날로그 프런트엔드",
    descriptionKo:
      "10µW 이하 기록 프런트엔드와 데이터 변환기를 회로도부터 22nm 셔틀 런의 측정 실리콘까지 개발합니다.",
  },
  "Research Assistant — FPGA vision pipelines": {
    titleKo: "연구조교 — FPGA 비전 파이프라인",
    descriptionKo:
      "산업 검사 파트너를 위한 스트리밍 영상 처리 파이프라인을 RTL 라이브러리 팀과 함께 구축하고 검증합니다.",
  },
  "MSc thesis projects — rolling intake": {
    titleKo: "석사 학위 논문 주제 — 상시 모집",
    descriptionKo:
      "네 가지 연구 분야 전반에서 석사 논문을 지도합니다. 현재 주제로는 드리프트 인지 학습 회로, 이벤트 기반 레이더, GaN 모터 드라이브가 있습니다.",
  },
  "Summer internship — silicon bring-up": {
    titleKo: "여름 인턴십 — 실리콘 브링업",
    descriptionKo:
      "차기 테스트 칩의 브링업과 특성 분석을 지원하는 12주 유급 인턴십입니다.",
  },
};

type PublicationKorean = {
  titleKo: string;
  venueKo: string;
  abstractKo: string;
};

/** Keyed by the English title, which is unique in the archive. */
export const publicationKorean: Record<string, PublicationKorean> = {
  "A 16-Core Event-Driven Accelerator with Hierarchical Address-Event Routing": {
    titleKo: "계층형 주소 이벤트 라우팅을 갖춘 16코어 이벤트 기반 가속기",
    venueKo: "IEEE 고체회로 저널",
    abstractKo:
      "28nm 스파이킹 가속기로 47mW에서 초당 1.1×10⁹ 시냅스 이벤트를 처리하며, 전역 중재 없이 혼잡을 제한하는 계층형 라우터를 갖춥니다.",
  },
  "Drift-Compensated Weight Refresh for HfO₂ Memristive Synapse Arrays": {
    titleKo: "HfO₂ 멤리스터 시냅스 배열을 위한 드리프트 보상 가중치 리프레시",
    venueKo: "IEEE 전자소자 논문지",
    abstractKo:
      "10⁶회 가중치 갱신 동안 분류 정확도를 1.4% 이내로 유지하는 소형 드리프트 모델과 리프레시 스케줄을 제안합니다.",
  },
  "A 4.2 dB NF 60 GHz Current-Reuse LNA in 22 nm FDSOI": {
    titleKo: "22nm FDSOI 공정의 4.2dB 잡음지수 60GHz 전류 재사용 저잡음 증폭기",
    venueKo: "IEEE 마이크로파 이론 및 기법 논문지",
    abstractKo:
      "18mW에서 4.2dB 잡음지수와 19.6dB 이득을 달성하고 67GHz까지 온웨이퍼로 측정한 전류 재사용 캐스코드 저잡음 증폭기입니다.",
  },
  "Event-Triggered Radar Sensing for Always-On Edge Perception": {
    titleKo: "상시 동작 엣지 인지를 위한 이벤트 트리거 레이더 센싱",
    venueKo: "IEEE 센서 논문지",
    abstractKo:
      "변화 기반 샘플링이 검출 재현율 손실 없이 레이더 프런트엔드 듀티 사이클을 87% 줄임을 보입니다.",
  },
  "Streaming Segmentation on FPGA with Bounded Worst-Case Latency": {
    titleKo: "최악 조건 지연이 보장되는 FPGA 스트리밍 영상 분할",
    venueKo: "IEEE 회로 및 시스템 비디오 기술 논문지",
    abstractKo:
      "Zynq-7020에서 3.8ms 최악 조건 지연과 2.4W 보드 전력을 달성한 완전 스트리밍 분할 파이프라인입니다.",
  },
  "Sub-10 µW Chopper-Stabilised Front-End for 64-Channel Neural Recording": {
    titleKo: "64채널 신경 기록용 10µW 이하 초퍼 안정화 프런트엔드",
    venueKo: "IEEE 생체의료 회로 및 시스템 논문지",
    abstractKo:
      "10kHz 대역에서 1.7µVrms 입력 환산 잡음을 갖는 채널당 9.3µW 기록 프런트엔드입니다.",
  },
  "Deterministic 1 kHz Current Control for Spiking Locomotion Policies": {
    titleKo: "스파이킹 보행 정책을 위한 결정론적 1kHz 전류 제어",
    venueKo: "IEEE/ASME 메카트로닉스 논문지",
    abstractKo:
      "지터로 인한 보행 실패 없이 스파이킹 보행 정책을 실행하는 자체 GaN 드라이버와 실시간 루프를 제시합니다.",
  },
  "Compact Modelling of Conductance Drift in Resistive Synapses": {
    titleKo: "저항성 시냅스의 컨덕턴스 드리프트 소형 모델링",
    venueKo: "IEEE 나노기술 논문지",
    abstractKo:
      "300개 소자와 네 가지 온도에 걸쳐 피팅하고 폐루프 학습 실험으로 검증한 3변수 드리프트 모델입니다.",
  },
  "A 1 µs Timestamping Interface for Event Cameras": {
    titleKo: "이벤트 카메라용 1µs 타임스탬프 인터페이스",
    venueKo: "IEEE 센서 논문지",
    abstractKo:
      "패킷 오버헤드를 62% 줄이면서 이벤트 타이밍을 1µs 이내로 보존하는 인터페이스 ASIC입니다.",
  },
  "Hierarchical Address-Event Routing Without Global Arbitration": {
    titleKo: "전역 중재 없는 계층형 주소 이벤트 라우팅",
    venueKo: "IEEE 국제 회로 및 시스템 심포지엄 (ISCAS)",
    abstractKo:
      "16코어 스파이킹 패브릭에서 최악 조건 이벤트 지연을 제한하는 혼잡 인식 라우터입니다.",
  },
  "On-Chip Learning with Drift-Aware Synaptic Refresh": {
    titleKo: "드리프트 인지 시냅스 리프레시를 이용한 온칩 학습",
    venueKo: "IEEE 국제 전자소자 학술대회 (IEDM)",
    abstractKo:
      "64×64 멤리스터 배열에서 학습 에너지의 3.1%만 사용하는 리프레시 정책으로 인시츄 학습을 시연합니다.",
  },
  "Event-Driven Vision Pipeline on a Heterogeneous SoC": {
    titleKo: "이기종 SoC 상의 이벤트 기반 비전 파이프라인",
    venueKo: "ACM/SIGDA 국제 FPGA 심포지엄",
    abstractKo:
      "이벤트 인터페이스 ASIC과 FPGA 분류기를 결합해 추론당 1.2mJ를 달성했습니다.",
  },
  "A 67 GHz Characterisation Methodology for Neuromorphic Radar Front-Ends": {
    titleKo: "뉴로모픽 레이더 프런트엔드를 위한 67GHz 특성 분석 방법론",
    venueKo: "유럽 마이크로파 학술대회 (EuMC)",
    abstractKo:
      "60GHz에서 온웨이퍼 측정 불확도를 0.15dB로 줄이는 캘리브레이션 및 디임베딩 절차입니다.",
  },
  "Hardware-in-the-Loop Validation of Spiking Locomotion Controllers": {
    titleKo: "스파이킹 보행 제어기의 하드웨어-인-더-루프 검증",
    venueKo: "IEEE 국제 로보틱스 및 자동화 학술대회 (ICRA)",
    abstractKo:
      "12자유도 사족보행 로봇에 배치하기 전 스파이킹 정책에 실제 구동기 지연을 주입하는 테스트베드입니다.",
  },
  "Reusable RTL Blocks for Streaming Image Processing": {
    titleKo: "스트리밍 영상 처리를 위한 재사용 RTL 블록",
    venueKo: "IEEE 국제 회로 및 시스템 심포지엄 (ISCAS)",
    abstractKo:
      "형식적 지연 보장을 갖춘 검증된 스트리밍 비전 블록의 공개 라이브러리입니다.",
  },
  "A 12-bit SAR ADC with Correlated Double Sampling for Neural Interfaces": {
    titleKo: "신경 인터페이스용 상관 이중 샘플링 12비트 SAR ADC",
    venueKo: "IEEE 아시아 고체회로 학술대회 (A-SSCC)",
    abstractKo:
      "오프셋 제거를 위한 상관 이중 샘플링을 갖춘 12비트 250kS/s SAR ADC로 6.8µW를 소모합니다.",
  },
  "NCDL-SPARK: A 16-Core Spiking Inference SoC": {
    titleKo: "NCDL-SPARK: 16코어 스파이킹 추론 SoC",
    venueKo: "TSMC 28nm 실리콘 검증 · 다이 면적 9.4 mm²",
    abstractKo:
      "16세대 테스트 칩: 16개 스파이킹 코어, 4MB 시냅스 SRAM, 계층형 이벤트 라우터, 온칩 활동 카운터. 1.1×10⁹ 이벤트/s에서 47mW.",
  },
  "NCDL-ADC12: Low-Power SAR Converter Macro": {
    titleKo: "NCDL-ADC12: 저전력 SAR 변환기 매크로",
    venueKo: "GF 22nm FDX 실리콘 검증 · 다이 면적 0.36 mm²",
    abstractKo:
      "기준 버퍼를 내장한 12비트 250kS/s SAR ADC 매크로로 총 6.8µW를 소모하며 이후 세 설계에 사용되었습니다.",
  },
  "Winter School on Neuromorphic Hardware Design (5th edition)": {
    titleKo: "뉴로모픽 하드웨어 설계 겨울학교 (제5회)",
    venueKo: "5일 워크숍 · 11개국 84명 참가",
    abstractKo:
      "스파이킹 뉴런 회로, 이벤트 기반 라우팅, FPGA 프로토타이핑 실습과 테이프아웃 준비 참조 설계를 포함합니다.",
  },
  "mmWave Measurement Workshop for Graduate Students": {
    titleKo: "대학원생을 위한 밀리미터파 측정 워크숍",
    venueKo: "3일 워크숍 · 온웨이퍼 캘리브레이션 및 잡음 특성 분석",
    abstractKo:
      "SOLT 캘리브레이션, 디임베딩, 잡음지수 측정을 다루는 67GHz 프로브 스테이션 실습 교육입니다.",
  },
  "Best Paper Award — IEEE ISCAS 2026": {
    titleKo: "최우수 논문상 — IEEE ISCAS 2026",
    venueKo: "IEEE 국제 회로 및 시스템 심포지엄",
    abstractKo:
      "신경 시스템 트랙에서 \"전역 중재 없는 계층형 주소 이벤트 라우팅\"으로 수상했습니다.",
  },
  "Outstanding Student Design Award — A-SSCC 2023": {
    titleKo: "우수 학생 설계상 — A-SSCC 2023",
    venueKo: "IEEE 아시아 고체회로 학술대회",
    abstractKo:
      "학생 설계 경진대회에서 상관 이중 샘플링 12비트 SAR ADC로 수상했습니다.",
  },
};
