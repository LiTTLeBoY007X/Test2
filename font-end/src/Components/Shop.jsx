import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from "./navbar"
import pic from "../assets/hero.png"

function Shop() {

const [items, setItems] = useState([]);

  // โหลดข้อมูลเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    axios.get('http://localhost:3000/shopPreviews')
      .then(res => {
        setItems(res.data); // บันทึกข้อมูลที่ดึงได้ลง State
      })
      .catch(err => console.error(err));
}, []);



  


    return <div className='flex  items-center flex-col gap-[20px]   min-h-screen '>
        <div className='fixed bg-green-500 w-dvw h-[50px] flex justify-center items-center'>
            <span className=' text-center text-[20px] '>แลกแต้ม</span>
        </div>
        <div className='flex flex-col gap-[20px] mt-[70px] mb-[80px]'>
            {items.map((item) => (
            <div key={item._id} className='grid ่ items-center grid-cols-[100px_auto] grid-rows-2  gap-[4px] w-[300px]  bg-white bor rounded-2xl h-[130px]'>
                <img className='w-[100px] row-span-2 m-[15px]' src={pic} alt='' />
                <div className='flex justify-center items-center flex-col'>
                    <div className='text-center'>{item.nameShop_text}</div>
                    <div className='text-center text-[20px]'>{item.price_1} คะแนน</div>

                </div>
    
                <div className="col-start-2 flex justify-center items-center">
                    <input  type="submit" value="แลกของรางวัล" className='bg-green-300 rounded-2xl w-[120px] h-[40px]' />
                </div>
            </div>

            ))}
        </div>

        <NavBar />
    </div>
}

export default Shop