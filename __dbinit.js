const db = require("./models");



module.exports = async ()=>{
    try {
        console.log("Connecting to database...");
        await db.sequelize.authenticate();
        console.log("DB Connection established successfully,synchronizing Database...");
        await db.sequelize.sync(
            // NOTE: just uncomment this line when you need to wipe the DB
            // {force:true}
            );
        console.log("Database synchronized successfully");
    } catch (error) {
        throw new Error(error);
    }

}