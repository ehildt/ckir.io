// Check if the replica set is already initiated
(function checkReplicaSet() {
  try {
    if (rs.status().ok === 1) {
      print("Replica set already initialized. Skipping initialization.");
      exit(0);
    }
  } catch (e) {
    print("Replica set not initialized, proceeding with initialization.");
  }
})();

// Initiate the replica set if it is not already initialized
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
});

// Wait until a PRIMARY is elected before continuing
(function waitForPrimary() {
  let isPrimary = false;
  while (!isPrimary) {
    try {
      isPrimary = rs.status().members.some(m => m.stateStr === "PRIMARY");
      if (!isPrimary) sleep(1000);
    } catch (e) {
      print("Waiting for replica set status...");
      sleep(1000);
    }
  }
})();

// Switch to admin DB and create the root admin user
db = db.getSiblingDB("admin");
db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [{ role: "root", db: "admin" }]
});

print("✅ Root admin user created");

// Optional: Switch to chat DB and create app user
db = db.getSiblingDB("chat");
db.createUser({
  user: "resync",
  pwd: "resync",
  roles: [{ role: "readWrite", db: "chat" }]
});

print("✅ App user for chat created");

// Confirm replica set and user creation
print("✅ Replica set initialized and users created successfully!");
