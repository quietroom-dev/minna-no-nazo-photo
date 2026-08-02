// 写真を選択
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  increment
}from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyD2ByTKCiBZmCLqkXfGV49o-sh_OwCD2Mg",
  authDomain: "minna-no-nazo-photo.firebaseapp.com",
  projectId: "minna-no-nazo-photo",
  storageBucket: "minna-no-nazo-photo.firebasestorage.app",
  messagingSenderId: "598658120278",
  appId: "1:598658120278:web:b83c7cd9363aa4f912d9f7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 写真を選択
const photoInput = document.getElementById("photoInput");

document.getElementById("uploadBtn").onclick = () => {
    photoInput.click();
};

photoInput.onchange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    console.log(formData);

    try {
    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    console.log(data);

    if (data.secure_url) {

    try {

        await addDoc(collection(db, "photos"), {

            imageUrl: data.secure_url,

            comment: document.getElementById("comment").value,

            like: 0,

            happy: 0,

            sad: 0,

            angry: 0,

            mystery: 0,

            createdAt: new Date()

        });

        alert("投稿が完了しました！");

        document.getElementById("comment").value = "";
      loadPhotos();

    } catch (e) {

        alert("Firestore保存エラー");

        alert(e.message);

    }

} else {

        alert("アップロード失敗");

alert(JSON.stringify(data));

    }

} catch (err) {

    console.error(err);
alert("通信エラー");
alert(err.message);

}

};

// ランキング
document.getElementById("rankingBtn").onclick = () => {
    alert("ランキングは後で作ります");
};

// 占い
document.getElementById("fortuneBtn").onclick = () => {
    alert("今日の謎写真占いは後で作ります");
};
async function loadPhotos() {
    try {

        const gallery = document.getElementById("photoGallery");

        gallery.innerHTML = "";

        const snapshot = await getDocs(collection(db, "photos"));
        snapshot.forEach((photoDoc) => {

            const photo = photoDoc.data();
const photoId = photoDoc.id;

            gallery.innerHTML += `
<div
onclick="toggleStampMenu('${photoId}')"
style="
    background:white;
    border-radius:15px;
    overflow:hidden;
    box-shadow:0 2px 6px rgba(0,0,0,.08);
">

    <img
        src="${photo.imageUrl}"
        style="
            width:100%;
            aspect-ratio:1;
            object-fit:cover;
            display:block;
        ">

    <div style="padding:10px;">

        <div style="
    min-height:40px;
    margin-bottom:10px;
    font-size:15px;
">
    ${photo.comment || ""}
</div>

        <div style="
            display:flex;
            justify-content:space-between;
            font-size:20px;
        ">
            <span>👍 ${photo.like}</span>
            <span>😡 ${photo.angry}</span>
        </div>

        <div style="
            display:flex;
            justify-content:space-between;
            margin-top:8px;
            font-size:20px;
        ">
            <span>😢 ${photo.sad}</span>
            <span>😆 ${photo.happy}</span>
        </div>

        <div style="
            margin-top:8px;
            font-size:20px;
        ">
            ❓ ${photo.mystery}
        </div>
        <div
id="stamp-${photoId}"
style="
display:none;
padding:10px;
margin-top:10px;
border-top:1px solid #ddd;
text-align:center;
font-size:28px;
">

<button onclick="event.stopPropagation();pushStamp('${photoId}','like','👍')">👍</button>

<button onclick="event.stopPropagation();pushStamp('${photoId}','angry','😡')">😡</button>

<button onclick="event.stopPropagation();pushStamp('${photoId}','sad','😢')">😢</button>

<button onclick="event.stopPropagation();pushStamp('${photoId}','happy','😆')">😆</button>

<button onclick="event.stopPropagation();pushStamp('${photoId}','mystery','❓')">❓</button>

</div>

    </div>

</div>
`;

        });

    } catch (e) {

        alert(e.message);

    }

}
function toggleStampMenu(id){

    const menu = document.getElementById("stamp-"+id);

    if(menu.style.display==="block"){
        menu.style.display="none";
    }else{
        menu.style.display="block";
    }

}
window.toggleStampMenu = toggleStampMenu;
async function pushStamp(photoId, type, emoji){

    const ref = doc(db, "photos", photoId);

    await updateDoc(ref, {
        [type]: increment(1)
    });

    showToast(emoji + " を押しました！");

    toggleStampMenu(photoId);

    loadPhotos();
    loadPopular();

}
window.pushStamp = pushStamp;
function showToast(text){

    const toast = document.createElement("div");

    toast.innerText = text;

    toast.style.position = "fixed";
    toast.style.bottom = "100px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#333";
    toast.style.color = "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "30px";
    toast.style.fontSize = "18px";
    toast.style.opacity = "0";
    toast.style.transition = "0.3s";

    document.body.appendChild(toast);

    setTimeout(()=>{
        toast.style.opacity="1";
    },10);

    setTimeout(()=>{
        toast.style.opacity="0";

        setTimeout(()=>{
            toast.remove();
        },300);

    },1000);

}
async function loadPopular(){

    const gallery = document.getElementById("popularGallery");

    gallery.innerHTML = "";

    const q = query(
        collection(db,"photos"),
        orderBy("like","desc"),
        limit(4)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(photoDoc=>{

        const photo = photoDoc.data();

        gallery.innerHTML += `
        <div class="photo">
            <img
                src="${photo.imageUrl}"
                style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:15px;
                ">
        </div>
        `;

    });

}
window.onload = () => {

    loadPhotos();

    loadPopular();

};
