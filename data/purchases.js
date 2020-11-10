const mongoCollection = require("../config/mongoCollections");
const mongodb = require("mongodb");
const purchases = mongoCollection.purchases;

async function getAll() {
  const purchaseCollection = await purchases();
  const purchaseList = await purchaseCollection.find({}).toArray();
  return purchaseList;
}

async function get(id) {
  if (!id) throw "You must provide a valid id";
  if (
    typeof id !== "string" ||
    id.trim().length === 0 ||
    !mongodb.ObjectId.isValid(id)
  )
    throw "Invalid Id: Please input a nonempty string";

  const purchaseCollection = await purchases();
  const purchaseGet = await purchaseCollection.findOne({ _id: id });
  if (purchaseGet === null) throw `Could not find purchase with id ${id}`;

  return purchaseGet;
}

// title: short description that will appear on list
// date: string formated as mm/dd/yyyy when purchase was made
// amount: integer amount spent
// tags: array of tags related to purchase ie: ["fun money", "eating out"]
//      each element of tags must be a string
//      tags can be empty
async function create(title, date, amount, tags) {
  //TODO
  if (!title || !date || !amount || !tags)
    throw "Error: must provide all attributes";
  if (
    typeof title !== "string" ||
    typeof date !== "string" ||
    !Number.isInteger(amount) ||
    !Array.isArray(tags)
  )
    throw "Error: invalid input type";

  if (title.trim().length === 0 || date.trim().length === 0)
    throw "Please input nonempty strings for title and date";

  for (let i = 0; i < tags.length; i++) {
    if (typeof tags[i] !== "string") throw "Error: all tags must be strings";
  }

  // date checking

  const purchaseCollection = await purchases();
  let newPurchase = {
    title: title,
    date: date,
    amount: amount,
    tags: tags,
    _id: new mongodb.ObjectId().toString(),
  };

  const insertedInfo = await purchaseCollection.insertOne(newPurchase);
  if (insertedInfo.insertedCount === 0) throw "Error: could not add purchase";

  //  const finalPurchase = await get(newPurchase._id);
  return newPurchase;
}

async function update(id, title, date, amount, tags) {
  //TODO
  if (!title || !date || !amount || !tags)
    throw "Error: must provide all attributes";
  if (
    typeof title !== "string" ||
    typeof date !== "string" ||
    !Number.isInteger(amount) ||
    !Array.isArray(tags)
  )
    throw "Error: invalid input type";

  if (title.trim().length === 0 || date.trim().length === 0)
    throw "Please input nonempty strings for title and date";

  for (let i = 0; i < tags.length; i++) {
    if (typeof tags[i] !== "string") throw "Error: all tags must be strings";
  }

  // date checking

  const purchaseCollection = await purchases();
  const oldPurchase = await get(id);
  let newPurchase = {
    title: title,
    date: date,
    amount: amount,
    tags: tags,
    _id: id,
  };
  const updatedInfo = await purchaseCollection.updateOne(
    { _id: id },
    { $set: newPurchase }
  );
  if (updatedInfo.modifiedCount === 0)
    throw `Could not update purchase with id ${id}: no modification has been made`;
  const finalPurchase = await get(id);
  return finalPurchase;
}

async function remove(id) {
  if (!id) throw "You must provide a valid id";
  if (
    typeof id !== "string" ||
    id.trim().length === 0 ||
    !mongodb.ObjectId.isValid(id)
  )
    throw "Invalid Id: Please input a nonempty string";

  const purchaseCollection = await purchases();

  const purchaseDelete = await get(id);
  const purchaseTitle = purchaseDelete.title;
  if (purchaseDelete === null) throw "No Purchase with that id";
  const deletedInfo = await purchaseCollection.deleteOne({ _id: id });
  if (deletedInfo.deleteCount === 0)
    throw `Could not delete purchase with id ${id}`;

  return `${purchaseTitle} has been deleted`;
}
module.exports = {
  create,
  getAll,
  get,
  remove,
  update,
};
