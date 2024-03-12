const { DataTypes } = require('sequelize');

const ProjectModel = (sequelize) => {
    return sequelize.define('project', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        project_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'planning',
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        github: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        overview: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rule: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        project_img: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};

module.exports = ProjectModel;
