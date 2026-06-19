const express = require("express"); //cria e gerencia a API
const cors = require("cors"); //controla quais sites podem acessar essa API pelo navegador
require("dotenv").config(); //carrega varáveis do arquivo .env para process.env

const clientesRoutes = require("./routes/clientesRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");

const app = express(); //Cria a aplicação, ou seja, cria o servidor

//Configuração do middleware
app.use(cors());
app.use(express.json()); //transforma o JSON recebido em objeto javascript

/*Exemplo: 
    front envia: 
        {
            "nome": "João"
        }
    com express.json():
        req.body
        { nome: "João" }
*/

//Criando a rota, quando alguem acessar o http:localhost:3001/ essa função é executada
app.get("/", (req, res) => {
  res.send("API da Confeitaria funcionando!");
});

// req (request) é tudo o que o cliente enviou para o servidor
// res (response)  é o objeto usado para responder ao cliente

/*
Cliente
   │
   │ requisição
   ▼
  req
Servidor Express
  res
   ▲
   │ resposta
   │
Cliente   
*/

//Registrando as rotas
app.use("/clientes", clientesRoutes);
app.use("/pedidos", pedidosRoutes);

/*
Tudo que começar com /clientes
vai para clientesRoutes

Tudo que começar com /pedidos
vai para pedidosRoutes
*/

const PORT = process.env.PORT || 3001;
//Escuta a porta que está no .env ou a 3001

//Aqui liga o servidor, ele começa a escutar requisições
app.listen(PORT, () => {
  console.log(`Servidor rodando na prota ${PORT}`);
});
