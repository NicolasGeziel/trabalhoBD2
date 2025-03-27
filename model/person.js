import { Sequelize, DataTypes } from "sequelize";
const MYSQL_IP = "localhost";
const MYSQL_LOGIN = "root";
const MYSQL_PASSWORD = "******";
const DATABASE = "m1_1";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD, {
  host: MYSQL_IP,
  dialect: "mysql",
});

export const Person = sequelize.define("Person", {
    index: { type: DataTypes.INTEGER, autoIncrement: true },
    user_id: { type: DataTypes.STRING, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    sex: { type: DataTypes.ENUM("Male", "Female"), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    job_title: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "person", timestamps: false }).sync();