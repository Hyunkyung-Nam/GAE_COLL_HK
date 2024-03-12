async function idFind() {
    const user_name = document.querySelector("#user").value;
    const selected_question = document.querySelector(".ans").value;
    const answer = document.querySelector(".answer").value;

    console.log(user_name, selected_question, answer);

    const idFindResult = await axios({
        method: "post",
        url: "/api/user/findID",
        data: {
            user_name,
            selected_question,
            answer,
        },
    });

    const { success, result } = idFindResult.data;
    if (success) {
        alert(`회원님의 이메일은 ${result}입니다. 다시 로그인을 시도해보세요`);
        document.location.href = `/start/login`;
    } else {
        alert(`해당 정보를 가진 유저가 없습니다. 다시 시도해보세요.`);
    }
}
