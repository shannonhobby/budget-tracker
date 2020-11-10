const dbConnection = require("./config/mongoConnection");
const purch = require("./data/purchases");
const inc = require("./data/income");
//const purchases = data.purchases;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  let purchase;
  try {
    purchase = await purch.create("New outfit for work", "10/13/2020", 50, [
      "Work",
      "Clothing",
    ]);
  } catch (e) {
    console.log(e);
  }
  let get = await purch.getAll();
  console.log(get);

  let incomeTA;
  try {
    incomeTA = await inc.create(
      "Paycheck from TA position",
      "10/20/2020",
      142.25
    );
  } catch (e) {
    console.log(e);
  }

  get = await inc.getAll();
  console.log(get);

  get = await inc.update(
    incomeTA._id,
    "Paycheck from Teaching Assistant Position",
    "10/20/2020",
    142.25
  );
  console.log(get);
  get = await inc.remove(incomeTA._id);
  console.log(get);

  get = await purch.update(
    purchase._id,
    "New dress for work",
    "10/29/2020",
    50,
    ["Work", "Clothing"]
  );

  console.log(get);

  get = await purch.remove(purchase._id);
  console.log(get);

  await db.serverConfig.close();
};

main().catch(console.log);
