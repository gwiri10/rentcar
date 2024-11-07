import { fetchData, fetchFirstDocument, getTotalDocumentsCount, fetchNextDocument } from './firebase.js';
import { pagingunit } from './setting.js';

function adjustBannerHeight() {
    let bannerContainer = document.getElementById("bannerContainer");
    let height = bannerContainer.offsetHeight;
    if (height > 300) {
        bannerContainer.style.height = '300px';
    } else {
        bannerContainer.style.height = 'auto';
    }

    let cardContainer = document.getElementById("cardContainer");
    let width = cardContainer.offsetWidth;

    let cardControl = document.getElementById("cardControl");
    if (width < 1000) {
        cardContainer.style.display = 'block';
        cardControl.style.display = 'block';

    } else {
        cardContainer.style.display = 'flex';
        cardControl.style.display = 'none';
    }
}

cardControl.onclick = function () {
    let itag = cardControl.children[0].children[0];
    if (itag.className.includes("fa-chevron-up")) {
        itag.classList.replace("fa-chevron-up", "fa-chevron-down");
        cardContainer.style.display = 'none';
    } else {
        itag.classList.replace("fa-chevron-down", "fa-chevron-up");
        cardContainer.style.display = 'block';
    }
}
// 페이지 로드 시 한 번 실행
window.onload = function () {
    adjustBannerHeight();

    //daterangepicker 값을 두개의 input에 나눠넣기 
    if ($("#pickupDate").val() != '') {
        let dateArray = $("#pickupDate").val().split(' ~ ');
        $("#pickupDate").val(dateArray[0]);
        $("#returnDate").val(dateArray[1]);
    }

    //인수장소 세팅
    setLocation();

    //검색 세팅
    $("#btnSearch").click();
}
// 화면 크기가 변할 때마다 실행
window.onresize = adjustBannerHeight;

// $(document).ready(function () {
//     $.datepicker.setDefaults({
//         dateFormat: 'yy-mm-dd',
//         prevText: '이전 달',
//         nextText: '다음 달',
//         monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
//         monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
//         dayNames: ['일', '월', '화', '수', '목', '금', '토'],
//         dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
//         dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
//         showMonthAfterYear: true,
//         yearSuffix: '년'
//     });

//     const today = new Date();

//     $("#pickupDate").datepicker({
//         dateFormat: 'yy-mm-dd',
//         onClose: function () {
//             $("#returnDate").datepicker({
//                 dateFormat: 'yy-mm-dd',
//                 minDate: new Date($("#pickupDate").val()),
//             });
//         },
//     }).datepicker("setDate", today);

//     $("#returnDate").datepicker({}).datepicker("setDate", new Date(today.setDate(today.getDate() + 4)));


//     $('.timepicker').timepicker({
//         timeFormat: 'HH:mm'
//     });
// });

// $("#returnDate").change(function () {
//     $("#pickupDate").datepicker({
//         dateFormat: 'yy-mm-dd',
//         maxDate : new Date($("#returnDate").val())
//     })
// })

// $("#pickupDate").change(function () {
//     $("#returnDate").datepicker({
//         dateFormat: 'yy-mm-dd',
//         minDate : new Date($("#pickupDate").val())
//     })
// })

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
    "startDate": new Date(),
    "endDate": new Date(today.setDate(today.getDate() + 3)),
    "drops": "auto"
}, function (start, end, label) {
    //console.log(e);
});

// $("#pickupDate").change(function(){
//     let dateArray = $("#pickupDate").val().split(' ~ ');
//     $("#pickupDate").val(dateArray[0]);
//     $("#returnDate").val(dateArray[1]);
// });
$("#pickupDate").on('apply.daterangepicker', function (ev, picker) {
    let dateArray = $("#pickupDate").val().split(' ~ ');
    $("#pickupDate").val(dateArray[0]);
    $("#returnDate").val(dateArray[1]);
});

$("#btnSearch").click(async () => {
    // 기존 카드 내용 지우기 (새로 검색할 때마다 업데이트)
    $("#carList").html('');

    let companyCd = $("#pickupLocation").val() * 1;
    
    //인수장소의 값이 없으면 1 넣어주기
    if(isNaN(companyCd)) companyCd = 1;

    let result = await fetchFirstDocument("cars", companyCd);

    makeCarList(result);

    let totalCount = await getTotalDocumentsCount("cars");
    let listCount = carList.childElementCount;

    if (totalCount < listCount) {
        $("#btnMoreList").hide();
    } else {
        $("#btnMoreList").show();
    }
});

$("#btnMoreList").click(async function () {
    let companyCd = $("#pickupLocation").val() * 1;

    let totalCount = await getTotalDocumentsCount("cars");
    let listCount = carList.childElementCount;
    let limitCnt = 0;

    if (totalCount > listCount) {
        $("#btnMoreList").show();
        if(totalCount - listCount < pagingunit){
            limitCnt= totalCount - listCount;
        }
    } else {
        $("#btnMoreList").hide();
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
        card.className = 'col-md-4'; // Bootstrap의 그리드 시스템 사용

        // 카드 HTML 구성
        card.innerHTML = `
            <div class="card">
                <img src="${data.imgurl}" class="card-img-top" alt="차량 이미지">
                <div class="card-body">
                    <h5 class="card-title">${data.modelNm}</h5> <!-- title 값 삽입 -->
                    <p class="card-text">연식: ${data.gear}<br>종류: ${data.grade}<br>가격: ${data.price}원/일</p>
                    <a href="#" onclick="pageMove('${doc.id}')"class="btn btn-primary">자세히 보기</a>
                </div>
            </div>
            `;

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
}