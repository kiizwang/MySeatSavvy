const { MongoClient } = require("mongodb");

// Connection URL
const url = "mongodb://localhost:27017"; // Replace with your MongoDB server URL

// Database Name
const dbName = "yourDatabaseName"; // Replace with your database name

// Sample data array (replace with your own data)
const restaurantData = [
  { name: "Restaurant A", cuisine: "Italian" },
  { name: "Restaurant B", cuisine: "Mexican" },
  { name: "Restaurant C", cuisine: "Japanese" },
  { name: "Restaurant D", cuisine: "Indian" },
  { name: "Restaurant E", cuisine: "Chinese" },
];

// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true }, async (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }

  const db = client.db(dbName);
  const restaurantCollection = db.collection("restaurants");

  try {
    // Insert the array of objects as documents in the collection
    const result = await restaurantCollection.insertMany(restaurantData);

    console.log(`${result.insertedCount} documents inserted into the collection`);
  } catch (insertError) {
    console.error("Error inserting documents:", insertError);
  } finally {
    client.close(); // Close the MongoDB connection
  }
});
