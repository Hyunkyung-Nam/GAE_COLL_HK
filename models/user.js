const { DataTypes } = require('sequelize');

const UserModel = (sequelize) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_img: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        github: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        blog: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        selected_question: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};

module.exports = UserModel;
