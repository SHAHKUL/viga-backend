const itemRouter = require("express").Router();



const database = require("../services/database");


//From this router we get all of the data from item Table
itemRouter.get("/get", async (req, res) => {
  try {
    const result = await database.pool.query("SELECT * FROM item");

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


//From this router we create a new  item Table
itemRouter.post("/create", async (req, res) => {
  try {
    const result = await database.pool.query(
      `CREATE TABLE item(id   NUMERIC(10) NOT NULL,type VARCHAR(255) NOT NULL UNIQUE,description VARCHAR(255)) `
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



//From this router we insert a new date into the  item Table
itemRouter.post("/insert", async (req, res) => {

    const{id,type,description}=req.body
    try {
        const result = await database.pool.query({
            text: `INSERT INTO  item(id,type,description) VALUES ($1,$2,$3) RETURNING *`,
            values: [id,type,description]
          });
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });


  //From this router we can Drap an  item Table

itemRouter.delete("/delete", async (req, res) => {
  try {
    const result = await database.pool.query("DROP TABLE item");

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = itemRouter;
