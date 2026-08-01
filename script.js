// 写真を選択
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

    alert("アップロード準備開始");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    console.log(formData);

    try {
alert("Cloudinaryへ送信します");
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
alert("写真を読み込みます");
    try {

        const gallery = document.getElementById("photoGallery");

        gallery.innerHTML = "";

        const snapshot = await getDocs(collection(db, "photos"));
alert(snapshot.size + "件見つかりました");
        snapshot.forEach((doc) => {

            const photo = doc.data();

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

    } catch (e) {

        alert(e.message);

    }

}
