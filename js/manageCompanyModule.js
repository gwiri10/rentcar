import { fetchData, updateDocument, addData, deleteItem, fetchComCdMax} from './firebase.js';

window.onload = async function () {
    await btnSearch();
}
// 업체 삭제 함수
export async function deleteCompany(id) {
    let result = await deleteItem("companys", id);
    if(result){
        alert("업체가 삭제되었습니다");
        await btnSearch();
    }
}

// 업체 추가 함수
export async function addCompany() {
    //아직 수정중이거나 추가하려는 항목이 있을 시 return
    if(document.getElementsByClassName("expanded").length > 0){
        alert("아직 추가중인 항목이 있습니다. 작업을 완료하고 다시 시도해주세요.");
        return;
    }
    const carList = document.getElementById('car-list');

    // 새로운 차량 카드 생성
    const newCarCard = document.createElement('div');
    newCarCard.className = 'car-card expanded';
    newCarCard.innerHTML = `
        <div class="company">
            <p>업체명 : </p>
            <input type="text" value=""/>
        </div>
        <div class="company-details">
                <table class="info-table">
                    <tr>
                        <th>주소지</th>
                        <td><input type="text" value="" /></td>
                    </tr>
                    <tr>
                        <th>긴급연락처</th>
                        <td><input type="text" value="" /></td>
                    </tr>
                    <tr>
                        <th>영업시간</th>
                        <td><input type="text" value="" /></td>
                    </tr>
                    <tr>
                        <th>무료서비스</th>
                        <td><input type="text" value="" /></td>
                    </tr>
                </table>
            </div>
        <div class="action-buttons">
            <button class="edit-btn" onclick="addCompanyModule()">추가</button>
            <button class="delete-btn" onclick="cancelCompany(this)">취소</button>
        </div>
    `;

    // 리스트 맨 위에 새 차량 카드 추가
    carList.insertBefore(newCarCard, carList.firstChild);

}

export function cancelCompany(object){
    let flag = confirm("취소하시겠습니까?");
    if(flag) object.parentElement.parentElement.remove();
}
//검색하기
async function btnSearch() {
    let cardContainer = document.getElementById("car-list"); // 카드 컨테이너 선택
    cardContainer.innerHTML = '';

    let result = await fetchData("companys");

    result.forEach((doc) => {
        let data = doc.data();

        const newCarCard = document.createElement('div');
        newCarCard.className = 'car-card '+doc.id;
        newCarCard.innerHTML = `
            <div class="company">
                <p>업체명 : </p>
                <input type="text" id="${doc.id}" value="${data.companyNm}"/>
            </div>
            <div class="company-details">
                <table class="info-table">
                    <tr>
                        <th>주소지</th>
                        <td><input type="text" value="${data.address}" /></td>
                    </tr>
                    <tr>
                        <th>긴급연락처</th>
                        <td><input type="text" value="${data.telephone}" /></td>
                    </tr>
                    <tr>
                        <th>영업시간</th>
                        <td><input type="text" value="${data.openTime}" /></td>
                    </tr>
                    <tr>
                        <th>무료서비스</th>
                        <td><input type="text" value="${data.freeService}" /></td>
                    </tr>
                </table>
            </div>
            <div class="action-buttons">
                <button class="edit-btn">수정</button>
                <button class="delete-btn">삭제</button>
            </div>
        `;
        // 카드 컨테이너에 카드 추가
        cardContainer.appendChild(newCarCard);

        newCarCard.getElementsByClassName("edit-btn")[0].onclick = async function(){
            await editCompany(doc.id);
        }

        newCarCard.getElementsByClassName("delete-btn")[0].onclick = async function(){
            let result = await deleteCompany(doc.id);
        }
    });

}

// 차량 수정 함수
async function editCompany(id) {
    //수정할 업체명
    let editComNm = $("#"+id).val();

    //객체 생성
    const updatedData = {
        companyNm       : editComNm, //업체명
    };

    let result = await updateDocument("companys", id, updatedData);

    if(result){
        alert("수정이 완료되었습니다.");
        btnSearch();
    }

}

export async function addCompanyModule(){

    //수정할 업체명
    let editComNm = document.getElementsByClassName("expanded")[0].getElementsByTagName("input")[0].value;

    //companyCd Max값 구해오기
    let companyCd = await fetchComCdMax();

    //객체 생성
    const updatedData = {
        collectionName  : "companys",
        companyNm       : editComNm, //업체명
        companyCd       : companyCd +1                 //업체코드
    };

    let result = await addData("companys", updatedData);
    if(result){
        alert("완료되었습니다.");
        await btnSearch();
    }
}