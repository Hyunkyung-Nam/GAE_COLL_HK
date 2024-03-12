const { DataTypes } = require("sequelize");

const IssueModel = (sequelize) => {
    return sequelize.define("issue", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT("medium"),
            allowNull: false,
        },
        issue_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        files: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};

module.exports = IssueModel;
