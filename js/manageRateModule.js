import { fetchData, updateDocument } from './firebase.js';

window.onload = async function () {
    await Search();

    $(".edit-btn").on("click", function(){
        changeRate();
    });
}

async function Search() {
    let result = await fetchData("rate");
    result.forEach((doc) => {
        $("#rate").val(doc.data().rate)
        $("#id").val(doc.id);
    });
}

async function changeRate(state) {
    let id = $("#id").val();
    let updateData = { "rate": $("#rate").val()*1 }
    let result = await updateDocument("rate", id, updateData);

    if (result) {
        alert("변경되었습니다.");
        Search();
    }
}