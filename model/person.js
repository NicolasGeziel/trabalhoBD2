const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const MYSQL_IP = "localhost";
const MYSQL_LOGIN = "root";
const MYSQL_PASSWORD = "root";
const DATABASE = "m1_1";

const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD, {
  host: MYSQL_IP,
  dialect: "mysql",
  port: 3306,
});

const Person = sequelize.define("Person", {
  index: { type: DataTypes.INTEGER, primaryKey: true },
  user_id: { type: DataTypes.STRING, primaryKey: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  sex: { type: DataTypes.ENUM("Male", "Female"), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
  job_title: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "person", timestamps: false });

async function run() {
  try {
    const filePath = path.join(__dirname, 'people-100000.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const lines = fileContent.split("\n").slice(1); // Remover cabeçalho
    const people = lines.map(line => {
      const columns = line.split(",");
      return {
        index: columns[0],
        user_id: columns[1],
        first_name: columns[2],
        last_name: columns[3],
        sex: columns[4],
        email: columns[5],
        phone: columns[6],
        date_of_birth: columns[7],
        job_title: columns[8]
      };
    });

    await sequelize.sync();
    await Person.bulkCreate(people, { ignoreDuplicates: true });
    console.log("Dados inseridos no MySQL com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  }
}

run();
