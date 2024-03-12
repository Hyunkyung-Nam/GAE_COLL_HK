const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            //header가 존재하지 않을 때(클라이언트 인증 오류)
            return res.status(401).json({ success: false, result: { message: "헤더가 존재하지 않습니다" } });
        }

        const [_, token] = header.split(" ");

        //jwt인증
        jwt.verify(token, process.env.DEVEL_SECRET, (error, decoded) => {
            if (error) {
                // 419 토큰만료
                if (error.name === "TokenExpiredError") {
                    return res.status(419).json({ success: false, result: { message: "토큰이 만료되었습니다." } });
                } else {
                    //403 권한없음
                    return res.status(403).json({ success: false, rerult: { message: "유효하지 않은 토큰입니다." } });
                }
            } else {
                req.userId = decoded.id;
                console.log("decoded.projectId : ", decoded.projectId);
                if (decoded.projectId !== null || decoded.projectId !== undefined) {
                    req.projectId = decoded.projectId;
                }
                next();
            }
        });
    } catch (error) {
        return res.json({ success: false, result: error });
    }
};
