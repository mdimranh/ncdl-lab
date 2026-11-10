export type Locale = "en" | "ko";

export const LOCALE_COOKIE = "ncdl_locale";

export const localeLabels: Record<Locale, string> = { en: "EN", ko: "KOR" };

const en = {
  nav: {
    home: "Home",
    members: "Members",
    research: "Research",
    publications: "Publications",
    news: "News",
    contact: "Contact",
  },
  common: {
    readMore: "Read more",
    seeMore: "See more",
    contact: "Contact",
    viewAll: "View all",
    published: "Published",
    latest: "Latest",
    page: "Page",
    next: "Next",
    previous: "Prev",
    sortLatest: "Sort: Latest first",
    deadline: "Deadline",
  },
  home: {
    newsHighlights: "News highlights",
    newsHighlightsNote: "Recent activity from the laboratory",
    mottoKicker: "Lab motto",
    researchAreas: "Research areas",
    researchAreasNote:
      "Four research areas, each with its own objectives, projects and publications.",
    positions: "Open positions",
    positionsNote:
      "Postdoctoral researchers and MS / PhD students are welcome throughout the year.",
    latestNews: "Latest news",
    latestNewsNote: "Announcements, awards and results from the bench",
    joinUs: "Join the laboratory",
    joinBody:
      "Send a CV, transcripts and a short statement of interest. Every enquiry is read and answered.",
    positionsKo: {
      postdoc: "박사후 연구원",
      phd: "박사 과정",
      masters: "석사 과정",
      "research-assistant": "연구 조교",
      internship: "인턴",
    },
  },
  members: {
    title: "Members",
    intro:
      "Four groups make the laboratory: faculty, doctoral and master's researchers, alumni, and the institutions we work with.",
    tabs: {
      professor: "Professors",
      phdMasters: "PhD & Masters",
      alumni: "Alumni",
      collaborations: "Collaborations",
    },
    profile: {
      position: "Position",
      department: "Department",
      building: "Building",
      research: "Research",
      education: "Education",
      publications: "Publications",
      email: "Email",
      officePhone: "Office phone",
      contact: "Contact",
      joined: "Joined",
      noPublications: "Publications will be listed here as they are indexed.",
      interests: "Research interests",
    },
    empty: "No members are listed in this group yet.",
    collaborateTitle: "Work with us",
    collaborateBody:
      "We welcome joint proposals, student exchanges and shared fabrication runs.",
  },
  research: {
    title: "Research",
    intro:
      "Four research areas, each with its own page, projects and publications.",
    publishedOn: "Published",
    overview: "Overview",
    objectives: "Objectives",
    methodologies: "Methodologies",
    keyProjects: "Key projects",
    figures: "Figures & results",
    relatedPublications: "Related publications",
    noFigures: "Figures from this area will be added soon.",
    noProjects: "Projects for this area will be published soon.",
    noPublications: "No papers indexed for this area yet.",
    allAreas: "All research areas",
    discuss: "Discuss a collaboration",
    empty: "Research areas will be published soon.",
  },
  publications: {
    title: "Publications",
    intro:
      "Journal articles, conference papers, chip design records, workshops and the certificates our members have received.",
    journals: "Journals",
    conferences: "Conferences",
    chip: "Chip Design",
    workshops: "Workshops",
    certificates: "Certificates",
    search: "Search by title, author or venue",
    searchAction: "Search",
    clear: "Clear",
    doi: "DOI",
    pdf: "PDF",
    year: "Year",
    emptyTitle: "No records in this category yet",
    emptyBody: "Records added from the admin panel appear here immediately.",
    archiveNote: "Newest first, with earlier years available in the archive.",
    certificateGallery: "Certificate gallery",
  },
  news: {
    title: "News",
    intro: "Tape-outs, awards, field trials and announcements from the laboratory.",
    empty: "No news has been published yet.",
    more: "More news",
    gallery: "Photo gallery",
  },
  contact: {
    title: "Contact",
    intro:
      "Every way to reach the laboratory: address, phone, email, fax and the campus map.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    fax: "Fax",
    map: "Location",
    hours: "Office hours",
    gettingHere: "Getting here",
    applications: "Open positions",
    apply: "Apply",
    visit: "Arrange a visit",
    noPositions: "No positions are open right now. Speculative enquiries are welcome.",
    mapMissing: "Map location has not been configured yet.",
  },
  footer: {
    explore: "Explore",
    research: "Research",
    reach: "Contact",
    developedBy: "Developed by NCDL",
    rights: "All rights reserved.",
    admin: "Admin login",
  },
};

