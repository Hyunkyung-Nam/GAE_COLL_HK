(async function () {
    try {
        const token = localStorage.getItem("token");
        localStorage.clear();
        const url = "https://kapi.kakao.com/v2/user/me";
        const Header = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(url, Header);

        const { email, profile } = response.data.kakao_account;

        //회원가입 여부확인
        const findUser = await axios({
            method: "POST",
            url: "/api/user/check",
            data: {
                email,
                isSignup: true,
            },
        });

        //해당하는 email이 없으면 회원가입
        if (!findUser.data.success) {
            const signupKakaoResult = await axios({
                method: "POST",
                url: "/api/user/signup",
                data: {
                    email,
                    user_name: profile.nickname,
                    type: "kakao",
                    profile_img: profile.profile_image_url,
                },
            });
            localStorage.setItem("token", signupKakaoResult.data.token);
        } else {
            localStorage.setItem("token", findUser.data.token);
        }
        //회원가입 또는 로그인 완료시 메인페이지로 이동
        document.location.href = "/";
    } catch (err) {
        console.log(err);
    }
})();
