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

This way, the application is almost configured. After all this, type the following command in the terminal to start the application:

```
npm run dev
```

## Using the application

After the previous installations have been completed and the application is running with the command “npm run dev,” all requests can be done in the route localhost/api-docs.

## Technologies used

- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/pt-br)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
