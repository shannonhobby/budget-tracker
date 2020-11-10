const mongoCollection = require("../config/mongoCollections");
const mongodb = require("mongodb");
const income = mongoCollection.income;

async function getAll() {
  const incomeCollection = await income();
  const incomeList = await incomeCollection.find({}).toArray();
  return incomeList;
}

async function get(id) {
  if (!id) throw "You must provide a valid id";

  if (
    typeof id !== "string" ||
    id.trim().length === 0 ||
    !mongodb.ObjectID.isValid(id)
  )
    throw "Invalid ID: Please provide nonempty string";

  const incomeCollection = await income();
  const incomeGet = await incomeCollection.findOne({ _id: id });
  if (incomeGet === null) throw `Could not find income with id ${id}`;

  return incomeGet;
}

async function create(title, date, amount) {
  if (!title || !amount || !date) throw "error: missing fields";
  if (typeof title !== "string" || typeof date !== "string")
    throw "error: string expected for title and date";
  if (isNaN(amount)) throw "error: int expected for amount";

  if (title.trim().length === 0 || date.trim().length === 0)
    throw "Please input nonempty strings for title and date";

  // date checking

  const incomeCollection = await income();
  let newIncome = {
    title: title,
    date: date,
    amount: amount,
    _id: new mongodb.ObjectId().toString(),
  };

  const insertedInfo = await incomeCollection.insertOne(newIncome);
  if (insertedInfo.insertedCount === 0) throw "Error: could not add income";

  //  const finalPurchase = await get(newPurchase._id);
  return newIncome;
}

async function update(id, title, date, amount) {
  if (!id) throw "You must provide a valid id";
  if (
    typeof id !== "string" ||
    id.trim().length === 0 ||
    !mongodb.ObjectID.isValid(id)
  )
    throw "Invalid ID: ID must be a valid nonempty string";

  if (!title || !date || !amount)
    throw "Error: All fields must have valid values";
  if (typeof title !== "string" || typeof date !== "string" || isNaN(amount))
    throw "Invalid type for input";

  const incomeCollection = await income();
  const oldIncome = await get(id);
  let newIncome = {
    title: title,
    date: date,
    amount: amount,
    _id: id,
  };
  const updatedInfo = await incomeCollection.updateOne(
    { _id: id },
    { $set: newIncome }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw `Could not update income with id ${id}: no modifications were made`;
  }
  const finalIncome = await get(id);
  return finalIncome;
}

async function remove(id) {
  if (!id) throw "You must provide a valid id";
  if (
    typeof id !== "string" ||
    id.trim().length === 0 ||
    !mongodb.ObjectId.isValid(id)
  )
    throw "Invalid id: Please input a nonempty string";

  const incomeCollection = await income();
  const incomeDelete = await get(id);
  const incomeTitle = incomeDelete.title;
  if (incomeDelete === null) throw "No income with that id";
  const deletedInfo = await incomeCollection.deleteOne({ _id: id });
  if (deletedInfo.deleteCount === 0)
    throw `Could not delete income with id ${id}`;
  return `${incomeTitle} has been deleted`;
}

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
