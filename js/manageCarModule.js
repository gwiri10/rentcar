import { fetchData, fetchCarDocument, updateDocument, addData, deleteItem } from './firebase.js';

window.onload = async function () {
    let search_company = document.getElementById("search-company");
    await setLocation(search_company);
    await btnSearch();
}
// 차량 정보를 펼치거나 접는 함수
export function toggleDetails(event, cardElement) {
    // input, button 또는 action-buttons 내부 클릭 시 실행 중지
    if (event.target.closest('input')
        || event.target.closest('button')
        || event.target.closest('.action-buttons')
        || event.target.closest('select')) {
        return;
    }

    cardElement.classList.toggle('expanded');
}

// 차량 삭제 함수
export async function deleteCar(id) {
    event.stopPropagation();
    let result = await deleteItem("cars", id);
    if (result) {
        alert("차량이 삭제되었습니다.");
        const card = event.target.closest('.car-card');
        card.remove();
    }
}

// 차량 추가 함수
export async function addCar() {
    //아직 수정중이거나 추가하려는 항목이 있을 시 return
    if (document.getElementsByClassName("expanded").length > 0) {
        alert("아직 추가 또는 수정중인 항목이 있습니다. 작업을 완료하고 다시 시도해주세요.");
        return;
    }
    const carList = document.getElementById('car-list');

    // 새로운 차량 카드 생성
    const newCarCard = document.createElement('div');
    newCarCard.className = 'car-card expanded';
    newCarCard.onclick = function (event) { toggleDetails(event, newCarCard); };
    newCarCard.innerHTML = `
        <div class="car-details">
            <table class="car-info-table">
                <tr>
                    <th>모델명</th>
                    <td><input class="inp-car" name="modelNm" type="text" /></td>
                </tr>
                <tr>
                    <th>등급</th>
                    <td><input class="inp-car" name="grade" type="text"/></td>
                </tr>
                <tr>
                    <th>수하물</th>
                    <td><input class="inp-car" name='bag' type="text"  /></td>
                </tr>
                <tr>
                    <th>인원</th>
                    <td><input class="inp-car" name="people" type="text" /></td>
                </tr>
                <tr>
                    <th>변속기</th>
                    <td><input class="inp-car" name="gear" type="text" /></td>
                </tr>
                <tr>
                    <th>에어컨</th>
                    <td>
                        <select class="search-input aircon" name="aircon">
                            <option value=1>있음</option>
                            <option value=2>없음</option>
                    </td>
                </tr>
                <tr>
                    <th>문 갯수</th>
                    <td><input class="inp-car" name="door" type="text" /></td>
                </tr>
                <tr>
                    <th>이미지URL</th>
                    <td><input class="inp-car" name="imgurl" type="text"/></td>
                </tr>
                <tr>
                    <th>금액</th>
                    <td><input class="inp-car" name="price" type="text"/></td>
                </tr>
                <tr>
                    <th>비수기기간</th>
                    <td><input class="inp-car" name="upData1" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                </tr>
                <tr>
                    <th>준성수기기간</th>
                    <td><input class="inp-car" name="upData2" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                </tr>
                <tr>
                    <th>성수기기간</th>
                    <td><input class="inp-car" name="upData3" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                </tr>
                <tr>
                    <th>극성수기기간</th>
                    <td><input class="inp-car" name="upData4" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                </tr>

                <tr>
                    <th>비수기 : 24H추가요금</th>
                    <td><input class="inp-car" name="addprice24_1" type="text"></td>
                </tr>
                <tr>
                    <th>비수기 : 48H추가요금</th>
                    <td><input class="inp-car" name="addprice48_1" type="text"></td>
                </tr>
                <tr>
                    <th>비수기 : 72H추가요금</th>
                    <td><input class="inp-car" name="addprice72_1" type="text"></td>
                </tr>
                <tr>
                    <th>비수기 : 96H추가요금</th>
                    <td><input class="inp-car" name="addprice96_1" type="text"></td>
                </tr>
                <tr>
                    <th>비수기 : 1박당추가요금(96H초과)</th>
                    <td><input class="inp-car" name="addprice100_1" type="text"></td>
                </tr>

                <tr>
                    <th>준성수기 : 24H추가요금</th>
                    <td><input class="inp-car" name="addprice24_2" type="text"></td>
                </tr>
                <tr>
                    <th>준성수기 : 48H추가요금</th>
                    <td><input class="inp-car" name="addprice48_2" type="text"></td>
                </tr>
                <tr>
                    <th>준성수기 : 72H추가요금</th>
                    <td><input class="inp-car" name="addprice72_2" type="text"></td>
                </tr>
                <tr>
                    <th>준성수기 : 96H추가요금</th>
                    <td><input class="inp-car" name="addprice96_2" type="text"></td>
                </tr>
                <tr>
                    <th>준성수기 : 1박당추가요금(96H초과)</th>
                    <td><input class="inp-car" name="addprice100_2" type="text"></td>
                </tr>

                <tr>
                    <th>성수기 : 24H추가요금</th>
                    <td><input class="inp-car" name="addprice24_3" type="text"></td>
                </tr>
                <tr>
                    <th>성수기 : 48H추가요금</th>
                    <td><input class="inp-car" name="addprice48_3" type="text"></td>
                </tr>
                <tr>
                    <th>성수기 : 72H추가요금</th>
                    <td><input class="inp-car" name="addprice72_3" type="text"></td>
                </tr>
                <tr>
                    <th>성수기 : 96H추가요금</th>
                    <td><input class="inp-car" name="addprice96_3" type="text"></td>
                </tr>
                <tr>
                    <th>성수기 : 1박당추가요금(96H초과)</th>
                    <td><input class="inp-car" name="addprice100_3" type="text"></td>
                </tr>

                <tr>
                    <th>극성수기 : 24H추가요금</th>
                    <td><input class="inp-car" name="addprice24_4" type="text"></td>
                </tr>
                <tr>
                    <th>극성수기 : 48H추가요금</th>
                    <td><input class="inp-car" name="addprice48_4" type="text"></td>
                </tr>
                <tr>
                    <th>극성수기 : 72H추가요금</th>
                    <td><input class="inp-car" name="addprice72_4" type="text"></td>
                </tr>
                <tr>
                    <th>극성수기 : 96H추가요금</th>
                    <td><input class="inp-car" name="addprice96_4" type="text"></td>
                </tr>
                <tr>
                    <th>극성수기 : 1박당추가요금(96H초과)</th>
                    <td><input class="inp-car" name="addprice100_4" type="text"></td>
                </tr>

                <tr>
                    <th>예약불가기간</th>
                    <td><input class="inp-car" name="downData" type="text" placeholder="yy/mm/dd - yy/mm/dd/"/></td>
                </tr>
                <tr>
                    <th>사전결제비율</th>
                    <td><input class="inp-car" name="rate" type="text" placeholder="20"/></td>
                </tr>
                <tr>
                    <th>업체명</th>
                    <td><select class="search-input companyCd" name="companyCd"></select></td>
                </tr>
            </table>
            <div class="action-buttons">
                <button class="edit-btn" onclick="addCarModule();">추가</button>
                <button class="delete-btn" onclick="cancleCar(this)">취소</button>
            </div>
        </div>
    `;

    // 리스트 맨 위에 새 차량 카드 추가
    carList.insertBefore(newCarCard, carList.firstChild);

    let companyCd = newCarCard.getElementsByClassName("companyCd")[0];
    await setLocation(companyCd);
}

