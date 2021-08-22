const db = require('../src/db')
require('dotenv').config();

db.initialize().then(()=>{
    console.log('migration success')
    process.exit()
}).catch((err) => {
    console.log(`Error ${err}`)
    process.exit(1);
});
