module.exports = {
  async up(db, client) {
    // Apply migration: create "users" collection
    await db.createCollection("users");
  },

  async down(db, client) {
    // Rollback: drop the "users" collection
    await db.collection("users").drop();
  }
};
