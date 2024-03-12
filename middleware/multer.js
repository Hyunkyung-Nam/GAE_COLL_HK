const { error } = require("console");
const multer = require("multer");
const { type } = require("os");
const path = require("path");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            const filename = file.fieldname.trim();
            console.log("file확인:", file.fieldname);

            if (filename === "user_img") {
                done(null, "./public/uploads/profile");
            } else if (filename === "project_img") {
                done(null, "./public/uploads/project");
            } else if (filename === "project_files") {
                done(null, "./public/uploads/project_file");
            } else if (filename === "issue_files") {
                done(null, "./public/uploads/issue");
            }
        },

        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext).replace(" ", "") + Date.now() + ext);
        },
    }),
    fileFilter: (req, file, done) => {
        const filename = file.fieldname.trim();
        console.log(filename);
        if (filename === "user_img" || filename === "project_img") {
            const filenameExtension = file.originalname
                .split(".")
                [file.originalname.split(".").length - 1].toLowerCase();

            console.log(filenameExtension);
            if (
                filenameExtension === "jpg" ||
                filenameExtension === "png" ||
                filenameExtension === "jpeg" ||
                filenameExtension === "gif" ||
                filenameExtension === "bmp" ||
                filenameExtension === "tiff"
            ) {
                //파일 허용
                done(null, true);
            } else {
                //파일 거부
                done(null, false, new Error("hi"));
            }
        } else {
            done(null, true);
        }
    },
    //파일사이즈 5MB제한
    limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadProfileImg = upload.single("user_img");
exports.uploadProjectImg = upload.single("project_img");
exports.uploadProjectFiles = upload.array("project_files");
exports.uploadIssueFiles = upload.array("issue_files");
