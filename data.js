/* ==========================================================
   📝 data.js : 홈페이지 내용 수정 파일
   ----------------------------------------------------------
   ✔ 이 파일만 고치면 홈페이지 내용이 바뀌어요.
   ✔ 따옴표("") 안의 글자만 바꿔 주세요.
   ✔ 따옴표, 쉼표(,), 중괄호({ }), 대괄호([ ])는 지우면 안 돼요!
     하나라도 지워지면 화면이 하얗게 나올 수 있어요.
   ========================================================== */


/* ==========================================================
   📁 이미지 / 음악 파일 경로 쓰는 법
   ----------------------------------------------------------
   이 파일에서 image, thumb, cover, file 처럼 "파일"을 적는 칸은
   모두 아래 방법 중 하나로 적으면 돼요.

   ① 파일을 index.html 과 같은 곳에 올렸을 때 → 파일 이름만
        image: "char1.png"

   ② 폴더를 만들어서 정리했을 때 → "폴더이름/파일이름"
        추천 폴더 구성 예시)
          index.html
          style.css
          data.js
          img/            ← 그림
            logo.png
            oc/           ← 폴더 안에 폴더도 가능
              char1.png
              char1_au.png
            pair/
              pair1.png
          music/          ← 음악
            bgm1.mp3
          log/            ← TRPG 로그 html
            session1.html

        이렇게 적어요)
          logo:     { image: "img/logo.png" }
          standing: [ { label: "기본", image: "img/oc/char1.png" } ]
          music:    { file: "music/bgm1.mp3" }
          logs:     [ { embed: "log/session1.html" } ]

   ③ 다른 사이트에 올린 파일 → https:// 로 시작하는 주소 전체
        image: "https://example.com/char1.png"
        ※ 트위터, 포스타입 등은 이미지 주소를 바로 쓰면 막히는 경우가 많아요.
          가능하면 나루에 직접 올려서 ① ② 방법으로 쓰는 걸 추천해요.

   ⚠ 자주 하는 실수
   - 대소문자를 정확히 : "Char1.PNG" 와 "char1.png" 는 다른 파일이에요.
   - 확장자까지 적기 : "char1" (✕) → "char1.png" (○)
   - 슬래시 방향은 / : "img\char1.png" (✕) → "img/char1.png" (○)
   - 맨 앞에 / 붙이지 않기 : "/img/char1.png" (✕) → "img/char1.png" (○)
   - 파일 이름은 영어, 숫자, - _ 만 쓰는 게 가장 안전해요.
     (띄어쓰기나 한글 이름은 서버에 따라 안 열릴 수 있어요)
   - 음악은 mp3 / m4a / ogg / wav 만 재생돼요. (유튜브 링크 ✕)
   - 그림이 안 나오면 : 파일 이름과 폴더 이름을 한 글자씩 비교해 보세요.
   ========================================================== */

