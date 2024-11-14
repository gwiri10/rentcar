
import { firebaseConfig, pagingunit } from "./setting.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const carsCollection = collection(db, "cars");

//페이징을 위한 전역변수 선언
let firstVisibleDoc = null;
let lastVisibleDoc = null;

//문서 추가
export async function addData(colNm, item) {
    // 데이터를 추가할 cars 컬렉션 참조
    const itemCollectionRef = collection(db, colNm);

    try {
        const docRef = await addDoc(itemCollectionRef, item);
        return true;
    } catch (e) {
        return false;
    }
}

//문서 추가 후 아이디 가져와야함
export async function addDataId(colNm, item) {
    // 데이터를 추가할 cars 컬렉션 참조
    const itemCollectionRef = collection(db, colNm);

    try {
        const docRef = await addDoc(itemCollectionRef, item);
        return docRef.id;
    } catch (e) {
        return false;
    }
}
// 데이터 전체 가져오기 함수
export async function fetchData(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));

    return querySnapshot;
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    // });
}

// 전체 문서 개수 가져오기
export async function getTotalDocumentsCount(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const totalCount = querySnapshot.size;
    console.log("Total document count: ", totalCount);
    return totalCount;
}

// 문서ID로 데이터 가져오기
export async function fetchOneDocument(documentId) {
    const documentRef = doc(carsCollection, documentId); // 특정 문서 참조
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        return data;
    } else {
        return null;
    }
}

// 문서ID로 데이터 가져오기
export async function fetchOneResDocument(colNm , documentId) {
    let collectionDb = collection(db, colNm);
    const documentRef = doc(collectionDb, documentId); // 특정 문서 참조
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        return data;
    } else {
        return null;
    }
}


// companyCd Max값 구해오기
export async function fetchComCdMax() {
    const q = query(
        collection(db, "companys")
        , orderBy("companyCd", "desc")
        , limit(1)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0].data().companyCd;
}

// 업체코드로 차량 데이터 가져오기
export async function fetchCarDocument(collectionName, companyCd) {
    const q = query(
        collection(db, collectionName)
        , where("companyCd", "==", companyCd)
        , orderBy("price")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        firstVisibleDoc = querySnapshot.docs[0];
        lastVisibleDoc = querySnapshot.docs[0];

        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // });

    } else {
        console.log("No documents found");
    }

    return querySnapshot;
}

// 업체코드로 업체명 가져오기
export async function fetchCompanysDocument(companyCd) {
    const q = query(
        collection(db, "companys")
        , where("companyCd", "==", companyCd)
        , limit(1)
    );
    const querySnapshot = await getDocs(q);

    let companyNm ='';
    if (!querySnapshot.empty) {
        firstVisibleDoc = querySnapshot.docs[0];
        lastVisibleDoc = querySnapshot.docs[0];

        querySnapshot.forEach((doc) => {
            companyNm += doc.data().companyNm
        });

    } else {
        console.log("No documents found");
    }

    return companyNm;
}


// 첫 번째 문서 가져오기 + 조건 추가(회사코드)
export async function fetchFirstDocument(collectionName, companyCd) {
    const q = query(
        collection(db, collectionName)
        , where("companyCd", "==", companyCd)
        , orderBy("price")
        , limit(pagingunit)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        firstVisibleDoc = querySnapshot.docs[0];
        lastVisibleDoc = querySnapshot.docs[0];

        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // });

    } else {
        console.log("No documents found");
    }

    return querySnapshot;
}

// "다음" 버튼 클릭 시 다음 문서 가져오기
export async function fetchNextDocument(collectionName, companyCd, limitCnt) {
    if (!lastVisibleDoc) return;

    let q = query(
        collection(db, collectionName)
        , where("companyCd", "==", companyCd)
        , orderBy("price")
        , startAfter(lastVisibleDoc)
        , limit(pagingunit)
    );

    if (limitCnt > 0) {
        q = query(
            collection(db, collectionName)
            , startAfter(lastVisibleDoc)
            , where("companyCd", "==", companyCd)
            , limit(limitCnt)
        );
    }

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        firstVisibleDoc = lastVisibleDoc; // 현재의 마지막 문서를 첫 번째로 설정
        lastVisibleDoc = querySnapshot.docs[0];
    } else {
        console.log("No more documents found");
    }

    return querySnapshot;
}

// "이전" 버튼 클릭 시 이전 문서 가져오기
async function fetchPreviousDocument() {
    if (!firstVisibleDoc) return;

    const q = query(collection(db, settings.collectionName), endBefore(firstVisibleDoc), limitToLast(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        lastVisibleDoc = firstVisibleDoc; // 현재의 첫 번째 문서를 마지막으로 설정
        firstVisibleDoc = querySnapshot.docs[0];

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    } else {
        console.log("No more documents found");
    }
}

//이미지 업로드 함수
async function uploadImageAndSaveData(file, title, date, content) {
    try {
        // 1. Firebase Storage에 이미지 업로드
        const storageRef = ref(storage, 'images/' + file.name); // 저장 경로 설정
        await uploadBytes(storageRef, file);

        // 2. 업로드한 이미지의 다운로드 URL 가져오기
        const downloadURL = await getDownloadURL(storageRef);

        // 3. Firestore에 이미지 URL과 다른 데이터 저장
        const docRef = await addDoc(collection(db, settings.collectionName), {
            title: title,
            date: date,
            content: content,
            imageUrl: downloadURL
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document with image: ", error);
    }
}

//이미지 업로드 트리거 함수
function uploadData() {
    const fileInput = document.getElementById("imageFile");
    const file = fileInput.files[0]; // 첫 번째 파일 가져오기

    if (file) {
        const title = "Sample Title";
        const date = new Date().toISOString();
        const content = "Sample content";

        uploadImageAndSaveData(file, title, date, content);
    } else {
        console.log("No file selected");
    }
}

// 문서 업데이트
export async function updateDocument(conNm, id, updatedData) {
    const docRef = doc(db, conNm, id);
    try {
        // Firestore에서 문서 업데이트
        await updateDoc(docRef, updatedData);
        return true;
    } catch (error) {
        console.error("문서 업데이트 중 오류 발생:", error);
        return false;
    }
};

//문서삭제
export async function deleteItem(colNm, docId) {
    const carRef = doc(db, colNm, docId); // "cars" 컬렉션 내 docId 문서 참조
    try {
        await deleteDoc(carRef); // 문서 삭제
        return true;
    } catch (error) {
        console.error("문서 삭제 실패:", error);
        return false;
    }
};

// 업체코드로 보험정보가져오기
export async function fetchInsurances(companyCd) {
    const q = query(
        collection(db, "insurances")
        , where("companyCd", "==", companyCd)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        firstVisibleDoc = querySnapshot.docs[0];
        lastVisibleDoc = querySnapshot.docs[0];
    } else {
        console.log("No documents found");
    }

    return querySnapshot;
}

// 업체코드로 카시트정보가져오기
export async function fetchCarseat(companyCd) {
    const q = query(
        collection(db, "carseats")
        , where("companyCd", "==", companyCd)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        firstVisibleDoc = querySnapshot.docs[0];
        lastVisibleDoc = querySnapshot.docs[0];
    } else {
        console.log("No documents found");
    }

    return querySnapshot;
}