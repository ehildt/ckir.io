// Check if the replica set is already initialized
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

// Initialize the replica set if it's not already initialized
(function initReplicaSet() {
  try {
    rs.initiate({
      _id: "rs0",
      members: [
        { _id: 0, host: "mongo1:27017" },
        { _id: 1, host: "mongo2:27017" },
        { _id: 2, host: "mongo3:27017" }
      ]
    });
  } catch (e) {
    print("Error during replica set initiation: " + e.message);
  }
})();

// Wait until a PRIMARY is elected before continuing
(function waitForPrimary() {
  let isPrimary = false;
  let retries = 30;  // Retry up to 30 times (for about 1.5 minutes)

  while (!isPrimary && retries > 0) {
    try {
      // Check if any node is PRIMARY
      isPrimary = rs.status().members.some(m => m.stateStr === "PRIMARY");
      if (isPrimary) {
        print("Primary node elected.");
      } else {
        print("Waiting for primary...");
        sleep(1000); // Wait for 5 seconds before retrying
        retries--;
      }
    } catch (e) {
      print("Waiting for replica set status: " + e.message);
      sleep(1000); // Wait before retrying in case of error
    }
  }

  if (!isPrimary) {
    print("Error: No primary node elected after multiple retries.");
    exit(1);
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
