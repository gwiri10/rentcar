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
    $("#carImg1").attr("src", data.imgurl);
    $("#carImg2").attr("src", data.imgurl);
    $("#carImg3").attr("src", data.imgurl);
    $("#title").html(data.modelNm);
    $("#grade").html(data.grade);
    $("#luggage-count").html(data.bag + '개');
    $("#passenger-capacity").html(data.people + '명');
    $("#transmission").html(data.gear);

    $("#addPrice24").val(data.addPrice24);
    $("#addPrice48").val(data.addPrice48);
    $("#addPrice72").val(data.addPrice72);
    $("#addPrice96").val(data.addPrice96);
    $("#addPrice100").val(data.addPrice100);
    $("#upData").val(data.upData);
    $("#downDate").val(data.downData);
    $("#rate").val(data.rate);

    let ariconNm = '';
    data.aircon == '1' ? ariconNm = "있음" : "없음";

    $("#air-conditioning").html(ariconNm);
    $("#door-count").html(data.door + '개');

    $("#totalPrice").val(data.price);

    //인수위치 세팅
    let companyNm = await fetchCompanysDocument(data.companyCd*1);
    $("#rentSpot").html(companyNm);
}

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

$("#pickupDate").on('change', function (ev, picker) {
    let dateArray = $("#pickupDate").val().split(' ~ ');
    if(dateArray.length > 1 ){
        $("#pickupDate").val(dateArray[0]);
        $("#returnDate").val(dateArray[1]);
    }

    getDateDiff();
});

const getDateDiff = async() => {
    //대여일시와 반납일시간의 시간 구하기
    let date1 = new Date($("#pickupDate").val());
    let date2 = new Date($("#returnDate").val());

    //예약불가 기간 안에 선택한 값이 들어가는지 확인
    let isDateInRangeResultCancle = isDateInRange(date1, date2, 2) ;
    $("#downDataCheck").val(isDateInRangeResultCancle);
    if(isDateInRangeResultCancle){
        let msg = "2024-11-20 부터 2024-11-23 은 예약불가 기간입니다."
        if($("#downData").val()!=undefined && $("#downData").val()!=""){
            msg = $("#downData").val()+" 은 예약불가 기간입니다."
        }
        alert(msg);
        return;
    }

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

    //사전결제비율
    let calRate = $("#rate").val()==""? 0.2 : $("#rate").val()*0.01;
    let beforePrice = totalPrice * calRate;
    let afterPrice = (totalPrice* 1 - beforePrice) / 10;

    let data = await fetchOneDocument(id);
    let addPrice = 0;
    //기간별 추가 요금 세팅
    //1. 비수기
    let rage1 = data.upData1 != undefined ? data.upData1 : '25/01/06 - 25/01/24'
    let isDateInRangeResult = isAddPriceDateInRange(date1, date2, rage1) ;
    if(isDateInRangeResult){
        if(diffDay == 1){
            addPrice = data.addprice24_1 != undefined ? data.addprice24_1 : 5500
        }else if(diffDay == 2){
            addPrice = data.addprice48_1 != undefined ? data.addprice48_1 : 10800
        }
        else if(diffDay == 3){
            addPrice = data.addprice72_1 != undefined ? data.addprice72_1 : 16000
        }
        else if(diffDay == 4){
            addPrice = data.addprice96_1 != undefined ? data.addprice96_1 : 21100
        }
        else{
            addPrice = data.addprice100_1 != undefined ? data.addprice100_1 : 5000
            addPrice = addPrice*diffDay
        }
    }

    //2. 준성수기
    let rage2 = data.upData2 != undefined ? data.upData2 : '25/07/01 - 25/07/02'
    let isDateInRangeResult2 = isAddPriceDateInRange(date1, date2, rage2) ;
    if(isDateInRangeResult2){
        if(diffDay == 1){
            addPrice = data.addprice24_2 != undefined ? data.addprice24_2 : 6000
        }else if(diffDay == 2){
            addPrice = data.addprice48_2 != undefined ? data.addprice48_2 : 11900
        }
        else if(diffDay == 3){
            addPrice = data.addprice72_2 != undefined ? data.addprice72_2 : 16000
        }
        else if(diffDay == 4){
            addPrice = data.addprice96_2 != undefined ? data.addprice96_2 : 21100
        }
        else{
            addPrice = data.addprice100_2 != undefined ? data.addprice100_2 : 5600
            addPrice = addPrice*diffDay
        }
    }

    //2. 성수기
    let rage3 = data.upData3 != undefined ? data.upData3 : '25/08/01 - 25/08/02'
    let isDateInRangeResult3 = isAddPriceDateInRange(date1, date2, rage3) ;
    if(isDateInRangeResult3){
        if(diffDay == 1){
            addPrice = data.addprice24_3 != undefined ? data.addprice24_3 : 7500
        }else if(diffDay == 2){
            addPrice = data.addprice48_3 != undefined ? data.addprice48_3 : 14900
        }
        else if(diffDay == 3){
            addPrice = data.addprice72_3 != undefined ? data.addprice72_3 : 16000
        }
        else if(diffDay == 4){
            addPrice = data.addprice96_3 != undefined ? data.addprice96_3 : 21100
        }
        else{
            addPrice = data.addprice100_3 != undefined ? data.addprice100_3 : 7100
            addPrice = addPrice*diffDay
        }
    }

    //4. 극성수기
    let rage4 = data.upData4 != undefined ? data.upData4 : '25/09/01 - 25/09/02'
    let isDateInRangeResult4 = isAddPriceDateInRange(date1, date2, rage4) ;
    if(isDateInRangeResult4){
        if(diffDay == 1){
            addPrice = data.addprice24_4 != undefined ? data.addprice24_4 : 10000
        }else if(diffDay == 2){
            addPrice = data.addprice48_4 != undefined ? data.addprice48_4 : 19900
        }
        else if(diffDay == 3){
            addPrice = data.addprice72_4 != undefined ? data.addprice72_4 : 16000
        }
        else if(diffDay == 4){
            addPrice = data.addprice96_4 != undefined ? data.addprice96_4 : 21100
        }
        else{
            addPrice = data.addprice100_4 != undefined ? data.addprice100_4 : 9600
            addPrice = addPrice*diffDay
        }
    }
    
    afterPrice += addPrice;
    //예약하기 시 넘겨줄 데이터
    document.getElementById("afterPrice").value = afterPrice;
    document.getElementById("beforePrice").value = beforePrice;
    document.getElementById("diffDay").value = diffDay;

    $("#rentDate").html("총 "+diffDate+"시간")
    $("#price").html("사전결제 :  " + beforePrice + '(원) + 현장결제 : ' + afterPrice + '(엔)');

}

