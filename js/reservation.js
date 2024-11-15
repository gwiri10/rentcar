import {
    fetchOneDocument
    , fetchData
    , fetchInsurances
    , fetchCarseat
    , addDataId
} from './firebase.js';

const id = sessionStorage.getItem("id");

window.onload = async function () {
    $("#overlay").css("display","none");
    let data = await fetchOneDocument(id);

    fetchCarInfo(data);

    //인수장소 select세팅
    await setLocation("pickupSpot");
    $("#pickupSpot").val(data.companyCd);
    //반납장소 select세팅
    await setLocation("returnSpot");
    $("#returnSpot").val(data.companyCd);

    //사전결제금액 세팅
    let beforePrice = sessionStorage.getItem("beforePrice");
    $("#beforePrice").html(beforePrice);

    //NOC보험가격세팅(업체마다 다르므로)
    let result = await fetchInsurances(data.companyCd);
    result.forEach((doc) => {
        let insData = doc.data();
        if (insData.insuranceCd == 1) {//4~5인승
            $("#insurance1").html(insData.price);
        } else {//7~8인승
            $("#insurance2").html(insData.price);
        }
    });

    //카시트가격세팅(업체마다 다르므로)
    let carseatResult = await fetchCarseat(data.companyCd);
    carseatResult.forEach((doc) => {
        let carseatData = doc.data();
        if (carseatData.carseatCd == 1) {//주니어
            $("#carseat1").html(carseatData.price);
        } else if (carseatData.carseatCd == 2) {//차일드
            $("#carseat2").html(carseatData.price);
        } else {//베이비
            $("#carseat3").html(carseatData.price);
        }
    });

    //풀커버 보험(NOC안심) 가입 여부 선택되면 가격재조정
    $("input[name=NOC]").on("change", function () {
        calPrice();
    });

    //카시트되면 가격재조정
    $("select[name=carseat]").on("change", function () {
        calPrice();
    });

    //처음에 풀커버 보험(NOC안심) 가입으로 되어 있어서 계산하는 함수 한번 불러야함.
    calPrice();

    //예약하기 버튼 세팅
    $($(".submit-btn")[0]).on("click", async function () {
        await fn_reservation();
    })
}

function fetchCarInfo(data) {
    const pickupDate = sessionStorage.getItem("pickupDate");
    const returnDate = sessionStorage.getItem("returnDate");

    $("#carImg").attr("src", data.imgurl); //.차량이미지
    $("#reserve_goods_text01").html(data.modelNm);//차랑 명
    $("#pickupDate").val(pickupDate);//전 페이지에서 설정한 인수날짜
    $("#returnDate").val(returnDate);//전 페이지에서 설정한 반납날짜
    $("#car-people").val(data.people);

}

async function setLocation(id) {
    let optionList = $("#" + id);
    optionList.innerHTML = '';

    let html = "";

    let result = await fetchData("companys");

    result.forEach((doc) => {
        let data = doc.data();
        html += "<option value=" + data.companyCd + ">" + data.companyNm + "</option>";
    });

    optionList.html(html);
}

function calPrice() {
    let diffDay = sessionStorage.getItem("diffDay") * 1;
    let afterPrice = sessionStorage.getItem("afterPrice") * 1;
    //1. 보험 계산
    if ($("input[name=NOC]:checked").val() == 'Y') {
        let people = $("#car-people").val();
        if (people * 1 > 5) { //7~8인승 보험 금액으로 계산
            afterPrice = afterPrice + diffDay * $("#insurance2").html();
        } else {
            afterPrice = afterPrice + diffDay * $("#insurance1").html();
        }
    } else {
        diffDay = 0;
    }

    //2.카시트계산
    //2-1. 주니어
    afterPrice = afterPrice + $("#juniorSeat").val() * $("#carseat1").html();
    //2-2. 차일드
    afterPrice = afterPrice + $("#childSeat").val() * $("#carseat2").html();
    //2-2. 베이비
    afterPrice = afterPrice + $("#babySeat").val() * $("#carseat3").html();

    $("#afterPrice").html(afterPrice);

    $("#ins1").html($("#insurance1").html())
    $("#diffDay").html(diffDay);

    $("#carse1").html($("#carseat1").html())
    $("#carse2").html($("#carseat2").html())
    $("#carse3").html($("#carseat3").html())

    $("#juniorCnt").html($("#juniorSeat").val())
    $("#chileCnt").html($("#childSeat").val())
    $("#babyCnt").html($("#babySeat").val())
}

