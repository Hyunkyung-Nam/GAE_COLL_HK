const { DataTypes } = require('sequelize');

const BoardCommentModel = (sequelize) => {
    return sequelize.define('board_commnet', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};

module.exports = BoardCommentModel;
