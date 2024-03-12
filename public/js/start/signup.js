let authEmailNum = "";
let isAuth = false;
//이메일 인증번호 전송
async function emailAuth() {
    const email = document.querySelector("#email").value;
    const emailAuthBtn = document.querySelector("#email-auth-btn");

    const emailSendResult = await axios({
        method: "POST",
        url: "/api/user/emailAuth",
        data: {
            email,
            isSignup: true,
        },
    });
    const { success, result } = emailSendResult.data;
    if (success) {
        authEmailNum = String(result.authNum);
        alert("기입하신 이메일로 인증번호가 전송되었습니다");

        emailAuthBtn.classList.remove("hidden");
    } else {
        alert(result.message);
    }
}
//이메일 인증번호 확인
async function checkEmailAuthNum() {
    const inputAuthNum = document.querySelector("#email-number").value;
    console.log("inputAuthNum", typeof inputAuthNum);
    console.log("authEmailNum", typeof authEmailNum);
    console.log(inputAuthNum === authEmailNum);
    if (inputAuthNum === authEmailNum) {
        alert("이메일 인증이 완료되었습니다.");
        isAuth = true;
    } else {
        alert("인증번호를 확인해주세요");
        isAuth = false;
    }
}

//회원가입
async function emailSignup() {
    const user_name = document.querySelector("#user-name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const passwordCheck = document.querySelector("#password-check").value;
    const question = document.querySelector("#question");
    const selectedQuestion = question.options[question.selectedIndex].value;

    const questionAsw = document.querySelector("#answer").value;

    if (
        user_name === "" ||
        (email === "") | (password === "") ||
        selectedQuestion === "" ||
        questionAsw === "" ||
        isAuth === false
    ) {
        alert("모든 항목을 채워주세요");
        return;
    }
    if (passwordCheck !== password) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const signupResult = await axios({
        method: "POST",
        url: "/api/user/signup",
        data: {
            email,
            password,
            user_name,
            type: "email",
            selected_question: Number(selectedQuestion),
            answer: questionAsw,
        },
    });
    console.log(signupResult);
    const { success } = signupResult.data;
    if (success) {
        alert("회원가입을 축하드립니다!");
        document.location.href = "/start/login";
    } else {
        alert("회원가입에 실패하였습니다.");
    }
}
