import { fetchOneDocument } from './firebase.js';
import { calRate } from './setting.js';

const id = sessionStorage.getItem("id");
const pickupDate = sessionStorage.getItem("pickupDate");
const returnDate = sessionStorage.getItem("returnDate");

window.onload = async function () {
    let data = await fetchOneDocument(id);

    fetchCarInfo(data);
  
}

function fetchCarInfo(data) {
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
    $("#reserve_goods_thumb").css("background-image","url('"+data.imgurl+"')")
    $("#reserve_goods_text01").html(data.modelNm);
    $("#grade").html(data.grade);
    $("#luggage-count").html(data.bag + '개');
    $("#passenger-capacity").html(data.people + '명');
    $("#transmission").html(data.gear);

    let ariconNm = '';
    data.aircon == '1' ? ariconNm = "있음" : "없음";

    $("#air-conditioning").html(ariconNm);
    $("#door-count").html(data.door + '개');

    $("#totalPrice").val(data.price);
    
}
