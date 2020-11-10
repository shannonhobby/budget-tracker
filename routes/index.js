const expenseRoutes = require("/expenses");
const purchaseRoutes = require("/purchases");
const homeRoute = require("/home");
const constructorMethod = (app) => {
  app.use("/", homeRoute);
  app.use("/purchases", purchaseRoute);
  app.use("/expenses", expenseRoutes);

  app.get("*", (req, res) => {
    res.status(404).render("show/error", {
      errorMessage:
        "404 Error: We're sorry. We couldn't find the page you were looking for.",
      title: "Error",
    });
  });
};

module.exports = constructorMethod;