function isDateInRange(date1, date2, flag) {
    let range = "";
    if(flag == 1){
        range = $("#upData").val();
    }else{
        range = $("#downData").val();
    }
    
    let range1Start, range1End = "";
    if(range == undefined || range == ""){
        if(flag == 1){
            range1Start = '2025-01-06';
            range1End = '2025-01-24';
        }else{
            range1Start = '2024-11-20';
            range1End = '2024-11-23';
        }
    }else{
        let rangeArr = range.trim().split("-");
        range1Start = rangeArr[0];
        range1End = rangeArr[1];
    }

    // Convert inputs to Date objects
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const r1Start = new Date(range1Start);
        r1Start.setHours(0); r1Start.setMinutes(0);
    const r1End = new Date(range1End);
    r1End.setHours(0); r1End.setMinutes(0);
    // Check overlap with range 1
    const isInRange1 = startDate <= r1End && endDate >= r1Start;

    // Return true if either range matches
    return isInRange1 
}


function isAddPriceDateInRange(date1, date2, range) {

    let rangeArr = range.trim().split("-");
    range1Start = rangeArr[0];
    range1End = rangeArr[1];

    // Convert inputs to Date objects
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const r1Start = new Date(range1Start);
        r1Start.setHours(0); r1Start.setMinutes(0);
    const r1End = new Date(range1End);
        r1End.setHours(0); r1End.setMinutes(0);
    // Check overlap with range 1
    const isInRange1 = startDate <= r1End && endDate >= r1Start;

    // Return true if either range matches
    return isInRange1 
}
