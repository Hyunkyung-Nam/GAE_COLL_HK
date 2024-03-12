(async function () {
    const save = localStorage.getItem("save");

    if (save === "true") {
        document.location.href = "/";
    }
})();
async function emailLogin() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const isMaintain = document.querySelector("#is-maintain").checked;

    if (email === "" || password === "") {
        alert("이메일 또는 비밀번호를 입력해주세요.");
        return;
    }

    const loginResult = await axios({
        method: "POST",
        url: "/api/user/login/email",
        data: {
            email,
            password,
        },
    });
    //체크박스 선택되어있으면 토큰 저장
    if (loginResult.data.success) {
        alert("환영합니다!");
        if (isMaintain) {
            localStorage.setItem("save", "true");
        }
        localStorage.setItem("token", loginResult.data.token);
        document.location.href = "/";
    } else {
        alert("아이디 또는 비밀번호를 확인해 주세요.");
    }
}
