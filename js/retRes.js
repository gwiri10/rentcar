import { fetchOneResDocument, updateDocument, getTotalDocumentsCount, fetchNextDocument } from './firebase.js';

document.addEventListener('DOMContentLoaded', async function () {
    let id = sessionStorage.getItem("docId");
    if (id === null) {
        const loginContainer = document.querySelector('.login-container');
        const bordContainer = document.querySelector('.bord-container');
        const checkReservationButton = document.getElementById('check-reservation');
        const reservationInfo = document.getElementById('reservation-info');

        // 예약 조회 버튼 클릭 시
        checkReservationButton.addEventListener('click', async function () {
            const name = document.getElementById('name').value;
            const reservationNumber = document.getElementById('reservation-number').value;
            const email = document.getElementById('email').value;

            // 입력 값이 모두 채워졌는지 확인
            if (!name || !reservationNumber || !email) {
                alert('모든 필드를 입력하세요.');
                return;
            }
            sessionStorage.clear();
            await findRes(0, reservationNumber, name, email);

        });
    } else {
        await findRes(1, id, null, null);
    }

});

async function findRes(flag, reservationNumber, name, email) {
    let result = await fetchOneResDocument("reservations", reservationNumber);

    if (flag == 0) {
        // 예약 정보 조회
        if (result == null) {
            alert('예약번호를 확인하세요.');
            return;
        } else {
            if (result.email != email) {
                alert("예약 정보가 일치하지 않습니다.");
                return;
            } else if (result.driverName != name) {
                alert("예약 정보가 일치하지 않습니다.");
                return;
            }
        }
    }

    if (result.resState == 1) {
        $("#resState").addClass('status-waiting');
        $("#resState").html("예약대기")
    } else if (result.resState == 2) {
        $("#resState").addClass('status-confirmed');
        $("#resState").html("예약확정")
    } else {
        $("#resState").addClass('status-cancelled');
        $("#resState").html("예약취소")
    }

    let reservationInfo = document.getElementById('reservation-info');
    reservationInfo.innerHTML = `
        <table>
            <tr><td><strong>예약번호:</strong></td><td><strong>${reservationNumber}</strong></td></tr>
            <tr><td><strong>예약자:</strong></td><td>${result.driverName}</td></tr>
            <tr><td><strong>예약한 차량:</strong></td><td>${result.carName}</td></tr>
            <tr><td><strong>성:</strong></td><td>${result.lastName}</td></tr>
            <tr><td><strong>이름:</strong></td><td>${result.firstName}</td></tr>
            <tr><td><strong>인수 날짜 및 시간:</strong></td><td>${result.pickupDate}</td></tr>
            <tr><td><strong>인수 장소:</strong></td><td>${result.pickupSpot === 1 ? '공항' : '기타'}</td></tr>
            <tr><td><strong>반납 날짜 및 시간:</strong></td><td>${result.returnDate}</td></tr>
            <tr><td><strong>반납 장소:</strong></td><td>${result.returnSpot === 1 ? '공항' : '기타'}</td></tr>
            <tr><td><strong>도착 항공편:</strong></td><td>${result.flightIn}</td></tr>
            <tr><td><strong>성인 수:</strong></td><td>${result.adultCount}</td></tr>
            <tr><td><strong>소인 수:</strong></td><td>${result.childCount}</td></tr>
            <tr><td><strong>유아 수:</strong></td><td>${result.babyCount}</td></tr>
            <tr><td><strong>영아 수:</strong></td><td>${result.infantCount}</td></tr>
            <tr><td><strong>수령 방법:</strong></td><td>${result.pickupMethod}</td></tr>
            <tr><td><strong>전화번호:</strong></td><td>${result.mobile}</td></tr>
            <tr><td><strong>이메일:</strong></td><td>${result.email}</td></tr>
            <tr><td><strong>보험:</strong></td><td>${result.insurance}</td></tr>
            <tr><td><strong>주니어 카시트:</strong></td><td>${result.juniorSeat}</td></tr>
            <tr><td><strong>차일드 카시트:</strong></td><td>${result.childSeat}</td></tr>
            <tr><td><strong>베이비 카시트:</strong></td><td>${result.babySeat}</td></tr>
            <tr><td><strong>등록 날짜:</strong></td><td>${result.regDate}</td></tr>
        </table>
        `;
    // 로그인 컨테이너 숨기고 예약 정보 컨테이너 표시
    const loginContainer = document.querySelector('.login-container');
    const bordContainer = document.querySelector('.bord-container');
    loginContainer.style.display = 'none';
    bordContainer.style.display = 'block';


    var search = location.search
    var params = new URLSearchParams(search);
    var paymentKey = params.get('paymentKey');

    if(paymentKey != null){
        updateDocument("reservations",reservationNumber, {
            paymentKey : paymentKey
        } )
    }

}
