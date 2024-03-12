const { DataTypes } = require('sequelize');

const IssueCommentModel = (sequelize) => {
    return sequelize.define('issue_comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
        },
    });
};

module.exports = IssueCommentModel;
