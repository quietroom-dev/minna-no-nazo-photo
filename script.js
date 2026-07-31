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

    alert("ここまでは成功しました");

};

// ランキング
document.getElementById("rankingBtn").onclick = () => {
    alert("ランキングは後で作ります");
};

// 占い
document.getElementById("fortuneBtn").onclick = () => {
    alert("今日の謎写真占いは後で作ります");
};
