// server/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 1. insertOne()
router.post("/insert", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. insertMany()
router.post("/insertMany", async (req, res) => {
  try {
    const users = await User.insertMany(req.body);
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. find()
router.get("/find", async (req, res) => {
  try {
    const users = await User.find(req.query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. findOne()
router.get("/findOne", async (req, res) => {
  try {
    const user = await User.findOne(req.query);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. find().limit()
router.get("/limit", async (req, res) => {
  try {
    const users = await User.find().limit(Number(req.query.n));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. find().skip()
router.get("/skip", async (req, res) => {
  try {
    const users = await User.find().skip(Number(req.query.n));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. find().sort()
router.get("/sort", async (req, res) => {
  try {
    const sortObj = JSON.parse(req.query.sort);
    const users = await User.find().sort(sortObj);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. distinct()
router.get("/distinct/:field", async (req, res) => {
  try {
    const values = await User.distinct(req.params.field);
    res.json(values);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. countDocuments()
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments(req.query);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. updateOne()
router.put("/updateOne", async (req, res) => {
  try {
    const result = await User.updateOne(req.query, { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 11. updateMany()
router.put("/updateMany", async (req, res) => {
  try {
    const result = await User.updateMany(req.query, { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 12. replaceOne()
router.put("/replaceOne", async (req, res) => {
  try {
    const result = await User.replaceOne(req.query, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 13. deleteOne()
router.delete("/deleteOne", async (req, res) => {
  try {
    const result = await User.deleteOne(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 14. deleteMany()
router.delete("/deleteMany", async (req, res) => {
  try {
    const result = await User.deleteMany(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 15. aggregate()
router.get("/aggregate", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { age: { $gte: 18 } } },
      { $group: { _id: "$planet", total: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 16. createIndex() is not available directly in Mongoose (needs raw MongoDB)
// 17. dropIndex()
router.delete("/dropIndex", async (req, res) => {
  try {
    const result = await User.collection.dropIndex(req.query.name);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 18. getIndexes()
router.get("/indexes", async (req, res) => {
  try {
    const result = await User.collection.indexes();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 19. findOneAndUpdate()
router.put("/findOneAndUpdate", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      req.query,
      { $set: req.body },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 20. findOneAndDelete()
router.delete("/findOneAndDelete", async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.query);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 21. bulkWrite()
router.post("/bulkWrite", async (req, res) => {
  try {
    const result = await User.bulkWrite(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 22. findOneAndReplace()
router.put("/findOneAndReplace", async (req, res) => {
  try {
    const user = await User.findOneAndReplace(req.query, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 23. renameCollection()
router.post("/renameCollection", async (req, res) => {
  try {
    const db = await User.db;
    const result = await db.renameCollection(
      req.body.oldName,
      req.body.newName
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 24. drop()
router.delete("/dropCollection", async (req, res) => {
  try {
    const result = await User.collection.drop();
    res.json({ dropped: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 25. listCollections()
router.get("/collections", async (req, res) => {
  try {
    const collections = await User.db.listCollections().toArray();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top crew members (sorted by rank and active status)
router.get("/top", async (req, res) => {
  try {
    const topCrew = await User.find({ active: true })
      .sort({ rank: -1, name: 1 })
      .limit(10);
    res.json(topCrew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top planets by crew count
router.get("/topPlanets", async (req, res) => {
  try {
    const topPlanets = await User.aggregate([
      { $group: { _id: "$planet", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(topPlanets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent activity
router.get("/recent", async (req, res) => {
  try {
    const recentActivity = await User.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('name rank planet updatedAt');
    
    const formattedActivity = recentActivity.map(user => ({
      _id: user._id,
      name: user.name,
      action: `${user.rank} ${user.name} updated`,
      timestamp: user.updatedAt
    }));
    
    res.json(formattedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchResults = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { rank: { $regex: query, $options: 'i' } },
        { planet: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter users
router.get("/filter", async (req, res) => {
  try {
    const { planet, rank } = req.query;
    const filter = {};

    if (planet) filter.planet = planet;
    if (rank) filter.rank = rank;

    const filteredUsers = await User.find(filter);
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export users data
router.get("/export", async (req, res) => {
  try {
    const users = await User.find();
    
    // Convert to CSV format
    const headers = "Name,Rank,Planet,Email,Age,Active\n";
    const csvData = users.map(user => 
      `${user.name},${user.rank},${user.planet},${user.email},${user.age},${user.active}`
    ).join("\n");
    
    const csv = headers + csvData;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=crew_data.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
