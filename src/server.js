const express = require("express");
const sql = require("mssql/msnodesqlv8");
const { server } = require("typescript");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if ((process.env.NODE_ENV = "production")) {
  require("dotenv").config();
}

var config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  driver: process.env.DRIVER,
  options: {
    trustedConnection: true,
  },
};

const db = sql.connect(config, function (err) {
  if (err) throw err;
  console.log("Database Connected");
});

app.get("/getUsersList", async function (req, res) {
  let request = db.request();

  const result = await request.query("select * from useraccounts");
  res.json({ msg: "Fetch Users Successfully", data: result.recordsets });
});

app.post("/updateUser/:id", async function (req, res) {
  const request = db.request();

  request.input("id", sql.Int, req.params.id);
  request.input("name", sql.VarChar, req.body.name);
  request.input("phone", sql.VarChar, req.body.phone);
  request.input("address", sql.VarChar, req.body.address);
  request.input("email", sql.VarChar, req.body.email);
  request.input("password", sql.VarChar, req.body.password);
  request.input("insertdate", sql.DateTime, req.body.insertdate);
  request.input("usertype", sql.VarChar, req.body.usertype);

  await request.query(
    "update useraccounts set name=@name, phone=@phone, address=@address, email=@email,, password=@password, insertdate=@insertdate, usertype=@usertype where id=@id"
  );

  res.json({ msg: "Record Updated Successfully" });
});

app.post("/deleteUser/:id", async function (req, res) {
  const request = db.request();

  request.input("id", sql.Int, req.params.id);

  await request.query("delete from useraccounts where id=@id");

  res.json({ msg: "Record Deleted Successfully" });
});

app.post("/saveUser", async function (req, res) {
  const request = db.request();

  request
    .input("id", sql.Int, req.body.id)
    .input("name", sql.VarChar(200), req.body.name)
    .input("phone", sql.VarChar(200), req.body.phone)
    .input("address", sql.VarChar(200), req.body.address)
    .input("email", sql.VarChar(200), req.body.email)
    .input("password", sql.VarChar(max), req.body.password)
    .input("insertdate", sql.DateTime(null), req.body.insertdate)
    .input("usertype", sql.VarChar(200), req.body.usertype);
  const q =
    "insert into useraccounts(id,name,phone,address,email,password,insertdate,usertype) vales(@id, @name, @phone, @address, @email, @password, @insertdate, @usertype)";

  const result = await request.query(q);

  res.json({ msg: "Save UserAccount Data Successfully" });
});

app.get("/", function (req, res) {
  res.send(<p>Welcome in Node Project </p>);
});

app.get("/about", function (req, res) {
  res.send(<p> About Page </p>);
});

Port = process.env.PORT || 8085;

app.listen(PORT, function () {
  console.log(`Server is listening at port ${PORT}`);
});
