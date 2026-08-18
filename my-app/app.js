const shopSchema = require('./Models/shop');
const userSchema = require('./Models/UserRegister');
require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// เชื่อมต่อ Database
const dbShoplist = mongoose.createConnection(MONGODB_URI, { dbName: 'Shoplist' });
const dbUserID = mongoose.createConnection(MONGODB_URI, { dbName: 'User_ID_PASS' });

// เช็กสถานะของ dbShoplist
dbShoplist.on('connected', () => console.log('✅ เชื่อมต่อ DB: Shoplist สำเร็จ!'));
dbShoplist.on('error', (err) => console.error('❌ DB Shoplist ล้มเหลว:', err));

// เช็กสถานะของ dbUserID
dbUserID.on('connected', () => console.log('✅ เชื่อมต่อ DB: User_ID_PASS สำเร็จ!'));
dbUserID.on('error', (err) => console.error('❌ DB User_ID_PASS ล้มเหลว:', err));

const Shoplist = dbShoplist.model('Shop', shopSchema, 'nameShop');
const UserID = dbUserID.model('UserRegister', userSchema, 'UserID');

var app = express();

// ตั้งค่า CORS ให้รองรับ Frontend Domain
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://test2-bay-mu.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // 👈 เปิดไว้นะครับ เพื่อป้องกันไม่ให้เจอตาราง CORS Error ตัวนี้อีก
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ผูก Model ไว้กับ app เพื่อใช้ใน Router
app.set('Shoplist', Shoplist);
app.set('UserID', UserID);

// Routes
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

module.exports = app;