//firebase API를 위한 기본 키값
export const firebaseConfig = {
    apiKey: "AIzaSyDM2OCdFGrcVgWJ7kYHVcrfVK8Mpgb_dG4",
    authDomain: "nihonka-83b87.firebaseapp.com",
    projectId: "nihonka-83b87",
    storageBucket: "nihonka-83b87.firebasestorage.app",
    messagingSenderId: "194911091517",
    appId: "1:194911091517:web:d21790b55e9061e6136354",
    measurementId: "G-9WB108PDTY"
};

//업체정보 
export const companys = {
    collectionName  : "companys",
    companyNm       : "나하공항점(OKA)", //업체명
    address         : "일본 오키나와 나하공항점", //주소지
    telephone       : "010-1234-1234",          //긴급연락처
    openTime        : "10:00 AM - 17:00 PM",    //영업시간
    freeService     : "픽업서비스",              //무료서비스
    companyCd       : 1                 //업체코드
}

//차량정보
export const cars = {
    collectionName  : "cars",
    modelNm         : "Sample Title",   //title, 차량모델
    grade           : "소형",           //차량등급
    bag             : 2,                //수하물 갯수
    people          : 4,                //탑승 인원 수
    gear            : "오토",           //변속기 유형
    aircon          : 1,                //에어컨 유무 : 있으면 1, 없으면 2
    door            : 5,                //문 갯수
    price           : 70500,            //금액(1박당)(원)
    imgurl          : "https://d1masd123hbmlx.cloudfront.net/20231224075834_804_CARMST/20231224075834_804_CARMST_142.png", // 이미지링크URL
    companyCd       : 1 //1
};

//보험정보
export const insurances = {
    collectionName  : "insurances",
    insuranceCd     : 1,                //보험유형 : 4~5인승 1, 7~8인승 2
    price           : 1100,             //금액(엔)
    companyCd       : 1
};

//카시트정보
export const carseats = {
    collectionName  : "carseats",
    carseatCd       : 1,                //카시트유형 : 주니어 1, 차일드 2, 베이비 3
    price           : 1100,             //금액(엔)
    companyCd       : 1
};

//예약정보
export const reservation = {
    driverName : "홍길동",      //예약자명
    carName : "도요타 라이즈 또는 동급차종", //예약한 차량명
    lastName : "HONG",            //성
    firstName : "GILDONG",         //이름
    pickupDate : "2024-11-08 04:00 AM", //인수날짜시간
    pickupSpot : 1,                  //인수장소
    returnDate : "2024-11-11 04:00 AM", //반납날짜시간
    returnSpot : 1,                  //반납장소
    flightIn : "KE756",         //도착항공편
    adultCount : 2,                //성인 수
    childCount : 0,                //소인 수
    babyCount : 0,                //유아 수
    infantCount : 1,                //영아 수
    pickupMethod : '셔틀이용',   //수령방법
    mobile : '010-1234-1234',   //전화번호
    email : 'gildong@gmail.com',//email
    insurance : "1100(엔) X 2(박)",//풀커버 보험(NOC안심) 가입 여부
    juniorSeat : 0,              //주니어카시트 수
    childSeat : 0,               //차일드카시트 수
    babySeat : 0,                //베이비카시트 수
    resState : 1,               //예약상태(1:예약대기, 2:예약확정, 3:예약취소)
    regDate : "2024-11-10 04:00 AM" //등록날짜
}
//검색 시 한번 검색할 떄 표시할 목록의 갯수
export const pagingunit = 5;

