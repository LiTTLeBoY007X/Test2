const mongoose = require('mongoose');

// นิยามโครงสร้างข้อมูล ( Schema ให้ตรงกับใน MongoDB )
const shopSchema = new mongoose.Schema({
  nameShop_text: { type: String, required: true },
  amount_1: { type: Number, default: 0 },
  price_1: { type: Number, default: 0 }
});

// ส่งออกเป็น Model (ชื่อ Collection ใน DB จะกลายเป็น 'shops' แบบตัวพิมพ์เล็ก+พหูพจน์อัตโนมัติ)
module.exports = shopSchema;