export function cancleCar(object) {
    let flag = confirm("취소하시겠습니까?");
    if (flag) object.parentElement.parentElement.parentElement.remove();
}
export async function setLocation(optionList) {
    optionList.innerHTML = '';

    let html = "";

    let result = await fetchData("companys");

    result.forEach((doc) => {
        let data = doc.data();
        html += "<option value=" + data.companyCd + ">" + data.companyNm + "</option>";
    });

    optionList.innerHTML = html;
}

$("#search-company").change(async () => {
    await btnSearch();
});
//검색하기
async function btnSearch() {
    let cardContainer = document.getElementById("car-list"); // 카드 컨테이너 선택
    cardContainer.innerHTML = '';

    let companyCd = $("#search-company").val() * 1;
    let companyNm = $("#search-company").text();
    let result = await fetchCarDocument("cars", companyCd);

    if (!result.empty) {
        result.forEach((doc) => {
            let data = doc.data();

            const newCarCard = document.createElement('div');
            newCarCard.className = 'car-card ' + doc.id;
            newCarCard.onclick = function (event) { toggleDetails(event, newCarCard); };
            newCarCard.innerHTML = `
                <div class="car-simple-info">
                    <img src="${data.imgurl}" class="car-img" alt="차량 이미지">
                    <div class="car-info-text">
                        <h3 class="car-title">${data.modelNm}</h3>
                        <p class="car-company">금액 : ${data.price}</p>
                    </div>
                </div>
                <div class="car-details">
                    <table class="car-info-table" id="${doc.id}">
                        <tr>
                            <th>모델명</th>
                            <td><input class="inp-car" name="modelNm" type="text" value="${data.modelNm}" /></td>
                        </tr>
                        <tr>
                            <th>등급</th>
                            <td><input class="inp-car" name="grade" type="text" value="${data.grade}" /></td>
                        </tr>
                        <tr>
                            <th>수하물</th>
                            <td><input class="inp-car" name='bag' type="text" value="${data.bag}" /></td>
                        </tr>
                        <tr>
                            <th>인원</th>
                            <td><input class="inp-car" name="people" type="text" value="${data.people}" /></td>
                        </tr>
                        <tr>
                            <th>변속기</th>
                            <td><input class="inp-car" name="gear" type="text" value="${data.gear}" /></td>
                        </tr>
                        <tr>
                            <th>에어컨</th>
                            <td>
                                <select class="search-input aircon" name="aircon">
                                    <option value=1>있음</option>
                                    <option value=2>없음</option>
                            </td>
                        </tr>
                        <tr>
                            <th>문 갯수</th>
                            <td><input class="inp-car" name="door" type="text" value="${data.door}" /></td>
                        </tr>
                        <tr>
                            <th>이미지URL</th>
                            <td><input class="inp-car" name="imgurl" type="text" value="${data.imgurl}" /></td>
                        </tr>
                        <tr>
                            <th>금액</th>
                            <td><input class="inp-car" name="price" type="text" value="${data.price}" /></td>
                        </tr>
                        <tr>
                            <th>비수기기간</th>
                            <td><input class="inp-car" name="upData1" value="${val(data.upData1)}" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                        </tr>
                        <tr>
                            <th>준성수기기간</th>
                            <td><input class="inp-car" name="upData2" value="${val(data.upData2)}" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                        </tr>
                        <tr>
                            <th>성수기기간</th>
                            <td><input class="inp-car" name="upData3" value="${val(data.upData3)}" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                        </tr>
                        <tr>
                            <th>극성수기기간</th>
                            <td><input class="inp-car" name="upData4" value="${val(data.upData4)}" type="text" placeholder="yy/mm/dd - yy/mm/dd/"></td>
                        </tr>
                        
                        <tr>
                            <th>비수기 : 24H추가요금</th>
                            <td><input class="inp-car" name="addprice24_1" value="${val(data.addprice24_1)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>비수기 : 48H추가요금</th>
                            <td><input class="inp-car" name="addprice48_1" value="${val(data.addprice48_1)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>비수기 : 72H추가요금</th>
                            <td><input class="inp-car" name="addprice72_1" value="${val(data.addprice72_1)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>비수기 : 96H추가요금</th>
                            <td><input class="inp-car" name="addprice96_1" value="${val(data.addprice96_1)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>비수기 : 1박당추가요금(96H초과)</th>
                            <td><input class="inp-car" name="addprice100_1" value="${val(data.addprice100_1)}" type="text"/></td>
                        </tr>

                        <tr>
                            <th>준성수기 : 24H추가요금</th>
                            <td><input class="inp-car" name="addprice24_2" value="${val(data.addprice24_2)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>준성수기 : 48H추가요금</th>
                            <td><input class="inp-car" name="addprice48_2" value="${val(data.addprice48_2)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>준성수기 : 72H추가요금</th>
                            <td><input class="inp-car" name="addprice72_2" value="${val(data.addprice72_2)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>준성수기 : 96H추가요금</th>
                            <td><input class="inp-car" name="addprice96_2" value="${val(data.addprice96_2)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>준성수기 : 1박당추가요금(96H초과)</th>
                            <td><input class="inp-car" name="addprice100_2" value="${val(data.addprice100_2)}" type="text"/></td>
                        </tr>

                        <tr>
                            <th>성수기 : 24H추가요금</th>
                            <td><input class="inp-car" name="addprice24_3" value="${val(data.addprice24_3)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>성수기 : 48H추가요금</th>
                            <td><input class="inp-car" name="addprice48_3" value="${val(data.addprice48_3)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>성수기 : 72H추가요금</th>
                            <td><input class="inp-car" name="addprice72_3" value="${val(data.addprice72_3)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>성수기 : 96H추가요금</th>
                            <td><input class="inp-car" name="addprice96_3" value="${val(data.addprice96_3)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>성수기 : 1박당추가요금(96H초과)</th>
                            <td><input class="inp-car" name="addprice100_3" value="${val(data.addprice100_3)}" type="text"/></td>
                        </tr>

                        <tr>
                            <th>극성수기 : 24H추가요금</th>
                            <td><input class="inp-car" name="addprice24_4" value="${val(data.addprice24_4)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>극성수기 : 48H추가요금</th>
                            <td><input class="inp-car" name="addprice48_4" value="${val(data.addprice48_4)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>극성수기 : 72H추가요금</th>
                            <td><input class="inp-car" name="addprice72_4" value="${val(data.addprice72_4)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>극성수기 : 96H추가요금</th>
                            <td><input class="inp-car" name="addprice96_4" value="${val(data.addprice96_4)}" type="text"/></td>
                        </tr>
                        <tr>
                            <th>극성수기 : 1박당추가요금(96H초과)</th>
                            <td><input class="inp-car" name="addprice100_4" value="${val(data.addprice100_4)}" type="text"/></td>
                        </tr>

                        <tr>
                            <th>예약불가기간</th>
                            <td><input class="inp-car" name="downData" value="${val(data.downData)}" type="text" placeholder="yy/mm/dd - yy/mm/dd/"/></td>
                        </tr>
                         <tr>
                            <th>사전결제비율</th>
                            <td><input class="inp-car" name="rate" value="${val(data.rate)}" type="text" placeholder="20"/></td>
                        </tr>
                        <tr>
                            <th>업체명</th>
                            <td><select class="search-input companyCd" name="companyCd"></select></td>
                        </tr>
                    </table>
                    <div class="action-buttons">
                        <button class="edit-btn">수정</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                </div>
            `;
            // 카드 컨테이너에 카드 추가
            cardContainer.appendChild(newCarCard);

            let companyCd = newCarCard.getElementsByClassName("companyCd")[0]
            setLocation(companyCd);
            companyCd.value = data.companyCd;

            newCarCard.getElementsByClassName("aircon")[0].value = data.aircon;

            $("#search-company").change(async () => {
                await btnSearch();
            });

            newCarCard.getElementsByClassName("edit-btn")[0].onclick = async function () {
                await editCar(doc.id);
            }

            newCarCard.getElementsByClassName("delete-btn")[0].onclick = async function () {
                let result = await deleteCar(doc.id);
                if (result) {
                    alert("완료되었습니다.");
                    await btnSearch();
                }
            }
        });
    } else {
        cardContainer.innerHTML = '검색 결과가 없습니다.';
    }

}
function val(data){
    if(data == undefined){
        return '';
    }else{
        return data;
    }
}
// 차량 수정 함수
async function editCar(id) {
    let inpboxArr = document.getElementById(id).getElementsByClassName("inp-car");

    // 빈 객체 생성
    const updatedData = {};

    // for 문을 사용하여 각 필드와 값을 updatedData 객체에 추가
    for (let i = 0; i < inpboxArr.length; i++) {
        let fieldName = inpboxArr[i].name; // id를 필드 이름으로 사용
        let fieldValue = inpboxArr[i].value; // value를 데이터 값으로 사용

        if (fieldName == 'price') {
            fieldValue = fieldValue * 1;
            if (isNaN(fieldValue)) {
                alert("금액은 숫자만 입력하세요.");
                return false;
            }
        }
        updatedData[fieldName] = fieldValue; // updatedData 객체에 필드 추가
    }

    updatedData["companyCd"] = document.getElementById(id).getElementsByClassName("companyCd")[0].value * 1;
    updatedData["aircon"] = document.getElementById(id).getElementsByClassName("aircon")[0].value * 1;

    let result = await updateDocument("cars", id, updatedData);

    if (result) {
        alert("성공적으로 완료되었습니다.");
        document.getElementsByClassName(id)[0].classList.toggle('expanded');
    }
}

