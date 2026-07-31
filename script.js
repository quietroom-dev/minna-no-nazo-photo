// 写真を選択
const photoInput = document.getElementById("photoInput");

document.getElementById("uploadBtn").onclick = () => {
    photoInput.click();
};

photoInput.onchange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    alert("選択した写真\n\n" + file.name);
};

// ランキング
document.getElementById("rankingBtn").onclick = () => {
    alert("ランキングは後で作ります");
};

// 占い
document.getElementById("fortuneBtn").onclick = () => {
    alert("今日の謎写真占いは後で作ります");
};
