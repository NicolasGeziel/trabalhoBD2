const { Sequelize, DataTypes, GEOMETRY, BLOB } = require("sequelize"); //npm install --save sequelize , npm install --save mysql2
const readline = require("readline");
const MYSQL_IP = "localhost";
const MYSQL_LOGIN = "root";
const MYSQL_PASSWORD = "1234";
const DATABASE = "sakila";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD, {
  host: MYSQL_IP,
  dialect: "mysql",
});
// MODELOS
const City = sequelize.define("City", {
  city_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  city: { type: DataTypes.STRING },
  country_id: { type: DataTypes.INTEGER },
  last_update: { type: DataTypes.DATE },
}, { tableName: "city", timestamps: false });

const Address = sequelize.define("Address", {
  address_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  address: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  city_id: { type: DataTypes.INTEGER },
  postal_code: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  location: { type: DataTypes.GEOMETRY('POINT') },
  last_update: { type: DataTypes.DATE }
}, { tableName: "address", timestamps: false });

const Store = sequelize.define("Store", {
  store_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  manager_staff_id: { type: DataTypes.INTEGER },
  address_id: { type: DataTypes.INTEGER },
  last_update: { type: DataTypes.DATE }
}, { tableName: "store", timestamps: false });

const Staff = sequelize.define("Staff", {
  staff_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  address_id: { type: DataTypes.INTEGER },
  picture: { type: DataTypes.BLOB, allowNull: true },
  email: { type: DataTypes.STRING },
  store_id: { type: DataTypes.INTEGER },
  active: { type: DataTypes.BOOLEAN },
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  last_update: { type: DataTypes.DATE }
}, { tableName: "staff", timestamps: false });

// RELACIONAMENTOS
City.hasMany(Address, { foreignKey: "city_id" });
Address.belongsTo(City, { foreignKey: "city_id" });

Address.hasMany(Store, { foreignKey: "address_id" });
Store.belongsTo(Address, { foreignKey: "address_id" });

Store.belongsTo(Staff, { foreignKey: "manager_staff_id" });
Staff.hasMany(Store, { foreignKey: "manager_staff_id" });

let testConnection = async function () {
  try {
    // Pegando uma store qualquer (por ID)
    let store = await Store.findByPk(1);

    // Pegando o endereço da store
    let storeAddress = await store.getAddress();

    // Pegando a cidade do endereço
    let storeCity = await storeAddress.getCity();

    // Pegando o endereço do staff
    let storeStaff = await store.getStaff();

    // Impressão dos dados separados
    console.log("=== STORE ===");
    console.log(store.dataValues);

    console.log("=== ENDEREÇO DA STORE ===");
    console.log(storeAddress.dataValues);

    console.log("=== CIDADE DA STORE ===");
    console.log(storeCity.dataValues);

    console.log("=== STAFF DA STORE ===");
    console.log(storeStaff.dataValues); 

  } catch (error) {
    console.error("Erro:", error);
  }
};

// Função para capturar entrada do usuário
const prompt = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

// Função para inserir um novo registro
const insertData = async () => {
  try {
    console.log("=== Inserção de Dados ===");

    // Inserir uma nova cidade
    const cityName = await prompt("Digite o nome da cidade: ");
    const countryId = await prompt("Digite o ID do país: ");
    const newCity = await City.create({
      city: cityName,
      country_id: parseInt(countryId),
      last_update: new Date(),
    });
    console.log("Nova cidade criada:", newCity.dataValues);

    // Inserir um novo endereço relacionado à cidade
    const address = await prompt("Digite o endereço: ");
    const district = await prompt("Digite o distrito: ");
    const postalCode = await prompt("Digite o código postal: ");
    const phone = await prompt("Digite o telefone: ");
    const location = { type: 'Point', coordinates: [0, 0] }; // Exemplo de localização 
    const newAddress = await Address.create({
      address: address,
      district: district,
      city_id: newCity.city_id, 
      postal_code: postalCode,
      phone: phone,
      location,
      last_update: new Date(),
    });
    console.log("Novo endereço criado:", newAddress.dataValues);

    // Inserir um novo funcionário relacionado ao endereço
    const firstName = await prompt("Digite o primeiro nome do funcionário: ");
    const lastName = await prompt("Digite o sobrenome do funcionário: ");
    const email = await prompt("Digite o email do funcionário: ");
    const username = await prompt("Digite o nome de usuário: ");
    const password = await prompt("Digite a senha: ");
    const storeId = await prompt("Digite o ID da loja: ");
    const newStaff = await Staff.create({
      first_name: firstName,
      last_name: lastName,
      address_id: newAddress.address_id, // Relacionamento com o endereço criado
      picture: null, 
      email: email,
      store_id: parseInt(storeId),
      active: true,
      username: username,
      password: password,
      last_update: new Date(),
    });
    console.log("Novo funcionário criado:", newStaff.dataValues);

    // Inserir uma nova loja relacionada ao endereço
    const managerStaffId = await prompt("Digite o ID do gerente: ");
    const newStore = await Store.create({
      manager_staff_id: parseInt(managerStaffId),
      address_id: newAddress.address_id, // Relacionamento com o endereço criado
      last_update: new Date(),
    });
    console.log("Nova loja criada:", newStore.dataValues);

    console.log("Inserção concluída com sucesso!");

  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  }
};
// Função do menu
const showMenu = async () => {
  try {
    while (true) {
      console.log("\n=== MENU ===");
      console.log("1. Listar Dados");
      console.log("2. Inserir Dados");
      console.log("3. Sair");

      const choice = await prompt("Escolha uma opção: ");

      if (choice === "1") {
        await testConnection();
      } else if (choice === "2") {
        await insertData();
      } else if (choice === "3") {
        console.log("Saindo...");
        break;
      } else {
        console.log("Opção inválida. Tente novamente.");
      }
    }
  } catch (error) {
    console.error("Erro no menu:", error);
  }
};
// Chamar a função de inserção e depois o teste de conexão

showMenu();
