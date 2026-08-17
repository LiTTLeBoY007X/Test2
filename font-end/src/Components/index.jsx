import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './navbar';

function MenuScore() {
    const [Userdata, setUserdata] = useState(null)
    useEffect(() => {
        const checkAuth = async () => {
        try {
            // ยิงไปเช็ก session ที่ backend โดยแนบ Cookie ไปด้วย
            const response = await axios.get('http://localhost:3000/check-auth', {
            withCredentials: true // 👈 สำคัญมาก: เพื่อแนบ Cookie ไปกับ Request
            });

            if (response.data.isAuthenticated) {
            setUserdata(response.data.user); // เก็บข้อมูลผู้ใช้ไว้แสดงผล
            }
        } catch (error) {
            window.location.href =  '/register';
        } 
        };

        checkAuth();
    }, []);











    return <div> 
        <div className="grid grid-cols-1 grid-rows-[50px_1fr_auto] h-[70dvh] ">
            <div className='flex items-center pl-[20px] '>
               <div className='text-black bg-green-500 w-[100px] p-[6px] rounded-2xl text-center shadow-[0px_0px_10px_-3px_#ffffff]'>{Userdata?.username}</div>
            </div>

            <div className='flex justify-center items-center'>
                <div className='bg-green-400 w-[200px] h-[200px] rounded-full flex justify-center items-center flex-col shadow-[0px_0px_30px_5px_#ffffff'  >
                    <div className='flex flex-col justify-center items-center'>
                        <span className='text-[15px]'>พ้อยที่ใช้ได้</span>
                        <span className='text-center text-[60px]'>{Userdata?.point}</span>
                    </div>
                </div>
            </div>
            <div >3</div>
        </div>
        <NavBar/>
    </div>
}

export default MenuScore