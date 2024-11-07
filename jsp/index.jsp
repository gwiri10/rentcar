<%@ include file="jsp/home.jsp" %>
    <div class="container">
        <!-- 카드 넣는곳 https://img.icons8.com/?size=100&id=46756&format=png&color=000000-->
        <div class="card-container" id="cardContainer">
            <div class="card benefit-card">
                <ul class="benefit-card-ul">
                    <li class="benefit-card-li benefit-card-li-img">
                        <img src="https://img.icons8.com/?size=100&id=FdU0YUFRZ5G0&format=png&color=000000" alt="카드 1"
                            class="card-image">
                    </li>
                    <li class="benefit-card-li benefit-card-li-sub">
                        <p class="card-title">한국어 상담 서비스 제공!</p>
                        <p class="card-description">궁금한 내용은 언제든지 한국어로 상담받고 문의하세요</p>
                    </li>
                </ul>
            </div>
            <div class="card benefit-card">
                <ul class="benefit-card-ul">
                    <li class="benefit-card-li benefit-card-li-img">
                        <img src="https://img.icons8.com/?size=100&id=46756&format=png&color=000000" alt="카드 1"
                            class="card-image">
                    </li>
                    <li class="benefit-card-li benefit-card-li-sub">
                        <p class="card-title">완전 자차 보험으로 안심 보장</p>
                        <p class="card-description">사고 발생 시, 완벽한 보장으로 걱정 없이 이용하실 수 있어요</p>
                    </li>
                </ul>
            </div>
            <div class="card benefit-card">
                <ul class="benefit-card-ul">
                    <li class="benefit-card-li benefit-card-li-img">
                        <img src="https://img.icons8.com/?size=100&id=Ib6dAoXkBweM&format=png&color=000000" alt="카드 1"
                            class="card-image">
                    </li>
                    <li class="benefit-card-li benefit-card-li-sub">
                        <p class="card-title">유연한 예약 변경 가능</p>
                        <p class="card-description">자유롭게 필요에 따라 예약을 변경하실 수 있어요.</p>
                    </li>
                </ul>
            </div>
        </div>
        <div id="cardControl">
            <p class="text-center h2-i"><i class="fa-solid fa-chevron-up i-icon"></i></p>
        </div>

        <!-- 예약하기 위한 검색 정보 받는 곳 -->
        <div class="container mt-5">
            <h3 class="tilteBold">차량 예약 검색</h3>
            <div class="row">
                <div class="col-md-3 col-12">
                    <div class="form-group">
                        <label for="pickupLocation">인수 장소</label>
                        <select class="form-control" id="pickupLocation">
                            <option>선택하세요</option>
                            <option>부산</option>
                            <option>서울</option>
                            <option>제주도</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-12">
                    <div class="form-group">
                        <label for="pickupDate">대여 일시</label>
                        <div class="date-time-group">
                            <input type="text" class="form-control datepicker" id="pickupDate" placeholder="대여기간 선택">
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-12">
                    <div class="form-group">
                        <label for="returnDate">반납 일시</label>
                        <div class="date-time-group">
                            <input type="text" class="form-control datepicker" onclick="$('#pickupDate').click();"
                                id="returnDate" placeholder="날짜 선택">
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-12">
                    <div class="form-group">
                        <button class="btn btn-primary btn-block" id="btnSearch">
                            검색 <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-4">
            <h3>예약 가능 목록</h3>
            <div class="row" id="carList">
                <!-- <div class="col-md-4">
                    <div class="card">
                        <img src="car1.jpg" class="card-img-top" alt="차량 이미지">
                        <div class="card-body">
                            <h5 class="card-title">현대 아반떼</h5>
                            <p class="card-text">연식: 2021<br>색상: 블랙<br>가격: 50,000원/일</p>
                            <a href="#" class="btn btn-primary">자세히 보기</a>
                        </div>
                    </div>
                </div> -->
                
            </div>
            <div style="text-align:center;">
                <button class="btn btn-primary" id="btnMoreList" style="display:none;">더보기+</button>
            </div>
        </div>
    </div>
<%@ include file="jsp/footer.jsp" %>