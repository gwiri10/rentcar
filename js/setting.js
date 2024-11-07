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
    lastName : "HONG",            //성
    firstName : "GILDONG",         //이름
    pickupDate : "2024-11-08 04:00 AM", //인수날짜시간
    spot1 : 1,                  //인수장소
    returnDate : "2024-11-11 04:00 AM", //반납날짜시간
    spot2 : 1,                  //반납장소
    flightIn : "KE756",         //도착항공편
    person1 : 2,                //성인 수
    person2 : 0,                //소인 수
    person3 : 0,                //유아 수
    person4 : 1,                //영아 수
    pickup : 'Y',               //수령방법(Y:셔틀이용, N:직접수령)
    mobile : '010-1234-1234',   //전화번호
    email : 'gildong@gmail.com',//email
    NOC : 'Y',                  //풀커버 보험(NOC안심) 가입 여부
    juniorCnt : 0,              //주니어카시트 수
    childCnt : 0,               //차일드카시트 수
    babyCnt : 0,                //베이비카시트 수

}
//검색 시 한번 검색할 떄 표시할 목록의 갯수
export const pagingunit = 5;

//사전결제와 현장결제의 비율 (사전결제 * calRate = 현장결제)
export const calRate = 0.8;
