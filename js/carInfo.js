import { fetchOneDocument, fetchCompanysDocument, fetchData } from './firebase.js';

const id = sessionStorage.getItem("id");
const pickupDate = sessionStorage.getItem("pickupDate");
const returnDate = sessionStorage.getItem("returnDate");

window.onload = async function () {
    let data = await fetchOneDocument(id);

    await fetchCarInfo(data);

    if ($("#pickupDate").val() != '') {
        $("#pickupDate").val(pickupDate);
        $("#returnDate").val(returnDate);
    }

    getDateDiff();
}

async function fetchCarInfo(data) {
    // collectionName  : "cars",
    // modelNm         : "Sample Title",   //title, 차량모델
    // grade           : "소형",           //차량등급
    // bag             : 2,                //수하물 갯수
    // people          : 4,                //탑승 인원 수
    // gear            : "오토",           //변속기 유형
    // aircon          : 1,                //에어컨 유무 : 있으면 1, 없으면 2
    // door            : 5,                //문 갯수
    // price           : 70500,            //금액(1박당)(원)
    // imgurl          : "https://d1masd123hbmlx.cloudfront.net/20231224075834_804_CARMST/20231224075834_804_CARMST_142.png", // 이미지링크URL
    // companyCd       : 1 //1
    $("#carImg").attr("src", data.imgurl);
    $("#title").html(data.modelNm);
    $("#grade").html(data.grade);
    $("#luggage-count").html(data.bag + '개');
    $("#passenger-capacity").html(data.people + '명');
    $("#transmission").html(data.gear);

    let ariconNm = '';
    data.aircon == '1' ? ariconNm = "있음" : "없음";

    $("#air-conditioning").html(ariconNm);
    $("#door-count").html(data.door + '개');

    $("#totalPrice").val(data.price);

    //인수위치 세팅
    let companyNm = await fetchCompanysDocument(data.companyCd*1);
    $("#rentSpot").html(companyNm);
}

const today = new Date();

$("#pickupDate").daterangepicker({
    "locale": {
        "format": "YYYY-MM-DD hh:mm A",
        "separator": " ~ ",
        "applyLabel": "확인",
        "cancelLabel": "취소",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
        "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    },
    timePicker: true,
    timePickerIncrement: 30,
    "startDate": new Date(pickupDate),
    "endDate": new Date(returnDate),
    "drops": "auto"
}, function (start, end, label) {
    //console.log(e);
});

$("#pickupDate").on('apply.daterangepicker', async function (ev, picker) {
    let dateArray = $("#pickupDate").val().split(' ~ ');
    $("#pickupDate").val(dateArray[0]);
    $("#returnDate").val(dateArray[1]);

    await getDateDiff();
});

const getDateDiff = async() => {
    //대여일시와 반납일시간의 시간 구하기
    let date1 = new Date($("#pickupDate").val());
    let date2 = new Date($("#returnDate").val());

    let diffDate = Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 )); // 밀리세컨 * 초 * 분 = 시간

    //대여일시와 반납일시간의 날짜 구하기(나머지가 있다면 +1)
    let diffDay = parseInt( diffDate / 24 );
    let totalPrice = 0;
    let extraDate = diffDate % 24;
    //총 대여시간을 24로 나눈 나머지 시간이 5시간을 초과하면 1박추가로 계산
    if(extraDate != 0){
        if(extraDate > 5){
            diffDay += 1; 
            extraDate = 0;
        }
    } 

    totalPrice = ($("#totalPrice").val() * diffDay) + extraDate*11000;

    let calRate = 0;//사전결제비율
    let result = await fetchData("rate");
    result.forEach((doc) => {
        calRate = doc.data().rate * 0.01;
    });
    let beforePrice = totalPrice * calRate;
    let afterPrice = (totalPrice* 1 - beforePrice) / 10;

    //예약하기 시 넘겨줄 데이터
    document.getElementById("afterPrice").value = afterPrice;
    document.getElementById("beforePrice").value = beforePrice;
    document.getElementById("diffDay").value = diffDay;

    $("#rentDate").html("총 "+diffDate+"시간")
    $("#price").html("사전결제 :  " + beforePrice + '(원) + 현장결제 : ' + afterPrice + '(엔)');

}