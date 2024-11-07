<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>니혼카</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="style/styles.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />

</head>

<body>

    <header class="bg-white text-white" style="background-color: #ffffff;">
        <div class="container d-flex justify-content-between align-items-center py-3">
            <div class="d-flex align-items-center">
                <img src="logo.png" alt="로고" class="logo">
                <h1 class="ml-2 logoTitle">니혼카</h1>
            </div>
        </div>
    </header>

    <!-- 상단 메뉴 -->
    <nav class="bg-dark">
        <div class="container">
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link text-white" href="#">홈</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white" href="#">차량 리스트</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white" href="#">예약하기</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white" href="#">문의하기</a>
                </li>
            </ul>
        </div>
    </nav>
    <!-- <div class="bannerContainer">
        <img src="img/banner.png" alt="배너 이미지" class="img-fluid banner">
    </div> -->

    <!-- 배너 이미지와 블러 오버레이 추가 -->
    <div class="banner-wrapper" id="bannerContainer">
        <div class="blur-background"></div>
        <img src="img/banner.png" alt="배너 이미지" class="banner-image">
    </div>