window.SITE = {

  /* 관리자 편집기(#admin) : 이 계정만 편집 / 저장할 수 있어요. 규칙(firestore.rules, storage.rules)의 이메일과 같게 */
  admin: { email: "swoonqx@gmail.com" },

  /* 📱 화면 너비가 이 숫자(px) 이하면 모바일 배치(세로로 쌓기)로 바뀌어요.
        휴대폰은 보통 360~430 / 세로 태블릿 768~820 */
  mobileWidth: 820,

  /* ----------------------------------------------------------
     ① 브라우저 탭에 표시되는 제목
     ---------------------------------------------------------- */
  title: "MY HOME",


  /* ----------------------------------------------------------
     ② 색상
     - 흰 바탕 + 지정색(point) 한 가지로 깔끔하게 표시돼요.
       글자, 버튼은 지정색 그대로 / 연한 선, 보조 글자는 지정색을
       흰색에 섞은 옅은 색으로 자동 계산돼요.
     - 특정 부분만 다른 색으로 바꾸고 싶으면 그 항목에 색을 적어요.
       비워 두면("") 자동 색이 그대로 쓰여요.
     - 색 적는 법 : "#ffffff" 같은 색상 코드
                    반투명은 "rgba(0, 0, 0, 0.5)" (마지막 숫자 0~1 = 투명도)
     - point 예시
         블랙        "#2b2b2b"
         차콜 그레이  "#4a4a4a"
         네이비      "#1f2a44"
         딥 그린     "#2f4a3a"
         버건디      "#5a1f2b"
     ---------------------------------------------------------- */
  colors: {
    point: "#2b2b2b",           // ★ 지정색

    /* 바탕 */
    background: "",             // 바탕색 (기본 흰색, 화면 아래쪽 색)
    backgroundTop: "",          // 화면 위쪽 색 (기본: 지정색이 아주 옅게)
                                //   완전 흰 바탕을 원하면 "#ffffff"

    /* 로고 (로고 이미지를 쓰면 적용 안 됨) */
    logo: "",                   // 로고 글자색

    /* 메뉴 */
    menuText: "",               // 메뉴 글자색
    menuHover: "",              // 마우스를 올렸을 때 글자 + 선 색
    menuNumber: "",             // 01, 02 … 번호 색
    menuLine: "",               // 번호와 이름 사이 점선 색

    /* 메인 일러스트 액자 (frame: true 일 때) */
    frameBackground: "",        // 액자 안쪽 여백 색
    frameBorder: "",            // 액자 테두리 선 색
    frameShadow: "",            // 액자 뒤 오른쪽 아래 그림자 색
    placeholder: "",            // 이미지 넣기 전 자리 표시 상자 색
    placeholderText: "",        // 자리 표시 상자 글자색

    /* 투명 오브젝트 (frame: false 일 때) */
    objectShadow: "",           // 오브젝트 아래 그림자 색 (반투명 rgba 추천)

    /* 뮤직 플레이어 */
    player: {
      background: "",           // 플레이어 배경 (살짝 비쳐 보여요)
      border: "",               // 테두리 + 위쪽 구분 점선
      title: "",                // 곡 제목 글자색
      subText: "",              // 아티스트, 시간, MUSIC 글자, 작은 버튼 색
      playButton: "",           // 가운데 동그란 재생 버튼 색
      playIcon: "",             // 재생 버튼 안의 ▶ 아이콘 색
      bar: "",                  // 재생 바 / 볼륨 바 채워진 부분
      barEmpty: "",             // 재생 바 / 볼륨 바 빈 부분
      disc: ""                  // 회전 디스크 색 (커버 이미지가 없을 때)
    },

    /* ---------- Oc / Pair / Owner / Guest 화면 세부 색 ----------
       all 에 적으면 네 화면 모두, oc / pair / owner / guest 에 적으면 그 화면만 바뀌어요.
       (뒤에 적은 쪽이 우선 : all → 화면별 → 캐릭터/페어 대표색)
       비워 두면("") 위의 base(지정색)를 따라가요.

       point      : 그 화면의 지정색 (아래 항목을 비우면 이 색으로 자동 계산)
       title      : 큰 제목 글자 (캐릭터 이름, 페어 이름, 탭 제목 등)
       text       : 본문 글자
       sub        : 보조 글자 (날짜, 영문 이름, 설명 등)
       line       : 선, 테두리, 점선
       soft       : 옅은 바탕 (정보 칸, 로그 칸, 설명 칸 등)
       accent     : 강조색 (제목 바, 선택된 탭/버튼, 능력치 막대, 타임라인 점과 선)
       accentText : 강조색 위의 글자 (제목 바 글자, 선택된 버튼 글자)
       card       : 카드 / 칸 바탕 (프로필 카드, 방명록 칸, 탭 내용 칸 등)
       background : 화면 전체 바탕 (비우면 ③ 바탕 이미지와 기본 바탕이 보여요) */
    pages: {
      all:   { point: "", title: "", text: "", sub: "", line: "", soft: "", accent: "", accentText: "", card: "", background: "" },
      oc:    { point: "", title: "", text: "", sub: "", line: "", soft: "", accent: "", accentText: "", card: "", background: "" },
      pair:  { point: "", title: "", text: "", sub: "", line: "", soft: "", accent: "", accentText: "", card: "", background: "" },
      owner: { point: "", title: "", text: "", sub: "", line: "", soft: "", accent: "", accentText: "", card: "", background: "" },
      guest: { point: "", title: "", text: "", sub: "", line: "", soft: "", accent: "", accentText: "", card: "", background: "" }
    }
  },


  /* ----------------------------------------------------------
     ③ 바탕 이미지 (무늬, 옅은 일러스트 등)
     - image : 바탕 이미지 주소. 비워 두면("") 이미지 없이 색만 나와요.
               나루에 올린 파일 이름 또는 https:// 로 시작하는 주소
     - type  : 이미지를 까는 방식
               "cover"   → 화면을 꽉 채움 (일러스트, 사진용 / 일부가 잘릴 수 있음)
               "contain" → 이미지 전체가 다 보이게 (남는 곳은 바탕색)
               "pattern" → 작은 이미지를 바둑판처럼 반복 (무늬용)
     - patternSize : type 이 "pattern" 일 때 무늬 한 칸의 가로 크기 (숫자, px)
     - position : 이미지를 어디에 맞출지
                  "center" 가운데 / "top" 위 / "bottom" 아래
                  "left" 왼쪽 / "right" 오른쪽 / "right bottom" 오른쪽 아래 처럼 조합 가능
     - opacity  : 진하기 (0 ~ 1 / 0.1 = 아주 옅게, 1 = 원본 그대로)
     - blur     : 흐림 정도 (숫자, 0 = 선명 / 5~10 = 은은하게 뿌옇게)
     - grayscale: 흑백으로 바꿀지 (true / false, 따옴표 없이)
     - fadeBottom : 화면 아래쪽에서 이미지가 흰색으로 스르륵 사라지게 할지 (true / false)
     - scroll   : 이미지를 천천히 흘러가게 할지 (true / false / pattern 무늬에 잘 어울려요)
     ---------------------------------------------------------- */
  bgImage: {
    image: "",
    type: "cover",
    patternSize: 200,
    position: "center",
    opacity: 0.2,
    blur: 0,
    grayscale: false,
    fadeBottom: true,
    scroll: false
  },


  /* ----------------------------------------------------------
     ④ 로고 (화면 왼쪽)
     - image : 로고 이미지 주소. 비워 두면("") 아래 text 글자가 대신 나와요.
               나루에 이미지를 올렸다면 파일 이름만 적어도 돼요. 예) "logo.png"
               다른 곳에 올린 이미지는 https:// 로 시작하는 주소 전체를 적어요.
     - text  : 로고 이미지가 없을 때 보이는 글자 (줄바꿈은 \n)
     - size  : 로고 이미지 가로 크기 (숫자만, 단위 px / 추천 200~360)
     ---------------------------------------------------------- */
  logo: {
    image: "",
    text: "swoonqx",
    size: 300
  },


  /* ----------------------------------------------------------
     ④-2 메인 자기소개 (로고 아래)  ★ 사람 중심 메인
     - hello   : 이름 위 작은 인사말 (비우면 숨김)
     - tagline : 이름 아래 한 줄 소개
     - about   : 짧은 소개 글 (줄바꿈은 \n)
     - facts   : 작은 정보 표 [ ["항목", "내용"], … ] (비우면 [] 숨김)
     - tags    : 관심사 꼬리표 ["바이브 코딩", "OC", "커미션"]
     - links   : 바로가기 버튼 { name, url } (X, 포스타입 등)
     ---------------------------------------------------------- */
  home: {
    hello: "",
    tagline: "",
    about: "작은 보관소",
    facts: [],
    tags: [],
    /* icon : "x" 또는 "github" (아이콘으로 표시) / url : 이동할 주소 */
    links: [
      { name: "X",      icon: "x",      url: "https://x.com/swoonqx" },
      { name: "GitHub", icon: "github", url: "https://github.com/swoonqx" }
    ]
  },


  /* ----------------------------------------------------------
     ⑤ 메인 일러스트 (화면 가운데)
     - image : 일러스트 이미지 주소 (로고와 같은 방법)
               비워 두면 자리 표시용 회색 상자가 나와요.
     - 세로형, 가로형 모두 가능해요. 비율에 맞춰 자동으로 크기가 조절돼요.
     - frame : 액자 테두리를 쓸지 정해요. (따옴표 없이 true / false)
               true  → 일반 일러스트용. 테두리 + 그림자 액자에 넣어 보여줘요.
               false → 배경을 지운(투명화한) PNG 오브젝트용.
                       액자 없이 바탕 위에 이미지만 떠 있는 것처럼 보여요.
     - shadow : frame 이 false 일 때 오브젝트 아래 은은한 그림자를 넣을지 (true / false)
     - size   : 일러스트(액자형, 오브젝트 모두)의 최대 세로 크기
                (숫자만, 단위 px / 기본 600, 추천 450~750)
                크게 하고 싶으면 숫자를 키우고, 작게 하고 싶으면 줄여요.
     ---------------------------------------------------------- */
  illust: {
    image: "",
    frame: true,
    shadow: true,
    size: 600
  },


  /* ----------------------------------------------------------
     ⑥ 메뉴 (화면 오른쪽)
     - name : 메뉴에 보이는 글자
     - link : 클릭하면 이동할 화면
              "#oc" Oc / "#pair" Pair / "#owner" Owner / "#guest" Guest
              다른 사이트로 보내고 싶으면 "https://..." 주소를 적어도 돼요.
     - 메뉴를 늘리려면 { name: "", link: "" }, 한 줄을 복사해서 붙여 넣어요.
       (번호 01, 02 … 는 자동으로 붙어요)
     ---------------------------------------------------------- */
  menu: [
    { name: "Works", link: "#works" },
    { name: "Oc",    link: "#oc" },
    { name: "Pair",  link: "#pair" },
    { name: "Owner", link: "#owner" },
    { name: "Guest", link: "#guest" }
  ],


  /* ----------------------------------------------------------
     ⑦ 뮤직 플레이어 (화면 왼쪽 아래)
     - 플레이어 윗부분을 잡고 끌면 위치를 옮길 수 있어요.
     - 오른쪽 위 ↗ 버튼을 누르면 새 창으로 분리돼요. ( ― 버튼은 접기) 새 창은 다른 페이지로
       이동해도 음악이 끊기지 않아요. (새 창을 닫으면 원래 자리로 돌아와요)

     - enable   : 플레이어를 쓸지 (true / false, 따옴표 없이)
     - autoplay : 들어오자마자 재생할지 (true / false)
                  ※ 브라우저 정책상 바로 재생이 막히면,
                    화면을 처음 클릭하는 순간 재생이 시작돼요.
     - volume   : 처음 볼륨 (0 ~ 1 사이 숫자 / 예: 0.5 = 50%)

     - list : 재생 목록 (위에서부터 순서대로 재생, 끝나면 처음으로)
         title  : 곡 제목
         artist : 가수 / 아티스트 이름
         file   : 음원 파일 주소 ★ 필수
                  나루에 mp3 파일을 올리고 파일 이름을 적어요. 예) "song.mp3"
                  mp3 / m4a / ogg / wav 파일만 가능해요.
                  ✖ 유튜브 링크는 재생되지 않아요. (자동으로 제외돼요)
         cover  : 디스크 자리에 보일 앨범 커버 이미지 (없으면 "" 비워두기)
     - 곡을 늘리려면 { … }, 한 덩어리를 복사해서 아래에 붙여 넣어요.
     ---------------------------------------------------------- */
  music: {
    enable: true,
    autoplay: false,
    volume: 0.5,
    list: [
      { title: "노래 제목 1", artist: "아티스트", file: "", cover: "" },
      { title: "노래 제목 2", artist: "아티스트", file: "", cover: "" }
    ]
  },


  /* ----------------------------------------------------------
     ⑦-2 캘린더 (메인홈 / 뮤직 플레이어와 같은 창 모양)
     - 윗부분을 잡고 끌면 위치를 옮길 수 있어요. ― 버튼은 접기.
     - 기념일이 있는 날은 숫자 아래 점이 찍히고,
       날짜를 누르면 그날의 기념일이 나와요.
     - 아래쪽에 "함께한 날 D+" 와 "다가오는 기념일 D-" 가 나와요.

     enable    : 캘린더를 쓸지 (true / false)
     position  : 처음 위치 "right-top" 오른쪽 위 / "right-bottom" 오른쪽 아래 / "left-top" 왼쪽 위
     folded    : 처음부터 접어둘지 (true / false)
     weekStart : 0 → 일요일부터 / 1 → 월요일부터
     upcoming  : 아래쪽에 보여줄 다가오는 기념일 개수 (0 이면 숨김)

     events : 기념일 목록
              date   : "03-14"      → 매년 3월 14일
                       "2026-10-31" → 그날 하루만
                       "2020-03-14" + yearly: true → 매년 + "n주년" 자동 표시
              title  : 기념일 이름
     counters : 함께한 날 세기 (D+) / 비우면 [] 숨김
              date   : 시작한 날 "YYYY-MM-DD"
              title  : 이름 (예: "A × B 사귄 지")
     countFromOne : 시작한 날을 1일로 셀지 (true / false, 기본 true)
     ---------------------------------------------------------- */
  calendar: {
    enable: true,
    position: "right-bottom",
    folded: true,
    weekStart: 0,
    upcoming: 2,
    events: [
      { date: "03-14", title: "캐릭터 생일" },
      { date: "2020-06-01", title: "페어 기념일", yearly: true },
      { date: "12-25", title: "크리스마스" }
    ],
    counters: [
      { date: "2020-06-01", title: "페어 이름" }
    ],
    countFromOne: true
  }
,


  /* ==========================================================
     ⑧ Oc 화면 (주소 #oc)
     ----------------------------------------------------------
     - Oc 메뉴를 누르면 캐릭터 목록이 나오고,
       캐릭터를 누르면 프로필 화면이 열려요.
     - 색상(②), 바탕 이미지(③)는 메인홈과 똑같이 적용돼요.
     ========================================================== */
  oc: {

    /* ---------- 목록 화면 ---------- */
    title: "Oc",                      // 목록 화면 큰 제목
    subtitle: "Original Characters",  // 제목 아래 작은 글자
    listGrayscale: true,              // 목록 카드 이미지를 흑백으로 두고,
                                      // 마우스를 올리면 컬러로 (true / false)

    /* ---------- 프로필 화면 ---------- */
    fadeTime: 1.2,                    // 스탠딩이 나타나는 시간 (초)
    bgStanding: true,                 // 스탠딩을 뒤에 크게, 옅게 한 번 더 깔지 (true / false)
    bgStandingOpacity: 0.12,          // 뒤에 깔리는 스탠딩 진하기 (0 ~ 1)

    /* ---------- 캐릭터 목록 ----------
       캐릭터를 늘리려면 { 부터 }, 까지 한 덩어리를 통째로 복사해서
       아래에 붙여 넣고 내용을 바꿔요.

       id        : 영문/숫자로 된 캐릭터 고유 이름 (띄어쓰기 X, 겹치면 안 돼요)
                   홈페이지주소/#oc/char1 처럼 주소로 바로 프로필을 열 때 쓰여요.
       name      : 캐릭터 이름 (프로필 큰 제목)
       en        : 영문 이름 (목록 카드, 프로필 작은 글자)
       tag       : 이름 위 작은 태그 글자 (예: "No.01 · 주인공")
       subtitle  : 이름 아래 한 줄 소개
       desc      : 그 아래 짧은 설명 (줄바꿈은 \n)
       thumb     : 목록 카드에 보일 이미지 (세로형 추천 / 비우면 첫 스탠딩 사용)
       standingSize : 스탠딩 최대 세로 크기 (숫자, px / 기본 920)

       color     : ★ 캐릭터 대표색 (예: "#3b5b8c")
                   프로필을 열면 그 화면 전체(글자, 선, 제목 바, 버튼, 막대 …)가
                   이 색을 기준으로 바뀌어요. 비우면 기본 색.
       theme     : 대표색보다 더 세세하게 바꾸고 싶을 때 (생략 가능)
                   { title, text, sub, line, soft, accent, accentText, card, background }
                   항목 뜻은 ② colors → pages 와 같아요.
                   예) theme: { background: "#f3f6fb", accent: "#1d2f52" }

       standing  : 스탠딩 / 버전 목록 (기본, AU, 성장 버전, 의상 등)
                   2개 이상이면 왼쪽에 바꿔 보는 버튼이 생겨요.
                   label : 버튼 이름 / image : 스탠딩 이미지 (배경 투명 PNG 추천)
                   thumb : 버튼 작은 이미지 (비우면 image 사용)
                   ★ 버튼을 누르면 오른쪽 본문도 바꿀 수 있어요.
                     아래 항목을 버전 안에 적으면 그 버전에서만 내용이 바뀌어요.
                     tag, name, en, subtitle, desc, stats, badge, tabs, standingSize,
                     color, theme (AU 는 다른 색으로! 버튼을 누르면 색이 스르륵 바뀌어요)
                     적지 않은 항목은 캐릭터 기본 내용이 그대로 나와요.
                     (예: 의상만 다르면 label, image 만 적기
                          AU 처럼 설정이 다르면 tabs 까지 통째로 적기)

       stats     : 능력치 막대 (비우면 [] 숨김)
                   name : 항목 이름 / value : 0 ~ 100 숫자
       faction   : 소속 진영 이름 (없으면 "")
                   (관계 탭 카드에는 thumb 이미지가 쓰여요. 세로로 긴 이미지 추천)
                   글자가 똑같은 캐릭터끼리 관계 탭의 "같은 진영" 에 자동으로 모여요.
                   띄어쓰기까지 똑같이 적어야 같은 진영으로 인식돼요.
       badge     : 오른쪽 위 이미지 (진영 로고, 캐릭터 SD 등)
                   image : 이미지 주소 (배경 투명 PNG 추천)
                   title : 이미지 아래 굵은 글자 (예: "소속 진영") / 비우면 숨김
                   sub   : 그 아래 작은 글자 / 비우면 숨김
                   size  : 이미지 최대 크기 (숫자, px / 기본 160)
                   image, title 모두 비우면 자리 자체가 사라져요.

       tabs      : 아래쪽 탭 (프로필, 관계 … 원하는 만큼)
                   name     : 탭 이름
                   auto     : true 로 적으면 그 탭 맨 위에 관계 목록이 자동으로 나와요.
                              - 페어 : ⑨ pair 에 이 캐릭터가 들어간 페어가 있으면
                                       상대 캐릭터 + 관계 + 페어 화면으로 가는 버튼
                              - 같은 진영 : faction 이 같은 캐릭터들 + 프로필로 가는 버튼
                              페어를 추가하거나 진영을 적기만 하면 알아서 업데이트돼요.
                              (아래 sections 에 직접 쓴 내용은 그 밑에 이어서 나와요)
                   sections : 탭 안의 내용 덩어리들
                     title : 제목 (예: "성격")
                             title 과 en 을 둘 다 비우면("") 검은 제목 바 없이 내용만 나와요.
                     en    : 제목 옆 작은 영문 (예: "CHARACTER")
                     text  : 본문 (줄바꿈은 \n)
                     또는
                     rows  : 표 형식 [ ["항목", "내용"], ["항목", "내용"] ]
                     또는
                     images : 갤러리 (사진을 누르면 크게 보기, ← → 키로 넘기기)
                              { image: "큰 이미지", thumb: "작은 이미지(생략 가능)",
                                caption: "설명(생략 가능)" }
                              간단히 "pic1.png" 처럼 파일 이름만 나열해도 돼요.
                     columns : 갤러리 한 줄에 몇 장씩 (숫자 / 기본 3)
       ---------------------------------- */
    list: [
      {
        id: "swoo",
        name: "승우",
        en: "swoonqx",
        tag: "No.01",
        subtitle: "owner character",
        desc: "오너 캐릭터",
        thumb: "img/oc/swoothumb.png",
        standingSize: 920,
        color: "",
        theme: { background: "" },

        standing: [
          /* 기본 : 아래 캐릭터 기본 내용이 그대로 나와요 */
          { label: "기본", image: "img/oc/swooport.png", thumb: "img/oc/swoothumb.png" },
        ],

        stats: [],                          // 능력치 칸을 쓰지 않아요
        faction: "",
        badge: { image: "", title: "", sub: "", size: 160 },

        tabs: [
          {
            name: "프로필",
            sections: [
              { title: "기본 정보", en: "INFORMATION", rows: [
                ["나이", "00세"],
                ["키", "168cm"],
                ["생일", "11월 29일"],
                ["좋아하는 것", "파도의 포말, 해파리"],
                ["싫어하는 것", "-"]
              ] },
              { title: "성격", en: "CHARACTER", text: "성격이 들어갑니다." },
              { title: "배경", en: "BACKGROUND", text: "배경이 들어갑니다." }
            ]
          },
          {
            name: "관계",
            auto: true,
            sections: []                    // 따로 쓸 내용이 없으면 이렇게 비워 두면 돼요
          },
          {
            name: "갤러리",
            sections: [
              { title: "", en: "", columns: 3, images: [
                { image: "img/oc/swoimg1.png", caption: "ⓒ무우님" },
                { image: "img/oc/swoimg2.png", caption: "ⓒ피티원장님" },
                { image: "img/oc/swoimg3.jpg", caption: "ⓒ코코코님" },
                { image: "img/oc/swoimg4.png", caption: "ⓒ얌구님" },
                { image: "img/oc/swoothumb.png", caption: "ⓒ지구님" }
              ] }
            ]
          }
        ]
      },

      {
        id: "shun",
        name: "카츠키 슌",
        en: "Katsuki Shun",
        tag: "No.02",
        subtitle: "영웅의 피구원자",
        desc: "동경의 끝에서 바라본 것",
        thumb: "img/oc/shunthumb.png",
        standingSize: 920,
        color: "",
        standing: [
          { label: "기본", image: "", thumb: "img/oc/shunthumb.png" }
        ],
        stats: [],
        faction: "",
        badge: { image: "", title: "", sub: "", size: 160 },
        tabs: [
          {
            name: "프로필",
            sections: [
              { title: "기본 정보", en: "INFORMATION", rows: [
                ["나이", "00세"],
                ["키", "180cm"],
                ["생일", "00월 00일"],
                ["좋아하는 것", "내용"],
                ["싫어하는 것", "내용"]
              ] },
              { title: "성격", en: "CHARACTER", text: "성격이 들어갑니다." },
              { title: "배경", en: "BACKGROUND", text: "배경이 들어갑니다." }
            ]
          },
          {
            name: "관계",
            auto: true,
            sections: []
          },
          {
            name: "갤러리",
            sections: [
              { title: "", en: "", columns: 3, images: [
                { image: "img/pair/shunport.png", caption: "ⓒ대마왕님" }
              ] }
            ]
          }
        ]
      }
    ]
  },


  /* ==========================================================
     ⑨ 페어 (Pair / 주소 #pair)
     ----------------------------------------------------------
     - Pair 메뉴를 누르면 페어 목록이 나오고, 페어를 누르면 페어 화면이 열려요.
     - 여기에 페어를 추가하면 Oc 프로필의 관계 탭(auto: true)에도
       자동으로 나타나요.
     - 페어 화면 : 처음엔 커버(양쪽 클로즈업 + 가운데 스탠딩)가 나오고,
                   아래쪽 탭 버튼을 누르면 그 내용이 열려요.
                   탭 버튼 순서 : [커버] + tabs 에 적은 탭들
                   양쪽 클로즈업을 누르면 그 캐릭터의 Oc 프로필로 바로 이동해요.

     ---------- 목록 / 공통 설정 ----------
     title      : 목록 화면 큰 제목
     subtitle   : 제목 아래 작은 글자
     fadeTime   : 가운데 스탠딩이 나타나는 시간 (초)
     coverTab   : 커버로 돌아가는 탭 버튼 이름 (예: "Cover", "Home")
     scriptFont : 커버의 큰 필기체 글자를 쓸지
                  "Pinyon" → 필기체 / "" (비우기) → 프리텐다드 기울임체

     ---------- 페어 하나에 들어가는 항목 ----------
     id       : 영문/숫자 고유 이름 (홈페이지주소/#pair/pair1 처럼 주소에 쓰여요)
     name     : 페어 이름 (관계 카드 아래쪽 큰 글자 / 예: "하야나세")
     en       : 페어 영문 이름 (이름 아래 작은 글자 / 비우면 "with 상대 이름")
     thumb    : 관계 카드에 들어갈 세로로 긴 이미지 (페어 그림 추천)
                비우면 상대 캐릭터 이미지가 대신 들어가요.
     relation : 둘의 관계 (카드 왼쪽 위 작은 꼬리표 / 예: "연인", "라이벌")
     color    : ★ 페어 대표색 → 페어 화면 전체가 이 색 기준으로 바뀌어요 (비우면 기본)
     theme    : 더 세세하게 { title, text, sub, line, soft, accent, accentText, card, background }
     members  : 페어에 속한 캐릭터들 (최대 4인)
                2인 → 왼쪽 1 / 오른쪽 1, 3인 → 왼쪽 2 / 오른쪽 1, 4인 → 왼쪽 2 / 오른쪽 2
                - 내 Oc 목록에 있는 캐릭터 : ⑧ 의 id 를 그대로 "char1"
                  (이름, 이미지는 Oc 에서 자동으로 가져오고, 누르면 그 프로필로 이동)
                - 다른 오너 캐릭터 등 목록에 없는 캐릭터 :
                  { name: "이름", en: "영문", thumb: "세로 이미지", link: "누르면 갈 주소(생략 가능)" }

     --- 페어 화면 커버 ---
     portraits    : 클로즈업 이미지 (members 순서대로, 최대 4개) [ "1번", "2번", "3번", "4번" ]
                    비우면 각 멤버 이미지가 대신 들어가요.
     standing     : 가운데 둘이 함께 있는 스탠딩 (배경 투명 PNG 추천)
     standingSize : 가운데 스탠딩 최대 세로 크기 (숫자, px / 기본 860)
     standings    : 스탠딩을 여러 장 넣고 싶을 때 (AU, 성장, 표정 차분 등)
                    2장 이상이면 동그란 도장을 누를 때마다 다음 스탠딩으로 바뀌어요.
                    (standings 를 쓰면 위의 standing 은 무시돼요)
                    label     : 도장에 작게 표시되는 이름 (예: "기본", "AU", "성장")
                    image     : 스탠딩 이미지
                    size      : 이 스탠딩만 크기를 다르게 (생략 가능)
                    portraits : 이 버전에서만 양쪽 클로즈업도 바꾸기 (생략 가능)
                    script    : 이 버전에서만 뒤 필기체 글자 바꾸기 (생략 가능)
                    color     : 이 버전에서만 화면 색 바꾸기 (생략 가능 / 도장을 누르면 색도 스르륵)
                    theme     : 이 버전에서만 세부 색 바꾸기 (생략 가능)
     script       : 뒤에 크게 깔리는 필기체 글자 (비우면 en 사용)
     desc         : 왼쪽 아래 페어 이름 밑 짧은 설명 (줄바꿈은 \n)
     stamp        : 동그란 도장 { title: "큰 글자", text: "작은 글자" }
                    둘 다 비워도 standings 가 2장 이상이면 버전 표시와 함께 나와요.
     date         : 오른쪽 아래 숫자 { big: "01", sub: "January", small: "2026.01" }
                    기념일, 만난 날 등 / 셋 다 비우면 숨김

     --- 탭 내용 ---
     tabs         : Oc 의 tabs 와 똑같은 형식 (text / rows / images 모두 가능)
                    탭 이름이 아래쪽 버튼이 되고, 누르면 오른쪽 칸에 내용이 나와요.

     --- 타임라인 탭 ---
     탭 안에 timelines 를 적으면 가로 타임라인이 그려져요. (내용 칸이 넓게 열려요)
     timelines : 타임라인 목록. 2개 이상이면 위쪽에 전환 버튼이 생겨요.
                 (본편, AU 1, AU 2 … 처럼 따로따로 만들 수 있어요)
       name   : 전환 버튼 이름 (예: "본편", "AU · 학원")
       desc   : 타임라인 위 짧은 설명 (생략 가능)
       events : 사건 목록 (왼쪽부터 순서대로)
         date  : 날짜/시기 (예: "2020.03", "1년 전")
         title : 사건 이름
         text  : 점을 누르거나 마우스를 올리면 아래 칸에 나오는 설명 (생략 가능)
         size  : 점 크기 1 (작게) / 2 (중간) / 3 (크게) — 중요한 사건은 크게

     --- TRPG 로그 백업 탭 ---
     탭 안에 logs 를 적으면 로그 보관함이 돼요. (왼쪽 목록 / 오른쪽 로그)
     logs : 로그 목록 (세션마다 하나씩)
       title    : 세션 / 시나리오 이름
       date     : 날짜
       system   : 룰 (예: "CoC 7th", "인세인")
       gm       : GM / KP 이름
       players  : 참가자 (예: "A (PL1), B (PL2)")
       desc     : 짧은 설명 (생략 가능)
       link     : 원본 로그 주소 → "원본 보기" 버튼 (생략 가능)
       embed    : 코코포리아 등에서 내보낸 html 로그 파일을 통째로 보여주기
                  나루에 올린 파일 이름 (예: "log1.html") / 이걸 쓰면 raw 는 무시돼요
       speakers : 말하는 사람 설정 (생략 가능)
                  { "이름": { image: "프사.png", side: "right" } }
                  side: "right" → 오른쪽 진한 말풍선 / gm: true → GM 말풍선
       raw      : 로그 글을 그대로 붙여 넣는 곳. ` (백틱) 사이에 여러 줄로 적어요.
                  이름: 대사      → 말풍선
                  # 장면 이름     → 장면 구분선
                  > 판정 결과     → 시스템 (주사위 등)
                  그 외 글        → 지문 (가운데 기울임체)
                  ※ raw 안에서는 ` (백틱) 글자를 쓰면 안 돼요.
     ========================================================== */
  pair: {
    title: "Pair",
    subtitle: "Couples & Pairs",
    fadeTime: 1.2,
    coverTab: "Cover",
    scriptFont: "Pinyon",

    list: [
      {
        id: "kshume",
        name: "키슈미",
        en: "K/SHU ME",
        thumb: "img/pair/ksmthumb.png",
        relation: "동경",
        color: "",
        theme: { background: "" },
        members: ["shun", { name: "Kazuto", en: "KAZUTO", thumb: "img/pair/kiritoport.png", link: "" }],

        portraits: ["img/pair/shunport.png", "img/pair/kiritoport.png"],
        standingSize: 860,
        standings: [
          { label: "기본", image: "" },
          { label: "성장", image: "", size: 900 },
          { label: "표정 차분", image: "" }
        ],
        script: "",
        desc: "페어 한 줄 소개가 들어갑니다.",
        stamp: { title: "K/SHU", text: "thank you\nfor visiting" },
        date: { big: "01", sub: "January", small: "2026.01" },

        tabs: [
          {
            name: "타임라인",
            timelines: [
              {
                name: "본편",
                events: [
                  { date: "2018.03", title: "첫 만남", text: "둘이 처음 만난 날의 이야기가 들어갑니다.", size: 3 },
                  { date: "2018.09", title: "사건 이름", text: "설명이 들어갑니다.", size: 1 },
                  { date: "2019.12", title: "사건 이름", text: "설명이 들어갑니다.", size: 2 },
                  { date: "2020.05", title: "사건 이름", text: "", size: 1 },
                  { date: "2021.02", title: "고백", text: "설명이 들어갑니다.", size: 3 },
                  { date: "2023.07", title: "사건 이름", text: "설명이 들어갑니다.", size: 2 }
                ]
              },
            ]
          },
          {
            
            name: "갤러리",
            sections: [
              { title: "", en: "", columns: 3, images: [
                { image: "", caption: "그림 설명" }
              ] }
            ]
          }
        ]
      },
      {
        id: "pair2",
        name: "페어 이름 2",
        en: "Pair Name 2",
        thumb: "",
        relation: "소꿉친구",
        members: ["char1", { name: "다른 오너 캐릭터", en: "OTHER CHARACTER", thumb: "", link: "" }],

        portraits: ["", ""],
        standing: "",
        script: "",
        desc: "",
        stamp: { title: "", text: "" },
        date: { big: "", sub: "", small: "" },
        tabs: [
          {
            name: "타임라인",
            timelines: [
              {
                name: "본편",
                events: [
                  { date: "어린 시절", title: "첫 만남", text: "설명이 들어갑니다.", size: 3 },
                  { date: "현재", title: "사건 이름", text: "설명이 들어갑니다.", size: 2 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },


  /* ==========================================================
     ⑩ 오너 (Owner / 주소 #owner)
     ----------------------------------------------------------
     - 왼쪽 : 오너 프로필 카드 (사진, 닉네임, 소개, 그 아래 배너)
     - 오른쪽 : 탭 (About 등) + 탭 옆에 트위터/포스타입 링크 버튼
     ========================================================== */
  owner: {
    title: "Owner",                   // 큰 제목
    subtitle: "About the owner",      // 제목 아래 작은 글자

    /* ---------- 왼쪽 프로필 카드 ---------- */
    profile: {
      image: "",                      // 프로필 사진 (SD, 프사 등)
      shape: "circle",                // 사진 모양 "circle" 동그라미 / "square" 둥근 네모
      name: "승우",
      en: "swoonqx",
      intro: "OC와 드림 놀이를 정말 좋아하는 바이브코더",
      /* 링크 버튼 : 오른쪽 탭 버튼 옆에 나와요 (원하는 만큼 추가 / 새 창으로 열려요) */
      links: [
        { name: "X (Twitter)", url: "https://x.com/swoonqx" },
        { name: "Github", url: "https://github.com/swoonqx/" }
      ]
    },

    /* ---------- 오른쪽 탭 ----------
       Oc 의 tabs 와 똑같은 형식 (text / rows / images 모두 가능) */
    tabs: [
      {
        name: "About",
        sections: [
          { title: "오너 정보", en: "PROFILE", rows: [
            ["활동명", "승우"],
            ["성인 여부", "성인"],
            ["주 활동", "그림, 글"],
            ["연락", "DM 편하게 주세요"]
          ] },
          { title: "좋아하는 것", en: "LIKE", text: "좋아하는 것들이 들어갑니다." },
          { title: "주의사항", en: "NOTICE", text: "지뢰, 부탁드리는 점 등이 들어갑니다." }
        ]
      }
    ],

    /* ---------- 배너 (왼쪽 카드의 닉네임, 소개 아래) ----------
       배너를 모두 비우면 배너 칸은 숨겨져요.
       왼쪽 카드는 스크롤되지 않고, 소개 글은 최대 4줄까지 보여요. */
    banner: {
      columns: 2,                     // 한 줄에 배너 몇 개씩 (숫자 / 기본 2)
                                      // 배너가 많아 카드 밖으로 넘치면 자동으로 개수를 늘려 작게 맞춰요

      /* 링크 배너 모음 : 묶음(groups)을 원하는 만큼 만들 수 있어요
         name  : 묶음 이름 (예: "Friends", "Pair", "Site")
         items : 배너 목록
                 name  : 배너 이름 (마우스를 올리면 표시 / 이미지가 없으면 글자로)
                 image : 배너 이미지
                 link  : 눌렀을 때 갈 주소 (새 창으로 열려요) */
      groups: [
        {
          name: "Friends",
          items: [
            { name: "친구 홈페이지 1", image: "", link: "" },
            { name: "친구 홈페이지 2", image: "", link: "" }
          ]
        },
        {
          name: "Site",
          items: [
            { name: "사이트 이름", image: "", link: "" }
          ]
        }
      ]
    }
  },


  /* ==========================================================
     ⑪ 방명록 (Guest / 주소 #guest)
     ----------------------------------------------------------
     - 왼쪽 : 안내 글 + 링크 버튼 (에스크, 핑크, 메일함 등)
     - 오른쪽 : 방명록
     - 나루는 파일만 올리는 곳이라, 방문자가 쓴 글은 구글 폼/시트에
       저장해서 불러와요. (무료, 광고 없음)
     ========================================================== */
  guest: {
    title: "Guest",
    subtitle: "Guestbook",
    intro: "방문해 주셔서 감사합니다!\n편하게 한마디 남겨 주세요.",
    boardTitle: "Guestbook",          // 오른쪽 위 큰 글자
    ownerName: "Owner",               // 답글에 표시되는 이름

    /* 방명록 방식
       "google" → 구글 폼 + 시트 (추천, 아래 google 설정 필요)
       "widget" → 외부 방명록 서비스를 그대로 넣기 (아래 widget 설정)
       "none"   → 방명록 없이 왼쪽 링크만 */
    mode: "firebase",                 // Firebase(Firestore) 방명록 사용 중

    namePlaceholder: "이름",
    messagePlaceholder: "방명록을 남겨 주세요!",
    sendText: "남기기",
    emptyText: "첫 번째 방명록을 남겨 주세요!",

    /* ---------- 구글 폼 + 시트 설정 ----------
       ① 구글 폼 만들기 (forms.google.com)
          질문 3개를 이 순서대로 만들어요.
            1. "이름"       → 단답형
            2. "내용"       → 장문형
            3. "공개 여부"  → 객관식, 보기 "공개" / "비공개"
               (비밀글이 필요 없으면 3번은 안 만들어도 돼요)
          설정 → "이메일 주소 수집" 은 꺼 두세요.

       ② 질문 번호(entry) 알아내기
          폼 편집 화면 오른쪽 위 ⋮ → "미리 채워진 링크 가져오기"
          → 아무 글자나 적고 "링크 가져오기" → 링크 복사
          복사한 링크 안에 entry.123456789= 처럼 생긴 부분이 질문마다 있어요.
          순서대로 nameEntry, messageEntry, secretEntry 에 "entry.숫자" 를 적어요.

       ③ formAction 적기
          같은 링크의 앞부분
            https://docs.google.com/forms/d/e/(긴 글자)/viewform
          에서 viewform 을 formResponse 로 바꿔서 적어요.

       ④ 응답 시트 만들기
          폼의 "응답" 탭 → "스프레드시트에 연결"(초록 아이콘) → 새 시트 만들기

       ⑤ 공개용 시트 만들기 (비밀글이 밖으로 나가지 않게)
          시트 아래 + 버튼으로 새 시트를 추가하고 이름을 "공개용" 으로 바꾼 뒤
          A1 칸에 아래 수식을 적어요. (응답 시트 이름이 다르면 맞춰 고치기)
            =FILTER('설문지 응답 시트1'!A:E, '설문지 응답 시트1'!D:D<>"비공개")
          → 비공개 글은 빼고 공개 글만 이 시트에 모여요.

       ⑥ 공개용 시트를 웹에 게시
          파일 → 공유 → 웹에 게시 → "공개용" 시트 선택 →
          "쉼표로 구분된 값(.csv)" 선택 → 게시 → 나온 주소를 sheetCsv 에 적어요.
          ※ 꼭 "공개용" 시트만 게시하세요. (응답 시트를 게시하면 비밀글도 공개돼요)

       ⑦ 답글 달기 / 글 지우기
          응답 시트의 E열 첫 칸에 "답글" 이라고 적고,
          답글을 달고 싶은 글의 줄 E칸에 답글을 쓰면 방명록에 표시돼요.
          글을 지우려면 응답 시트에서 그 줄을 삭제하면 돼요.

       ※ 새 글은 시트에 바로 저장되지만, 다른 사람 화면에는
         구글 게시 갱신 때문에 몇 분 뒤에 보여요. */
    /* ---------- Firebase 방명록 (mode: "firebase") ----------
       config      : Firebase 콘솔의 웹 앱 설정 값 (공개되어도 되는 값이에요)
       collection  : Firestore 컬렉션 이름
       보안 규칙은 Downloads\firestore.rules 를 Firebase 콘솔 → Firestore → 규칙 에 붙여 넣어요.
       비밀글/답글/삭제는 Firebase 콘솔 → Firestore 데이터 화면에서 해요.
         답글 : 그 글 문서에 reply (string) 필드를 추가 */
    firebase: {
      collection: "guests",
      sdkVersion: "13.0.0",
      perPage: 10,
      maxLength: 1000,
      config: {
        apiKey: "AIzaSyDvhPOppyO725BzkXVq6-8gngbN8i9ocbk",
        authDomain: "myhome-8854d.firebaseapp.com",
        projectId: "myhome-8854d",
        storageBucket: "myhome-8854d.firebasestorage.app",
        messagingSenderId: "347460761252",
        appId: "1:347460761252:web:8f73cdbb765e8aed66d831"
      }
    },

    google: {
      formAction: "",                 // https://docs.google.com/forms/d/e/.../formResponse
      nameEntry: "",                  // 예: "entry.1111111111"
      messageEntry: "",               // 예: "entry.2222222222"
      secretEntry: "",                // 예: "entry.3333333333" (비밀글을 안 쓰면 "" → 체크칸이 사라져요)
      publicValue: "공개",            // 공개 여부 질문의 보기 글자와 똑같이
      secretValue: "비공개",
      sheetCsv: "",                   // ⑥ 에서 받은 csv 주소
      columns: { time: 0, name: 1, message: 2, secret: 3, reply: 4 },
                                      // 시트 열 순서 (A=0, B=1, C=2 …) / 위 순서대로 만들었으면 그대로
      perPage: 10,                    // 한 번에 보여줄 글 수 (나머지는 "더 보기")
      maxLength: 1000,                // 글자 수 제한
      newestFirst: true               // 최신 글을 위로 (true / false)
    },

    /* ---------- 외부 방명록 위젯 (mode: "widget" 일 때) ----------
       iframe : 방명록 서비스에서 받은 주소 (페이지 안에 창으로 넣기)
       height : 창 높이 (숫자, px)
       code   : 서비스에서 받은 코드를 그대로 붙여 넣기 (` 백틱 사이에)
                iframe 과 code 중 하나만 적으면 돼요. */
    widget: {
      iframe: "",
      height: 640,
      code: ``
    },

    /* ---------- 왼쪽 링크 버튼 (익명 질문함 등) ----------
       비우면 [] 숨김 / 새 창으로 열려요 */
    links: []
  },


  /* ==========================================================
     ⑫ Works (만든 것들 / 주소 #works)  ★ 새로 추가된 화면
     ----------------------------------------------------------
     바이브 코딩으로 만든 배포 사이트, 프로그램 목록이에요.
     categories : 위쪽 탭 (웹사이트 / 프로그램 …) 원하는 만큼
       name  : 탭 이름
       text  : 탭 맨 위 짧은 안내 (생략 가능)
       items : 작품 카드 목록
         name     : 작품 이름
         desc     : 설명 (줄바꿈 \n)
         image    : 대표 이미지(스크린샷) 예) "img/works/site1.png"
         url      : 눌렀을 때 열릴 주소 (배포 사이트, GitHub 등)
         download : 프로그램 다운로드 파일/주소 (생략 가능)
                    ※ 파일 하나 10MiB 제한 → 큰 exe 는 GitHub Releases 주소 추천
         tags     : 작은 꼬리표 ["Web", "GIF"]
         status   : 이미지 왼쪽 위 표시 (예: "NEW", "v3.1", "베타")
         date     : 공개한 날 "2026.10.13" (정렬 기준 / 썸네일 왼쪽 아래에 26.10.13 로 표시)
     정렬 : works.sort 가 "new"(최신순, 기본) / "old"(과거순) 이에요.
            방문자가 위쪽 버튼으로 바꿔 볼 수 있어요.
     ========================================================== */
  works: {
    title: "Works",
    sort: "new",                       // 처음 정렬 : "new" 최신순 / "old" 과거순
    subtitle: "Vibe-coded things",
    intro: "바이브 코딩으로 제작된 배포 사이트와 프로그램입니다.\n2차 가공 및 사용 모두 자유롭게 해주세요!\n기타 문의는 X DM",
    links: [
      { name: "X", desc: "문의 DM", url: "https://x.com/swoonqx" },
      { name: "GitHub", desc: "소스 / 릴리즈", url: "https://github.com/swoonqx" }
    ],
    categories: [
      {
        name: "웹사이트",
        text: "브라우저에서 바로 쓸 수 있는 것들",
        items: [
          { name: "ZZIGLE GIF MAKER", desc: "찌글찌글 GIF 메이커", image: "img/works/zzigle_sum.gif", date: "2026.08.13", url: "https://x.com/swoonqx/status/2087856736854225279", tags: ["Web", "GIF"], status: "" },
          { name: "STAMP MAKER", desc: "간단한 우편풍 이미지 메이커", image: "img/works/stamp.png", date: "2026.09.21", url: "https://x.com/swoonqx/status/2101956724492231107", tags: ["Web", "Image"], status: "" },
          { name: "TICKET MAKER", desc: "좋아하는 아이와의 순간을 기록해보세요", image: "img/works/ticket.png", date: "2026.09.22", url: "https://x.com/swoonqx/status/2102402170817831312", tags: ["Web", "Image"], status: "" },
          { name: "CD MAKER", desc: "간단한 CD 앨범풍 이미지 메이커", image: "img/works/cd.png", date: "2026.09.24", url: "https://x.com/swoonqx/status/2103114451641921920", tags: ["Web", "Image"], status: "" },
          { name: "POLAROID MAKER", desc: "이미지를 자유롭게 꾸며요", image: "img/works/polaloid.png", date: "2026.09.30", url: "https://x.com/swoonqx/status/2105198161816097272", tags: ["Web", "Image"], status: "" },
          { name: "AI FAILS", desc: "무언가를 인식시켜 보세요", image: "img/works/fails.png", date: "2026.10.07", url: "https://x.com/swoonqx/status/2107626676029194355", tags: ["Web", "Image"], status: "" },
          { name: "piece of memory", desc: "퍼즐 느낌의 GIF 메이커", image: "img/works/piece.gif", date: "2026.10.08", url: "https://x.com/swoonqx/status/2108141216181387285", tags: ["Web", "GIF"], status: "" },
          { name: "catnapped!", desc: "우주고양이의 납치 사건", image: "img/works/catnapped.gif", date: "2026.10.13", url: "https://x.com/swoonqx/status/2109925758529581306", tags: ["Web", "GIF"], status: "NEW" }
        ]
      },
      {
        name: "프로그램",
        text: "내려받아서 쓰는 Windows 프로그램",
        items: [
          { name: "TYPING PET", desc: "함께 타이핑 하는 작은 펫", image: "", date: "2026.09.24", url: "https://x.com/swoonqx/status/2102960707943924124", tags: ["Windows"], status: "" }
        ]
      }
    ]
  },

};
