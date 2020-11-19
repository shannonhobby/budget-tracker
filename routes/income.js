const express = require("express");
const router = express.Router();
const data = require("../data");
const incomeData = data.income;

router.use(express.json());
router.get("/", async (req, res) => {
  try {
    const incomeList = await incomeData.getAll();

    res.json(incomeList);
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});
router.get("/id", async (req, res) => {
  try {
    let income = await incomeData.get(req.params.id);
    res.status(200).json(income);
  } catch (e) {
    res.status(404).json({ error: "Could not find Income with that ID" });
    return;
  }
});
router.post("/:id", async (req, res) => {
  let body = req.body;
  if (!body) {
    res.status(400).json({ error: "Must provide data to create new income" });
    return;
  }
  if (!body.title) {
    res.status(400).json({ error: "Must provide title for income" });
    return;
  }
  if (!body.amount) {
    res.status(400).json({ error: "Must provide amount for income" });
    return;
  }
  if (!body.date) {
    res.status(400).json({ error: "Must provide date for income" });
    return;
  }

  try {
    const newIncome = await incomeData.create(
      body.title,
      body.date,
      body.amount
    );
    res.status(200).json(newIncome);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
});
router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "You must Supply an ID to delete" });
    return;
  }
  let income;
  try {
    income = await incomeData.get(req.params.id.toString());
  } catch (e) {
    res.status(404).json({ error: "Income with that id not found" });
    return;
  }
  let deleted = { incomeID: req.params.id.toString(), deleted: false };
  try {
    await incomeData.remove(req.params.id.toString());
    deleted.deleted = true;
    res.status(200).json(deleted);
  } catch (e) {
    res.status(500).json(e);
    return;
  }
});
