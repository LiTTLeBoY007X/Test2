const shopSchema = require('./Models/shop');
const userSchema = require('./Models/UserRegister');
require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const USER_ID_KEY = process.env.USER_ID_KEY;
const MONGODB_URI = process.env.MONGODB_URI;






const dbShoplist = mongoose.createConnection(MONGODB_URI, { dbName: 'Shoplist' });
const dbUserID = mongoose.createConnection(MONGO_URI = MONGODB_URI, { dbName: 'User_ID_PASS' });
// เช็กสถานะของ dbShoplist
dbShoplist.on('connected', () => console.log('✅ เชื่อมต่อ DB: Shoplist สำเร็จ!'));
dbShoplist.on('error', (err) => console.error('❌ DB Shoplist ล้มเหลว:', err));

// เช็กสถานะของ dbUserID
dbUserID.on('connected', () => console.log('✅ เชื่อมต่อ DB: User_ID_PASS สำเร็จ!'));
dbUserID.on('error', (err) => console.error('❌ DB User_ID_PASS ล้มเหลว:', err));


const Shoplist = dbShoplist.model('Shop', shopSchema, 'nameShop');
const UserID = dbUserID.model('UserRegister', userSchema, 'UserID');



var indexRouter = require('./routes/index');
var app = express();
app.use(cors({
  origin: 'http://localhost:5173', // 👈 ใส่ URL หน้าบ้านของคุณ (เช่น Vite Port 5173 หรือ CRA Port 3000)
  credentials: true                // 👈 อนุญาตให้รับ-ส่ง Cookie/Session
}));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('Shoplist', Shoplist);
app.set('UserID', UserID);


// 2. วางโค้ด Session ตรงนี้ (ก่อน Route ทั้งหมด)
app.use(session({
  secret: USER_ID_KEY,
  resave: false,
  saveUninitialized: false,
  store: (MongoStore.default || MongoStore).create({ 
    mongoUrl: MONGODB_URI,
    dbName: 'User_ID_PASS' // 👈 ระบุชื่อ DB ให้ตรงกับที่เก็บ User
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 วัน
    httpOnly: true,
    secure: false
  }
}));






app.use('/', indexRouter);

module.exports = app;
