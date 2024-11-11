function kakaoLogin() {
    document.location.href = "/api/user/auth/kakao";
}
function googleLogin() {
    document.location.href = "/auth/google";
}

async function emailLogin() {
    const email = "test";
    const password = "1234";

    const loginResult = await axios({
        method: "POST",
        url: "/api/user/login/email",
        data: {
            email,
            password,
        },
    });
    if (loginResult.data.success) {
        alert("환영합니다!");
        localStorage.setItem("token", loginResult.data.token);
        document.location.href = "/";
    } else {
        alert("아이디 또는 비밀번호를 확인해 주세요.");
    }
}
