const organisationRouter = require("express").Router();

const database = require("../services/database");

//From this router we get all of the data from organisation Table
organisationRouter.get("/get", async (req, res) => {
  try {
    const result = await database.pool.query("SELECT * FROM organisation");

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


//From this router we create a new  organisation Table
organisationRouter.post("/create", async (req, res) => {
  try {
    const result = await database.pool.query(
      `CREATE TABLE organisation(id SERIAL NOT NULL PRIMARY KEY,name VARCHAR(255) NOT NULL UNIQUE) `
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



//From this router we insert a new date into the  organisation Table
organisationRouter.post("/insert", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await database.pool.query({
      text: `INSERT INTO  organisation(name) VALUES ($1) RETURNING *`,
      values: [name],
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


  //From this router we can Drap an  organisation Table
organisationRouter.delete("/delete", async (req, res) => {
  try {
    const result = await database.pool.query("DROP TABLE organisation");

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});







module.exports = organisationRouter;