export async function addCarModule() {
    let inpboxArr = document.getElementsByClassName("car-card")[0].childNodes[1].children[0].getElementsByClassName("inp-car");
    let inputList = document.getElementsByClassName("car-card")[0].childNodes[1].children[0];
    // 빈 객체 생성
    const updatedData = {};

    // for 문을 사용하여 각 필드와 값을 updatedData 객체에 추가
    for (let i = 0; i < inpboxArr.length; i++) {
        let fieldName = inpboxArr[i].name; // id를 필드 이름으로 사용
        let fieldValue = inpboxArr[i].value; // value를 데이터 값으로 사용

        if (fieldName == 'price') {
            fieldValue = fieldValue * 1;
            if (isNaN(fieldValue)) {
                alert("금액은 숫자만 입력하세요.");
                return false;
            }
        }

        if (fieldValue == '') {
            alert('입력하지 않은 항목이 있습니다.');
            return;
        }
        updatedData[fieldName] = fieldValue; // updatedData 객체에 필드 추가
    }

    updatedData["companyCd"] = inputList.getElementsByClassName("companyCd")[0].value * 1;
    updatedData["aircon"] = inputList.getElementsByClassName("aircon")[0].value * 1;

    let result = await addData("cars", updatedData);
    if (result) {
        alert("완료되었습니다.");
        await btnSearch();
    }
}