const ko: typeof en = {
  nav: {
    home: "홈",
    members: "구성원",
    research: "연구",
    publications: "논문실적",
    news: "소식",
    contact: "연락처",
  },
  common: {
    readMore: "자세히 보기",
    seeMore: "더 보기",
    contact: "연락하기",
    viewAll: "전체 보기",
    published: "게시일",
    latest: "최신",
    page: "페이지",
    next: "다음",
    previous: "이전",
    sortLatest: "정렬: 최신순",
    deadline: "마감",
  },
  home: {
    newsHighlights: "주요 소식",
    newsHighlightsNote: "연구실의 최근 활동",
    mottoKicker: "연구실 모토",
    researchAreas: "연구 분야",
    researchAreasNote:
      "네 개의 연구 분야가 각자의 목표와 프로젝트, 논문을 가지고 있습니다.",
    positions: "모집 분야",
    positionsNote:
      "박사후 연구원과 석·박사 과정 학생을 상시 모집합니다.",
    latestNews: "최신 소식",
    latestNewsNote: "공지, 수상 및 연구 성과",
    joinUs: "연구실 지원",
    joinBody:
      "이력서, 성적증명서, 간단한 연구 관심사를 보내주십시오. 모든 문의를 읽고 답변드립니다.",
    positionsKo: {
      postdoc: "박사후 연구원",
      phd: "박사 과정",
      masters: "석사 과정",
      "research-assistant": "연구 조교",
      internship: "인턴",
    },
  },
  members: {
    title: "구성원",
    intro:
      "교수진, 박사 및 석사 연구원, 동문, 그리고 함께 연구하는 기관으로 구성됩니다.",
    tabs: {
      professor: "교수진",
      phdMasters: "석·박사 과정",
      alumni: "동문",
      collaborations: "협력 기관",
    },
    profile: {
      position: "직위",
      department: "소속",
      building: "위치",
      research: "연구 분야",
      education: "학력",
      publications: "논문",
      email: "이메일",
      officePhone: "사무실 전화",
      contact: "연락처",
      joined: "합류",
      noPublications: "논문은 색인되는 대로 이곳에 표시됩니다.",
      interests: "연구 관심 분야",
    },
    empty: "아직 등록된 구성원이 없습니다.",
    collaborateTitle: "함께 연구하기",
    collaborateBody:
      "공동 연구 제안, 학생 교류, 공동 제작을 환영합니다.",
  },
  research: {
    title: "연구",
    intro: "네 개의 연구 분야가 각각의 페이지와 프로젝트, 논문을 가지고 있습니다.",
    publishedOn: "게시일",
    overview: "개요",
    objectives: "연구 목표",
    methodologies: "연구 방법",
    keyProjects: "주요 프로젝트",
    figures: "그림 및 결과",
    relatedPublications: "관련 논문",
    noFigures: "이 분야의 그림은 곧 추가될 예정입니다.",
    noProjects: "이 분야의 프로젝트는 곧 게시될 예정입니다.",
    noPublications: "아직 이 분야의 논문이 등록되지 않았습니다.",
    allAreas: "전체 연구 분야",
    discuss: "협력 논의하기",
    empty: "연구 분야가 곧 게시될 예정입니다.",
  },
  publications: {
    title: "논문실적",
    intro:
      "저널 논문, 학술대회 발표, 칩 설계 실적, 워크숍 및 구성원이 받은 인증서를 정리했습니다.",
    journals: "저널",
    conferences: "학술대회",
    chip: "칩 설계",
    workshops: "워크숍",
    certificates: "인증서",
    search: "제목, 저자 또는 학술지로 검색",
    searchAction: "검색",
    clear: "초기화",
    doi: "DOI",
    pdf: "PDF",
    year: "연도",
    emptyTitle: "이 분류에는 아직 실적이 없습니다",
    emptyBody: "관리자 페이지에서 추가하면 즉시 표시됩니다.",
    archiveNote: "최신순으로 정렬되며, 이전 연도는 아카이브에서 확인할 수 있습니다.",
    certificateGallery: "인증서 갤러리",
  },
  news: {
    title: "소식",
    intro: "칩 제작, 수상, 현장 실험 및 연구실의 주요 발표를 전합니다.",
    empty: "아직 게시된 소식이 없습니다.",
    more: "다른 소식",
    gallery: "사진 갤러리",
  },
  contact: {
    title: "연락처",
    intro: "주소, 전화, 이메일, 팩스 및 캠퍼스 지도로 연구실에 연락하실 수 있습니다.",
    address: "주소",
    phone: "전화",
    email: "이메일",
    fax: "팩스",
    map: "위치",
    hours: "사무실 운영 시간",
    gettingHere: "오시는 길",
    applications: "모집 분야",
    apply: "지원하기",
    visit: "방문 예약",
    noPositions: "현재 모집 중인 분야가 없습니다. 자유로운 문의를 환영합니다.",
    mapMissing: "지도 위치가 아직 설정되지 않았습니다.",
  },
  footer: {
    explore: "둘러보기",
    research: "연구 분야",
    reach: "연락처",
    developedBy: "Developed by NCDL",
    rights: "All rights reserved.",
    admin: "관리자 로그인",
  },
};

const dictionaries: Record<Locale, typeof en> = { en, ko };

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Prefer the Korean value when the visitor is reading in Korean and it exists. */
export function localized(
  locale: Locale,
  english: string,
  korean?: string | null,
): string {
  const value = (korean ?? "").trim();
  return locale === "ko" && value.length > 0 ? value : english;
}

export function localizedList(
  locale: Locale,
  english: string[],
  korean?: string[] | null,
): string[] {
  return locale === "ko" && korean && korean.length > 0 ? korean : english;
}
