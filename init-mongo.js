// db = db.getSiblingDB("mmo");

// db.createUser({
//   user: "appadmin",
//   pwd: "appadminpassword",
//   roles: ["readWrite"],
// });

db = db.getSiblingDB("admin");
// move to the admin db - always created in Mongo
db.auth("root", "rootpassword");
// log as root admin if you decided to authenticate in your docker-compose file...
db = db.getSiblingDB("mmo");
// create and move to your new database
db.createUser({
  user: "dbUser",
  pwd: "dbPwd",
  roles: [
    {
      role: "dbOwner",
      db: "mmo",
    },
  ],
});
// user created
db.createCollection("users");

// db.createCollection("sample_collection");

// db.sample_collection.insertMany([
//   {
//     org: "helpdev",
//     filter: "EVENT_A",
//     addrs: "http://rest_client_1:8080/wh",
//   },
//   {
//     org: "helpdev",
//     filter: "EVENT_B",
//     addrs: "http://rest_client_2:8081/wh",
//   },
//   {
//     org: "github",
//     filter: "EVENT_C",
//     addrs: "http://rest_client_3:8082/wh",
//   },
// ]);
