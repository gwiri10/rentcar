import { fetchData, fetchFirstDocument, getTotalDocumentsCount, fetchNextDocument } from './firebase.js';
import { pagingunit } from './setting.js';

// 페이지 로드 시 한 번 실행
window.onload = async function () {

    //인수장소 세팅
    await setLocation();

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
        "drops": "auto"
    }, function (start, end, label) {
        //console.log(e);
    });

    let pickupDate = sessionStorage.getItem("pickupDate");
    let returnDate = sessionStorage.getItem("returnDate");
    
    $("#pickupDate").val(pickupDate);
    $("#returnDate").val(returnDate);

    $(".datepicker").on("focus", function(e){
        $(this).prop("readonly", true); // 자판 비활성화
    }).on("blur", function(e){
        $(this).prop("readonly", false); // focus가 해제되면 readonly 속성 제거
    });
    
    $(".datepicker").on("touchstart focus", function(e){
        e.preventDefault();
    });

    //검색 세팅
    $("#btnSearch").click();
}

$("#pickupDate").on('hideCalendar.daterangepicker', function (ev, picker) {
    let dateArray = $("#pickupDate").val().split(' ~ ');
    $("#pickupDate").val(dateArray[0]);
    $("#returnDate").val(dateArray[1]);
});

$("#btnSearch").click(async () => {
    
    // 기존 카드 내용 지우기 (새로 검색할 때마다 업데이트)
    $("#carList").html('');

    let companyCd = $("#pickupLocation").val() * 1;
    
    //$("#pickupLocation").val(companyCd*1);
    if(isNaN(companyCd)) companyCd = sessionStorage.getItem("companyCd") *1;

    let companyNm = $("#pickupLocation").text();
    let pickupDate = $("#pickupDate").val();
    let returnDate = $("#returnDate").val();
    $("#lab_search").html(companyNm+"<br/>"+pickupDate+" ~ "+returnDate);

    let result = await fetchFirstDocument("cars", companyCd);

    makeCarList(result);

    let totalCount = await getTotalDocumentsCount("cars");
    let listCount = document.getElementById("carList").childElementCount;

    if (totalCount <= listCount) {
        $("#btnMoreList").hide();
    } else {
        $("#btnMoreList").show();
    }
});

$("#btnMoreList").click(async function () {
    let companyCd = $("#pickupLocation").val() * 1;

    let totalCount = await getTotalDocumentsCount("cars");
    let listCount = document.getElementById("carList").childElementCount + pagingunit;;
    let limitCnt = 0;

    if (totalCount > listCount) {
        $("#btnMoreList").show();
        limitCnt = pagingunit;
    } else {
        $("#btnMoreList").hide();
        limitCnt= totalCount - listCount + 5;
    }

    let result = await fetchNextDocument("cars", companyCd, limitCnt);

    makeCarList(result);
});

function makeCarList(result) {
    let cardContainer = document.getElementById("carList"); // 카드 컨테이너 선택

    result.forEach((doc) => {
        const data = doc.data(); // 문서 데이터 가져오기

        // 카드 요소 생성
        const card = document.createElement('div');
        card.className = 'cardList'; // Bootstrap의 그리드 시스템 사용

        let airconNm = data.aircon==1 ? "있음" : "없음"
        // 카드 HTML 구성
        card.innerHTML = `
            <div class="col-md-12"> <!-- 한 줄에 가득 차도록 col-md-12 -->
                <div class="card car-card">
                    <img src="${data.imgurl}" class="card-img-top" alt="차량 이미지">
                    <div class="card-body">
                        <h5 class="card-title">${data.modelNm}</h5>
                        <p class="card-text">
                            <span><i class="fas fa-car-side"></i> ${data.grade}</span> 
                            <span><i class="fas fa-cogs"></i> ${data.gear}</span> 
                            <span><i class="fas fa-suitcase"></i> ${data.bag}개</span> 
                            <span><i class="fas fa-users"></i> ${data.people}명</span> 
                            <span><i class="fas fa-snowflake"></i> ${airconNm}</span>
                            <span><i class="fas fa-door-open"></i> ${data.door}개</span>
                        </p>
                        <a href="#" onclick="pageMove('${doc.id}')" class="btn btn-primary btnMore"> 자세히 보기</a>
                    </div>
                </div>
            </div>
            `;
        //<p class="price">가격 : <strong>${data.price}원/일</strong></p> <!-- 가격 강조 -->
        // 카드 컨테이너에 카드 추가
        cardContainer.appendChild(card);
    });
}

async function setLocation() {
    let optionList = $("#pickupLocation");
    optionList.innerHTML = '';

    let html = "";

    let result = await fetchData("companys");

    result.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

        let data = doc.data();
        html += "<option value=" + data.companyCd + ">" + data.companyNm + "</option>";
    });

    optionList.html(html);
    $("#pickupLocation").val(sessionStorage.getItem("companyCd")*1)
}

$("#lab_search").on("click", function(){
    $(".lab-search")[0].style.display='none';
    $(".carList-search")[0].style.display='block';
});
$("#label_close").on("click", function(){
    $(".lab-search")[0].style.display='block';
    $(".carList-search")[0].style.display='none';
});
