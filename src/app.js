const express = require('express');

const app = express();

app.use("/profile", (req, res) => {
  res.send('Profile page');
});

app.use("/about", (req, res) => {
  res.send("About page");
})


app.listen(7777, () => {
  console.log("server is listening on port 7777");
});