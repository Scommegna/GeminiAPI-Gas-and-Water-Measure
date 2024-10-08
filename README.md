# Gemini API Gas and Water measure reader microservice

This application consists of a back-end microservice for reading an image containing a water or gas meter value through the Gemini API, which will be saved in a MongoDB database, creating relationships with the user requesting the reading.

## Autor

- **Lucas Scommegna** - [scommegnal@hotmail.com](scommegnal@gmail.com)

## Starting the project

First, clone the current repository to your machine using the terminal with the following command:

```
git clone <link HTTPS ou SSH> .
```

Next, use the following command in the terminal while located in the application folder:

```
npm install
```

In the ‘Database’ section of your MongoDB account, choose a database, click on connect, select the ‘Drivers’ option for ‘Connect to your application,’ and copy the generated connection string for the database.

Create a .env file in the root folder of the application and create a value MONGO_URI, setting it equal to the generated connection string, remembering to complete its parameters. The connection string has the following format:

```
mongodb://<username>:<password>@<host>:<port>/<database>?options
```

The “username” field is your authentication username, the “password” is your database password, the “host” is the domain name of the database to be created, the “port” is the default MongoDB port or another one, and the “database” field is the name of the database you wish to connect to.

After the initial MongoDB setup, the configuration of the GeminiAPI should also be done, which will handle the reading of measurement images.

First, obtain a key from GeminiAPI through the following link:

[GeminiAPIKey](https://ai.google.dev/gemini-api/docs/api-key)

Next, in the .env file, create a field named GEMINI_API_KEY and set it equal to the generated API key:

```
GEMINI_API_KEY=API_KEY
```

## Routes docs

With the Postman app open and your account logged in, click on the top left corner, in the “My Workspace” section, on import and drag the Postman JSON file.
After that, all the Postman routes will be set up for testing.

This way, the application is almost configured. After all this, type the following command in the terminal to start the application:

```
npm run dev
```

## Using the application

After the previous installations have been completed and the application is running with the command “npm run dev,” all requests to the routes will be made through Postman, and they will be explained below.

### Route GET/<userId>/list

The request to this route will return a JSON body containing the information of all the measurements registered by the user with the ID "userId".

### Route POST/upload

The request to this route must be made by sending a body in JSON format with the following fields, each with the corresponding types:

```
{
    "image": base64 string,
    "customer_code": string,
    "measure_datetime": string of timestamp,
    "measure_type": string (WATER or GAS),
}
```

Após o sucesso da requisição, também será gerado um campo "\_id" com um valor identificador único para o dono e um vetor para armazenamento dos seus pets.

### Rota PUT/tutor/:id

A requisição para essa rota atualizará os dados de um dono, cujo valor de "id" deve ser passado nos parâmetros de rota. Além disso, deve ser enviado um body, em formato JSON, com os campos que devem ser atualizados do dono, sendo possíveis campos de atualização os mesmos da rota "POST/tutor".

### Rota DELETE/tutor/:id

A requisição para essa rota deletará todas as informações de um dono, cujo valor de "id" deve ser passado nos parâmetros de rota.

### Rota POST/pet/:tutorId

A requisição para essa rota criará e armazenará no banco de dados os dados de um pet cujo relacionamento será feito pelo "id" do dono que deve ser passado nos parâmetros de rota. Além disso, deve ser enviado um body, em formato JSON, com os seguintes campos, com os seguintes tipos:

```
{
    "name": string,
    "species": string,
    "carry": string,
    "weight": number,
    "date_of_birth": Date
}
```

Após a requisição ser feita com sucesso, os dados do pet cadastrado serão salvos em uma tabela do banco de dados e serão gerados também dois novos campos para o pet: um campo "\_id", com um valor identificador único para o pet e um campo "owner", que contém o valor de "\_id" do dono do pet, sendo esse campo utilizado para o relacionamento de dados. Além disso, os dados do pet cadastrado serão salvos no vetor "pets" do dono.

### Rota PUT/pet/:petId/tutor/:tutorId

A requisição para essa rota atualizará os dados de um pet de um determinado dono (cujos valores de "id" devem ser especificados nos parâmetros de rota), sendo esses dados atualizados na tabela de pets e no vetor de pets do dono. Para que a atualização seja feita, deve ser enviado um body, em formato JSON, contendo os campos do pet a serem atualizados, sendo que esse campos devem seguir o formato especificado na rota "POST/pet/:tutorId".

### Rota DELETE/pet/:petId/tutor/:tutorId

A requisição para essa rota deletará todos os dados de um determinado pet de um determinado dono (cujos valores de "id" devem ser especificados nos parâmetros de rota) do banco de dados e do vetor de pets do dono.

## Tecnologias utilizadas

- [Express](https://expressjs.com/pt-br/) - Framework Back-End.
- [TypeScript](https://www.typescriptlang.org/) - Superset, para tipagem de JavaScript.
- [MongoDB](https://www.mongodb.com/pt-br) - Banco de dados não-relacional.
- [Mongoose](https://mongoosejs.com/) - Modelador de objetos de MongoDB para NodeJS
- [TS-Node-Dev](https://www.npmjs.com/package/ts-node-dev) - Compilador de TypeScript para aplicações NodeJs
- [dotenv](https://www.npmjs.com/package/dotenv) - Biblioteca de gerenciamento de variáveis ambiente.
