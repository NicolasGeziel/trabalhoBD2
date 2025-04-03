const readline = require('readline');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const MYSQL_IP = "localhost";
const MYSQL_LOGIN = "root";
const MYSQL_PASSWORD = "";
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
    
    const lines = fileContent.split("\n").slice(1, 100001); // Remover cabeçalho

    await sequelize.sync();

    lines.map(async line => {
      const columns = line.replace(/"/g, "").split(",");

      let job_title = columns[8];

      if (columns[9] !== undefined) {
        job_title += "," + columns[9];
      }

      const person = {
        index: Number(columns[0]),
        user_id: columns[1],
        first_name: columns[2],
        last_name: columns[3],
        sex: columns[4],
        email: columns[5],
        phone: columns[6],
        date_of_birth: columns[7],
        job_title
      };

      await Person.create(person, { ignoreDuplicates: true });
    });
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  }
}

async function listPeople() {
  return await Person.findAll();
}

async function filterPeopleByName() {
  await Person.findAll({
    where: {
      first_name: {
        [Sequelize.Op.like]: `%${characters}%`
      }
    }
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Selecione a operação que deseja realizar:' +
  '\n1 - Exibir a lista de pessoas' +
  '\n2 - Filtrar a lista de pessoas por nome' +
  '\n> ', operation => {
  switch (operation) {
    case '1':
      listPeople();
      break;
    case '2':
      rl.question('Digite alguns caracteres para começar a filtragem: ', characters => {
        filterPeopleByName(characters);
        rl.close();
      });
      break;
    default:
      console.log('Operação incorreta!');
  }
});

run();
