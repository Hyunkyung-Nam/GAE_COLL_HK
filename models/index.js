"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

//db table생성
db.User = require("./user")(sequelize);
db.Project = require("./project")(sequelize);
db.ProjectMember = require("./project_member")(sequelize);
db.ProjectFile = require("./project_file")(sequelize);
db.Board = require("./board")(sequelize);
db.BoardComment = require("./board_comment")(sequelize);
db.Issue = require("./issue")(sequelize);
db.IssueComment = require("./issue_comment")(sequelize);

//ProjectMember 외래키 설정 userId
db.User.hasMany(db.ProjectMember, { foreignKey: "userId", onDelete: "CASCADE" });
db.ProjectMember.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });

//ProjectMember 외래키 설정 projectId
db.Project.hasMany(db.ProjectMember, { foreignKey: "projectId", onDelete: "CASCADE" });
db.ProjectMember.belongsTo(db.Project, { foreignKey: "projectId", onDelete: "CASCADE" });

//ProjectFile 외래키 설정 projectId
db.Project.hasMany(db.ProjectFile, { foreignKey: "projectId", onDelete: "CASCADE" });
db.ProjectFile.belongsTo(db.Project, { foreignKey: "projectId", onDelete: "CASCADE" });

//Board 외래키 설정 projectId
db.Project.hasMany(db.Board, { foreignKey: "projectId", onDelete: "CASCADE" });
db.Board.belongsTo(db.Project, { foreignKey: "projectId", onDelete: "CASCADE" });

//Board 외래키 설정 userId
db.User.hasMany(db.Board, { foreignKey: "userId", onDelete: "CASCADE" });
db.Board.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });

//BoardComment 외래키 설정 boardId
db.Board.hasMany(db.BoardComment, { foreignKey: "boardId", onDelete: "CASCADE" });
db.BoardComment.belongsTo(db.Board, { foreignKey: "boardId", onDelete: "CASCADE" });

//BoardComment 외래키 설정 userId
db.User.hasMany(db.BoardComment, { foreignKey: "userId", onDelete: "CASCADE" });
db.BoardComment.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });

//Issue 외래키 설정projectId
db.Project.hasMany(db.Issue, { foreignKey: "projectId", onDelete: "CASCADE" });
db.Issue.belongsTo(db.Project, { foreignKey: "projectId", onDelete: "CASCADE" });

//Issue 외래키 설정 userId
db.User.hasMany(db.Issue, { foreignKey: "userId", onDelete: "CASCADE" });
db.Issue.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });

//IssueComment 외래키 설정 userId
db.User.hasMany(db.IssueComment, { foreignKey: "userId", onDelete: "CASCADE" });
db.IssueComment.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });

//IssueComment 외래키 설정 issueId
db.Issue.hasMany(db.IssueComment, { foreignKey: "issueId", onDelete: "CASCADE" });
db.IssueComment.belongsTo(db.Issue, { foreignKey: "issueId", onDelete: "CASCADE" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
