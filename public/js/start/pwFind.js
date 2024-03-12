let authEmailNum = "";
let isAuth = false;
//이메일 인증번호 전송
async function emailAuthPW() {
    const email = document.querySelector("#email").value;

    const emailSendResult = await axios({
        method: "POST",
        url: "/api/user/emailAuth",
        data: {
            email,
            isSignup: false,
        },
    });
    const { success, result } = emailSendResult.data;
    if (success) {
        authEmailNum = String(result.authNum);
        alert("기입하신 이메일로 인증번호가 전송되었습니다");
    } else {
        alert(result.message);
    }
}
//이메일 인증번호 확인
async function checkEmailAuthNumPW() {
    const inputAuthNum = document.querySelector("#email-number").value;
    console.log("inputAuthNum", typeof inputAuthNum);
    console.log("authEmailNum", typeof authEmailNum);
    console.log(inputAuthNum === authEmailNum);
    if (inputAuthNum === authEmailNum) {
        alert("이메일 인증이 완료되었습니다.");
        isAuth = true;
        console.log("open");
        if (isAuth) {
            document.getElementById("popup").style.display = "block";
        }
    } else {
        alert("인증번호를 확인해주세요");
        isAuth = false;
    }
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    console.log("close");
}

async function pwFind() {
    const pwInput = document.querySelector("#pwInput").value;
    const password = document.querySelector("#pwInputAgain").value;
    const email = document.querySelector("#email").value;

    if (pwInput === password) {
        const pwFindResult = await axios({
            method: "post",
            url: "/api/user/findPW",
            data: { email, password },
        });
        console.log(pwFindResult.data);
        const { success } = pwFindResult.data;
        alert("비밀번호를 변경하였습니다.");
        document.location.href = "/start/login";
    } else {
        alert("비밀번호가 일치하지 않습니다.");
    }
}

// 존재하는 유저인지 이름, 이메일로 대조 하는 코드?
