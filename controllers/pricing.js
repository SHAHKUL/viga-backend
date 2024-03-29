const pricingRouter = require("express").Router();

const database = require("../services/database");

//From this router we get all of the data from pricing Table
pricingRouter.get("/get", async (req, res) => {
  try {
    const result = await database.pool.query("SELECT * FROM pricing");

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//From this router we create a new  pricing Table
pricingRouter.post("/create", async (req, res) => {
  try {
    const result = await database.pool.query(
      `CREATE TABLE pricing (organization_id NUMERIC(10),item_id NUMERIC(10),zone VARCHAR(255),base_distance_in_km NUMERIC(10),km_price FLOAT4,fix_price NUMERIC(10))`
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//From this router we insert a new date into the  pricing Table
pricingRouter.post("/insert", async (req, res) => {
  const {
    organization_id,
    item_id,
    zone,
    base_distance_in_km,
    km_price,
    fix_price,
  } = req.body;
  try {
    const result = await database.pool.query({
      text: `INSERT INTO  pricing(organization_id,item_id,zone,base_distance_in_km,km_price ,fix_price) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      values: [
        organization_id,
        item_id,
        zone,
        base_distance_in_km,
        km_price,
        fix_price,
      ],
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Example: @req from body
// { "organization_id":1,
// "zone":"central",
// "total_distance":12,
// "item_type": "perishable" }
// @res from body
// {
//   "total_price": 20.5
// }

//From this router we can calculate the base distance
pricingRouter.post("/calculate", async (req, res) => {
  const { organization_id, item_type, zone, total_distance } = req.body;
  try {
    const exist = await database.pool.query({
      text: `SELECT * FROM  organisation WHERE id=$1`,
      values: [organization_id],
    });
    if (!exist.rows[0]) {
      return res
        .status(200)
        .json({ message: "there is no such organization exist" });
    }

    const itemType = await database.pool.query({
      text: `SELECT * FROM  item WHERE type=$1`,
      values: [item_type],
    });
    itemId = itemType.rows[0].id;

    const result = await database.pool.query({
      text: `SELECT * FROM pricing WHERE organization_id=$1 AND  zone=$2 AND item_id=$3`,
      values: [organization_id, zone, itemId],
    });

    var totalFare = 0;
    var baseDistance = parseInt(result.rows[0].base_distance_in_km);
    var fixPrice = parseInt(result.rows[0].fix_price);
    var perKmprice = parseFloat(result.rows[0].km_price);

    // if total_distance is lesser than or equal to the baseDistance we dont need any calculation we use the fixprice as it is.
    if (total_distance <= baseDistance) {
      totalFare = fixPrice;
      res.status(200).json({ total_price: totalFare });
    } else {
      totalFare = fixPrice + (total_distance - baseDistance) * perKmprice;

      res.status(200).json({ total_price: totalFare });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//From this router we can Drap an  pricing Table
pricingRouter.delete("/delete", async (req, res) => {
  try {
    const result = await database.pool.query("DROP TABLE pricing");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = pricingRouter;
