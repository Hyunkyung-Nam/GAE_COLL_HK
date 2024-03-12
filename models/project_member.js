const { DataTypes } = require("sequelize");

const ProjectMemberModel = (sequelize) => {
    return sequelize.define("project_member", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
    });
};

module.exports = ProjectMemberModel;
