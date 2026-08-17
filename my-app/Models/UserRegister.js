const mongoose = require('mongoose');

// นิยามโครงสร้างข้อมูล ( Schema ให้ตรงกับใน MongoDB )
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  tel: { type: Number, default: 0 },
  password: { type: String, require: true },
  point: { type: Number, default: 0 }
});

// ส่งออกเป็น Model (ชื่อ Collection ใน DB จะกลายเป็น 'shops' แบบตัวพิมพ์เล็ก+พหูพจน์อัตโนมัติ)
module.exports = userSchema;