async function fn_reservation() {
    if (!$("#termsAgreement").is(":checked")) {
        alert("약관에 동의해야 예약 신청이 가능합니다.");
        document.getElementById("termsAgreement").focus();
        return;
    }

    //validation 체크
    if (!validateForm()) return;

    //예약하기
    const driverName = document.getElementById("driverName").value.trim();
    let carName = $("#reserve_goods_text01").html();
    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const flightIn = document.getElementById("flightIn").value.trim();
    const mobile1 = document.getElementById("mobile1").value.trim();
    const mobile2 = document.getElementById("mobile2").value.trim();
    const mobile3 = document.getElementById("mobile3").value.trim();
    const email = document.getElementById("email").value.trim();
    let regDate = getCurrentDateTime();

    let pickupDate = $("#pickupDate").val();
    let pickupSpot = $("#pickupSpot option:selected").html();
    let returnDate = $("#returnDate").val();
    let returnSpot = $("#returnSpot option:selected").html();

    let adultCount = $("#adultCount option:selected").html();
    let childCount = $("#childCount option:selected").html();
    let babyCount = $("#babyCount option:selected").html();
    let infantCount = $("#infantCount option:selected").html();

    let pickupMethod = $("label[for='" + $("input[name=pickupMethod]:checked")[0].id + "']").text();
    let mobile = mobile1 + '-' + mobile2 + '-' + mobile3;

    let insurance;
    if ($("input[name=NOC]:checked").val() == 'Y') {
        insurance = "가입" + " : " + $("#insurance").text().split(" : ")[1];
    } else {
        insurance = "미가입";
    }

    let juniorSeat = $("#juniorSeat").val();
    let childSeat = $("#childSeat").val();
    let babySeat = $("#babySeat").val();

    let addDataMap = {
        driverName: driverName
        , carName: carName
        , lastName: lastName
        , firstName: firstName
        , flightIn: flightIn
        , mobile: mobile
        , email: email
        , pickupDate: pickupDate
        , pickupSpot: pickupSpot
        , returnDate: returnDate
        , returnSpot: returnSpot
        , adultCount: adultCount
        , childCount: childCount
        , babyCount: babyCount
        , infantCount: infantCount
        , pickupMethod: pickupMethod
        , insurance: insurance
        , juniorSeat: juniorSeat
        , childSeat: childSeat
        , babySeat: babySeat
        , resState: 1
        , regDate: regDate //등록날짜
    }

    let result = await addDataId("reservations", addDataMap);
    if (result != false) {
        sessionStorage.setItem("docId", result);
        //결제 
        let paymentItem = {
            amount : sessionStorage.getItem("beforePrice") * 1,
            orderId : result,
            orderName : $("#reserve_goods_text01").text(),
            customerEmail : $("#email").val(),
            customerName : $("#driverName").val(),
            customerMobilePhone : $("#mobile1").val() +$("#mobile2").val() +$("#mobile3").val()
        }
        createPayment(paymentItem);

    } else {
        alert("예약신청에 실패하셨습니다. 관리자에게 문의해주세요.");
    }
}

function validateForm() {
    const driverName = document.getElementById("driverName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const flightIn = document.getElementById("flightIn").value.trim();
    const mobile1 = document.getElementById("mobile1").value.trim();
    const mobile2 = document.getElementById("mobile2").value.trim();
    const mobile3 = document.getElementById("mobile3").value.trim();
    const email = document.getElementById("email").value.trim();

    // 한국어 및 영어 체크 정규 표현식
    const koreanRegex = /^[가-힣]+$/;
    const englishRegex = /^[A-Za-z]+$/;

    // 빈칸 확인 및 포커스 이동
    if (driverName === '') {
        alert("예약자명을 입력해 주세요.");
        document.getElementById("driverName").focus();
        return false;
    } else if (!koreanRegex.test(driverName)) {
        alert("예약자명은 한국어로만 입력해 주세요.");
        document.getElementById("driverName").focus();
        return false;
    }

    if (lastName === '') {
        alert("영문명(성)을 입력해 주세요.");
        document.getElementById("lastName").focus();
        return false;
    } else if (!englishRegex.test(lastName)) {
        alert("영문명(성)은 영어로만 입력해 주세요.");
        document.getElementById("lastName").focus();
        return false;
    }

    if (firstName === '') {
        alert("영문명(이름)을 입력해 주세요.");
        document.getElementById("firstName").focus();
        return false;
    } else if (!englishRegex.test(firstName)) {
        alert("영문명(이름)은 영어로만 입력해 주세요.");
        document.getElementById("firstName").focus();
        return false;
    }

    if (flightIn === '') {
        alert("도착 항공편을 입력해 주세요.");
        document.getElementById("flightIn").focus();
        return false;
    }
    if (mobile1 === '' || mobile2 === '' || mobile3 === '') {
        alert("전화번호를 모두 입력해 주세요.");
        if (mobile1 === '') {
            document.getElementById("mobile1").focus();
        } else if (mobile2 === '') {
            document.getElementById("mobile2").focus();
        } else {
            document.getElementById("mobile3").focus();
        }
        return false;
    }
    if (email === '') {
        alert("이메일을 입력해 주세요.");
        document.getElementById("email").focus();
        return false;
    }

    if ($("#adultCount").val() == '0') {
        alert("성인은 최소 1명이상이어야 합니다.");
        document.getElementById("adultCount").focus();
        return false;
    }

    // 모든 필드가 입력되었을 경우
    return true;
}

//현재 ㅅ ㅣ간 뽑아오기
function getCurrentDateTime() {
    const now = new Date();  // 현재 날짜와 시간
    const year = now.getFullYear();  // 연도
    const month = String(now.getMonth() + 1).padStart(2, '0');  // 월 (0부터 시작하므로 1을 더해주고 2자리로 포맷)
    const day = String(now.getDate()).padStart(2, '0');  // 날짜 (2자리로 포맷)
    const hours = String(now.getHours()).padStart(2, '0');  // 시간 (24시간제, 2자리로 포맷)
    const minutes = String(now.getMinutes()).padStart(2, '0');  // 분 (2자리로 포맷)

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
