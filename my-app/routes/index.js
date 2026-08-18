var express = require('express');
var router = express.Router();
var path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔑 Middleware สำหรับตรวจสอบ JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ดึง Token หลังคำว่า Bearer

  if (!token) {
    return res.status(401).json({ isAuthenticated: false, message: 'ไม่มี Token แนบมา' });
  }

  jwt.verify(token, process.env.USER_ID_KEYJWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({ isAuthenticated: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
    req.user = decoded; // เก็บข้อมูลผู้ใช้ที่Decodeแล้วไว้ใน req.user
    next();
  });
};

// 1. ตรวจสอบสิทธิ์ (Check Auth) ผ่าน JWT Token
router.get('/check-auth', verifyToken, async (req, res, next) => {
  try {
    const UserID = req.app.get('UserID');
    
    // ดึง userId จาก req.user ที่แกะได้จาก Middleware
    const user = await UserID.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ isAuthenticated: false, message: 'ไม่พบผู้ใช้งาน' });
    }

    return res.status(200).json({ 
      isAuthenticated: true, 
      user: user 
    });

  } catch (error) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์', error: error.message });
  }
});

// 2. สมัครสมาชิก (Register) แล้วสร้าง Token ส่งกลับทันที (Auto-Login)
router.post('/user', async (req, res, next) => {
  const { usernameRegister, telRegister, passwordRegister } = req.body;
  const UserID = req.app.get('UserID');

  if (!usernameRegister || !telRegister || !passwordRegister) {
    return res.status(400).json({ message: 'ยังใส่ข้อมูลไม่ครบ' });
  } 

  const mobileRegex = /^0[689]\d{8}$/;
  if (!mobileRegex.test(telRegister)) {
    return res.status(400).json({ message: 'เบอร์โทรศัพท์ไม่ถูกต้อง' });
  }

  try {
    const userNumber = await UserID.findOne({ tel: Number(telRegister) }, 'tel');
    if (userNumber) {
      return res.status(409).json({ message: 'เบอร์โทรศัพท์นี้ถูกใช้งานไปแล้ว ลองเข้าสู่ระบบแทน' });
    }
    
    const hashedPassword = await bcrypt.hash(passwordRegister, 10);

    const newUser = new UserID({
      username: usernameRegister,
      password: hashedPassword,
      tel: telRegister
    });
    await newUser.save();

    // สร้าง JWT Token
    const token = jwt.sign(
      { userId: newUser._id, tel: newUser.tel },
      process.env.USER_ID_KEYJWT,
      { expiresIn: '1d' } // กำหนดหมดอายุใน 7 วัน
    );

    return res.status(200).json({ 
      success: true, 
      token: token, 
      redirectUrl: '/' 
    });

  } catch (error) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
  }
});

// 3. เข้าสู่ระบบ (Login)
router.post('/user/login', async (req, res, next) => {
  const { TelLogin, PasswordLogin } = req.body;
  const UserID = req.app.get('UserID');

  try {
    const user = await UserID.findOne({ tel: Number(TelLogin) });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ' });
    }

    const isMatch = await bcrypt.compare(PasswordLogin, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    } 

    // สร้าง JWT Token
    const token = jwt.sign(
      { userId: user._id, tel: user.tel },
      process.env.USER_ID_KEYJWT,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ 
      success: true, 
      token: token, 
      redirectUrl: '/' 
    });

  } catch (error) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
  }
});

// 4. Shop API (คงเดิม)
router.post('/shop', async (req, res) => {
  try {
    const Shoplist = req.app.get('Shoplist');
    const { nameShop_text, amount_1, price_1 } = req.body;

    const newShop = new Shoplist({
      nameShop_text,
      amount_1,
      price_1
    });

    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/shopPreviews', async (req, res) => {
  try {
    const Shoplist = req.app.get('Shoplist');
    const items = await Shoplist.find(); 
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
});

module.exports = router;