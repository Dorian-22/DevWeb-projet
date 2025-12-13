const { startDB } = require("./lib/db");

startDB()
  .then(async (connection) => {
    console.log("Migrator connected to the database");
    
    require("./models/user");
    require("./models/event");
    require("./models/category");
  
    await connection.sync({
      alter: true,
    });
    console.log("Database synchronized");
    await connection.close();
    console.log("Migrator disconnected from the database");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });