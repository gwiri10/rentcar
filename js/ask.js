import { addData, fetchData, getTotalDocumentsCount, fetchNextDocument } from './firebase.js';

window.onload = async function () {
    await fetchAskData();
}

async function fetchAskData() {
    let result = await fetchData("ask");
    $("#askList").html("");
    let html = "";
    if(result.size==0){
        html +=`
            <div class="notice">
                <div class="card-body">
                    <p class="card-title">검색결과가 없습니다.</p>
                </div>
            </div>
            `;
    }else{
        result.forEach((doc) => {
            let data = doc.data();
            
            html +=`
                <div class="notice">
                    <div class="card-body">
                        <p class="card-title">${data.title}</p>`
                        if(data.regState == '1'){
                            html+=`<label class="ask-wating">답변대기</label>`
                        }else{
                            html+=`<label class="ask-done">답변완료</label>`
                        }
                    html+=`</div>
                </div>
                `;
    
        });
    }

    $("#askList").html(html);
}

$("#ask-button").on("click", function () {
    $(".ask-container")[0].style.display = 'block';
    $(".content")[0].style.display = 'none';
})

$("#reg_ask").on("click", async function () {
    const title = $("#title").val();
    const content = $("#content").val();
    const email = $("#email").val();

    if (title == "" || content == "" || email == "") {
        alert("입력되지 않은 항목이 있습니다")
        return;
    }

    let updateData = {
        title: title,
        content: content,
        email: email, 
        regState : 1
    }
    let result = await addData("ask", updateData);

    if (result) {
        alert("완료되었습니다.");
        await fetchAskData();
        $("#back_ask").click();
    }
})
$("#back_ask").on("click", function () {
    $("#title").val("");
    $("#content").val("");
    $("#email").val("");
    $(".ask-container")[0].style.display = 'none';
    $(".content")[0].style.display = 'block';
})