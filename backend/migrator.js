const { getConnection } = require("./lib/db");

getConnection()
  .then(async (connection) => {
    // Get all defined models
    require("./models/users");
    return connection;
  })
  .then((connection) =>
    connection.sync({
      alter: true,
    })
  )
  .then((connection) => connection.close())
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });