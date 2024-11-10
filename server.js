//Connections
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3003;
const cors = require('cors');
const fs = require('fs');

//using cors for prevention error on FE
app.use(cors());

//Creation DB file
const db = new sqlite3.Database('./krossovkiDB.db',sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, err => {
    if (err) console.log('Open krossovki DB error: ', err.message);
    else console.log('krossovki DB creation succes'); 
});

const clientsDB = new sqlite3.Database('./clientsDB.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, err => {
    if (err) console.log('Open clientsDB error', err.message)
    else console.log('Clients DB succesfully created')
})
//Data for add to DB
// const krossovkiData = [
//     {
//         name : 'Мужские Кроссовки Nike Blazer Mid Suede',
//         price : 1299,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike Air Max 270',
//         price : 1500,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike Blazer Mid Suede',
//         price : 1313,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Кроссовки Puma X Aka Boku Future Rider',
//         price : 1521,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike LeBron XVIII',
//         price : 1000,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Jordan Air Jordan 11',
//         price : 950,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike Kyrie 7',
//         price : 300,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Under Armour Curry 8',
//         price : 8800,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike Lebron XVIII Low',
//         price : 17300,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike Blazer Mid Suede',
//         price : 450,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Кроссовки Puma X Aka Boku Future Rider',
//         price : 999,
//         imagePath : './img/sneakers1.jpg'
//     },
//     {
//         name : 'Мужские Кроссовки Nike Kyrie Flytrap IV',
//         price : 1100,
//         imagePath : './img/sneakers1.jpg'
//     },
// ]

//Creating DB
// db.run(
//         `CREATE TABLE IF NOT EXISTS krossovkiDB (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         price INT NOT NULL,
//         img BLOB
//         )
//         `),
//     (err) => {
//     if (err) console.log('Create table error: ',err.message)
//     else console.log('Table already created')
// }

db.run(
    `CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    isFavourites BOOLEAN
    )
    `
)

// db.serialize(() => {
//     db.run('ALTER TABLE krossovkiDB ADD COLUMN image BLOB', (err) => {
//         if (err) console.log(err)
//         else console.log('images added')
//     })
// })
// db.close();

//Adding data to DB
// const insertData = (krosyAdd) => {
//     const insert = db.prepare(
//         `INSERT INTO krossovkiDB (name, price ,img) VALUES (?, ?, ?)`);

//         krosyAdd.forEach(krosItem => {
//             const imgData = fs.readFileSync(krosItem.imagePath);
//             insert.run([krosItem.name, krosItem.price, imgData], function(err) {
//                 if (err) return console.error('Insert data error: ', err.message)
//             });
//         });
//     insert.finalize();
// }
// insertData(krossovkiData);

//Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//Response data from root to '/'
app.get('/', (req, res) => {
    db.all('SELECT name,price,img FROM krossovkiDB', [], (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return
        }

        const result = rows.map(row => ({
            name: row.name,
            price: row.price,
            img: row.img ? Buffer.from(row.img).toString('base64') : null
        }))
        res.json(rows)
        console.log(rows)
    })
  });