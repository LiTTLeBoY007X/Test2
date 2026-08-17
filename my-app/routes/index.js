var express = require('express');
var router = express.Router();
var path = require('path');
const bcrypt = require('bcrypt');
const { type } = require('os');
const { error } = require('console');


router.get('/check-auth', async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ isAuthenticated: false});
  }
  try {
    const UserID = req.app.get('UserID');
    
    // 2. นำ userId จาก Session ไปค้นหาข้อมูลผู้ใช้ใน Database
    const user = await UserID.findById(req.session.userId).select('-password');

    if (!user) {
      return res.status(404)
    }

    // 3. ถ้าพบข้อมูล ส่งยืนยันกลับไป
    return res.status(200).json({ 
      isAuthenticated: true, 
      user: user 
    });

  } catch (error) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์', error: error.message });
  }
});



  


/* GET home page. */
router.post('/user', async (req, res, next) => {
  const { username, tel, password } = req.body;
  const UserID = req.app.get('UserID');

  if (!username || !tel || !password) {
    return res.status(400).json({ message: 'ยังใส่ข้อมูลไม่ครบ' });
  }

  try {
    // 1. เข้ารหัส Password เพื่อความปลอดภัย
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. บันทึกข้อมูลผู้ใช้ลง Collection 'UserID'
    const newUser = new UserID({
      username: username,
      password: hashedPassword,
      tel: tel
    });
    await newUser.save();

    // 3. ผูกการใช้งานเข้ากับ Session ทันที (Auto-Login)
    req.session.userId = newUser._id;

    // 4. บันทึก Session ลง MongoDB ให้เรียบร้อย แล้วส่ง JSON ตอบกลับ
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง Session', error: err.message });
      }
      return res.status(200).json({ success: true, redirectUrl: '/' });
    });

  } catch (error) {
    // ดักจับ Error เช่น กรณีข้อมูลซ้ำ หรือ Database มีปัญหา
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
  }
});

router.post('/user/login', async (req, res, next) =>{
  const {TelLogin, PasswordLogin } = req.body;
  const UserID = req.app.get('UserID');
  console.log(TelLogin, PasswordLogin)
  try {
    const user = await UserID.findOne( { tel: Number(TelLogin) })
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ' });
    }
    const isMatch = await bcrypt.compare(req.body.PasswordLogin, user.password);
    if (!isMatch) {
      return res.status(401).json({message: 'รหัสผ่านไม่ถูกต้อง', error: error.message})
    } 

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง Session', error: err.message });
      }

      // 4. บันทึกข้อมูลผู้ใช้ลงใน Session
      req.session.userId = user._id;

      // 5. บันทึกลง Database (Store) ให้เรียบร้อยก่อนส่ง Response
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึก Session', error: saveErr.message });
        }
        return res.status(200).json({ success: true, redirectUrl: '/' });
      });
    });
  } catch {

  }

  
})


  router.post('/shop', async (req, res) => {
    try {


      
      const Shoplist = req.app.get('Shoplist');
      // 1. ดึง Model Shoplist ที่ฝากไว้ใน app.set มาใช้งาน

      // 1. รับข้อมูลที่ส่งมาจาก Frontend ผ่าน req.body
      const { nameShop_text, amount_1, price_1 } = req.body;

      // 2. นำข้อมูลมาสร้างเป็น Document ใหม่
      const newShop = new Shoplist({
        nameShop_text,
        amount_1,
        price_1
      });

      // 3. สั่งเซฟลง MongoDB
      const savedShop = await newShop.save();

      // 4. ส่งข้อมูลที่บันทึกสำเร็จกลับไปบอก Client (Status 201 = Created)
      res.status(201).json(savedShop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.get('/shopPreviews', async (req, res) => {
  try {
    const Shoplist = req.app.get('Shoplist');
    const items = await Shoplist.find(); 
    console.log(items)// ดึงข้อมูลทั้งหมดใน Collection
    res.status(200).json(items);     // ส่งข้อมูลกลับเป็น JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
});







module.exports = router;
