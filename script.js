import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
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
  increment,
  deleteDoc
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

const auth = getAuth(app);

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

            imageUrl: data.secure_url.replace(
  "/upload/",
  "/upload/f_auto,q_auto,w_1000/"
),

            comment: document.getElementById("comment").value,
            userId: auth.currentUser.uid,

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
    showRanking();
};

// 占い
document.getElementById("fortuneBtn").onclick = () => {
    showFortune();
};
async function loadPhotos() {
    try {

        const gallery = document.getElementById("photoGallery");

let html = "";

        const snapshot = await getDocs(
    query(
        collection(db, "photos"),
        orderBy("createdAt", "desc")
    )
);
        snapshot.forEach((photoDoc) => {

            const photo = photoDoc.data();
const photoId = photoDoc.id;
          const isMine =
    auth.currentUser &&
    photo.userId === auth.currentUser.uid;

            html += `
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
        max-height:300px;
        object-fit:contain;
        display:block;
        background:#f4f4f4;
    ">

    <div style="padding:10px;">

        <div style="
    min-height:40px;
    margin-bottom:4px;
    font-size:15px;
">
    ${photo.comment || ""}
</div>

        <div style="
display:flex;
justify-content:space-between;
align-items:center;
font-size:12px;
gap:4px;
white-space:nowrap;
">

<span id="like-${photoId}" style="white-space:nowrap;">
👍 <small style="font-size:5px;">×<small style="font-size:10px;">${photo.like}</small>
</span>

<span id="happy-${photoId}" style="white-space:nowrap;">
😆 <small style="font-size:10px;">×${photo.happy}</small>
</span>

<span id="sad-${photoId}" style="white-space:nowrap;">
😢 <small style="font-size:10px;">×${photo.sad}</small>
</span>

<span id="angry-${photoId}" style="white-space:nowrap;">
😡 <small style="font-size:10px;">×${photo.angry}</small>
</span>

<span id="mystery-${photoId}" style="white-space:nowrap;">
❓ <small style="font-size:10px;">×${photo.mystery}</small>
</span>
</div>

        <div
id="stamp-${photoId}"
style="
display:none;
padding:10px;
margin-top:4px;
border-top:1px solid #ddd;
text-align:center;
font-size:28px;
">

<button
class="stampBtn"
onclick="event.stopPropagation();pushStamp('${photoId}','like','👍')">
👍
</button>

<button
class="stampBtn"
onclick="event.stopPropagation();pushStamp('${photoId}','angry','😡')">
😡
</button>

<button
class="stampBtn"
onclick="event.stopPropagation();pushStamp('${photoId}','sad','😢')">
😢
</button>

<button
class="stampBtn"
onclick="event.stopPropagation();pushStamp('${photoId}','happy','😆')">
😆
</button>

<button
class="stampBtn"
onclick="event.stopPropagation();pushStamp('${photoId}','mystery','❓')">
❓
</button>

${isMine ? `
<hr style="margin:10px 0;">

<button
onclick="event.stopPropagation();deletePhoto('${photoId}')"
style="
width:100%;
height:42px;
border:none;
border-radius:10px;
background:#ff4d4f;
color:white;
font-size:16px;
">
🗑️ この写真を削除
</button>
` : ""}
</div>
</div>
</div>
`;

        });
      gallery.innerHTML = html;

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

    const target = document.getElementById(type + "-" + photoId);

    if(target){

        const current =
            parseInt(target.innerText.replace(/[^\d]/g,"")) + 1;

        target.innerHTML =
    `${emoji} <small style="font-size:14px;">×${current}</small>`;

    }

    showToast(emoji + " を押しました！");

    toggleStampMenu(photoId);

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

async function showFortune(){

    const snapshot = await getDocs(collection(db,"photos"));

    const photos = [];

    snapshot.forEach(doc=>{
        photos.push(doc.data());
    });

    if(photos.length===0){

        showToast("写真がありません");

        return;

    }

    const photo = photos[Math.floor(Math.random()*photos.length)];

    document.getElementById("fortuneImage").src = photo.imageUrl;

    document.getElementById("fortuneComment").innerText =
        photo.comment || "";

    showToast("🔮 今日のラッキー謎写真を選んでいます…");

setTimeout(()=>{

    document.getElementById("fortuneModal").style.display="flex";

},800);

}

function closeFortune(){

    document.getElementById("fortuneModal").style.display="none";

}
async function showRanking(){

    const snapshot = await getDocs(
    query(
        collection(db,"photos"),
        orderBy("createdAt","desc")
    )
);

    const photos=[];

    snapshot.forEach(doc=>{

        const p=doc.data();

        p.total=
            p.like+
            p.angry+
            p.sad+
            p.happy+
            p.mystery;

        photos.push(p);

    });

    photos.sort((a,b)=>b.total-a.total);

    const list=document.getElementById("rankingList");

    list.innerHTML="";

    photos.slice(0,5).forEach((photo,index)=>{

        list.innerHTML+=`

<div style="
margin-top:15px;
padding:10px;
border:1px solid #ddd;
border-radius:15px;
">

<div style="font-size:22px;font-weight:bold;">
${
index===0 ? "🥇 1位" :
index===1 ? "🥈 2位" :
index===2 ? "🥉 3位" :
(index+1)+"位"
}

<div style="
margin-top:5px;
font-size:18px;
font-weight:bold;
color:#4F8DF7;
">
合計スタンプ　${photo.total}
</div>
</div>

<img
src="${photo.imageUrl}"
style="
width:100%;
max-height:300px;
object-fit:contain;
background:#f4f4f4;
margin-top:10px;
border-radius:15px;
display:block;
">

<div style="margin-top:10px;">
${photo.comment || ""}
<div style="
margin-top:10px;
font-size:18px;
line-height:1.8;
">

👍 ${photo.like}
😆 ${photo.happy}
😢 ${photo.sad}
😡 ${photo.angry}
❓ ${photo.mystery}

</div>
</div>
</div>

`;

    });

    document.getElementById("rankingModal").style.display="flex";

}

function closeRanking(){

    document.getElementById("rankingModal").style.display="none";

}

window.closeRanking=closeRanking;
window.closeFortune = closeFortune;
async function deleteOldPhotos(){

    const snapshot = await getDocs(collection(db,"photos"));

    const now = Date.now();

    snapshot.forEach(async(photoDoc)=>{

        const photo = photoDoc.data();

        if(!photo.createdAt) return;

        const created = photo.createdAt.toDate().getTime();

        const days = (now-created)/(1000*60*60*24);

        if(days>=30){

            await deleteDoc(doc(db,"photos",photoDoc.id));

        }

    });

}
async function deletePhoto(photoId){

    if(!confirm("この写真を削除しますか？")) return;

    await deleteDoc(doc(db, "photos", photoId));

    showToast("削除しました");

    loadPhotos();

}

window.deletePhoto = deletePhoto;
window.onload = async () => {

    try {

        const result = await signInAnonymously(auth);

        await deleteOldPhotos();

        loadPhotos();

    } catch (e) {

        alert("ログイン失敗");
        alert(e.code);
        alert(e.message);

    }

};
