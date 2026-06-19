const mysql = require("mysql2"); // pega a biblioteca mysql2 e carrega na variavel
require("dotenv").config(); //carrega as variaveis para dentro de process.env

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL: ", err);
    return;
  }

  console.log("Conectando ao banco de dados MySQL.");
}); //primeiro roda o connect e depois executa a função

module.exports = db; //Serve para exportar a variavel db a fim de usá-la em outros arquivos
