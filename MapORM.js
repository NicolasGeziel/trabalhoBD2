const { Sequelize, DataTypes } = require("sequelize"); //npm install --save sequelize , npm install --save mysql2
const MYSQL_IP = "localhost";
const MYSQL_LOGIN = "root";
const MYSQL_PASSWORD = "******";
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
  last_update: { type: DataTypes.DATE }
}, { tableName: "address", timestamps: false });

const Store = sequelize.define("Store", {
  store_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  manager_staff_id: { type: DataTypes.INTEGER },
  address_id: { type: DataTypes.INTEGER },
  last_update: { type: DataTypes.DATE }
}, { tableName: "store", timestamps: false });

// RELACIONAMENTOS
City.hasMany(Address, { foreignKey: "city_id" });
Address.belongsTo(City, { foreignKey: "city_id" });

Address.hasMany(Store, { foreignKey: "address_id" });
Store.belongsTo(Address, { foreignKey: "address_id" });

let testConnection = async function () {
  try {
    // Pegando uma store qualquer (por ID)
    let store = await Store.findByPk(1);

    // Pegando o endereço da store
    let storeAddress = await store.getAddress();

    // Pegando a cidade do endereço
    let storeCity = await storeAddress.getCity();

    // Impressão dos dados separados
    console.log("=== STORE ===");
    console.log(store.dataValues);

    console.log("=== ENDEREÇO DA STORE ===");
    console.log(storeAddress.dataValues);

    console.log("=== CIDADE DA STORE ===");
    console.log(storeCity.dataValues);
    
  } catch (error) {
    console.error("Erro:", error);
  }
};

testConnection();
