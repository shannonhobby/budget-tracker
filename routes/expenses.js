const express = require("express");
const router = express.Router();
const data = require("../data");
const expenseData = data.purchases;

router.use(express.json());
router.get("/", async (req, res) => {
  try {
    const expenseList = await incomeData.getAll();

    res.json(expenseList);
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});
router.get("/id", async (req, res) => {
  try {
    let expense = await expenseData.get(req.params.id);
    res.status(200).json(expense);
  } catch (e) {
    res.status(404).json({ error: "Could not find expense with that ID" });
    return;
  }
});
router.post("/:id", async (req, res) => {
  let body = req.body;
  if (!body) {
    res.status(400).json({ error: "Must provide data to create new expense" });
    return;
  }
  if (!body.title) {
    res.status(400).json({ error: "Must provide title for expense" });
    return;
  }
  if (!body.amount) {
    res.status(400).json({ error: "Must provide amount for expense" });
    return;
  }
  if (!body.date) {
    res.status(400).json({ error: "Must provide date for expense" });
    return;
  }
  if (!body.tags) {
    res.status(400).json({ error: "Must provide tags for expense" });
    return;
  }
  try {
    const newExpense = await expenseData.create(
      body.title,
      body.date,
      body.amount,
      body.tags
    );
    res.status(200).json(newExpense);
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
  let expense;
  try {
    expense = await expenseData.get(req.params.id.toString());
  } catch (e) {
    res.status(404).json({ error: "Expense with that id not found" });
    return;
  }
  let deleted = { expenseId: req.params.id.toString(), deleted: false };
  try {
    await expenseData.remove(req.params.id.toString());
    deleted.deleted = true;
    res.status(200).json(deleted);
  } catch (e) {
    res.status(500).json(e);
    return;
  }
});
