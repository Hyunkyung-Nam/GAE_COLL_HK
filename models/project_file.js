const { DataTypes } = require("sequelize");

const ProjectFileModel = (sequelize) => {
    return sequelize.define("project_file", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        plan: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        erd: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        api: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};

module.exports = ProjectFileModel;
