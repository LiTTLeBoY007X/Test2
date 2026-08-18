import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './navbar';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function MenuScore() {
    const [Userdata, setUserdata] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            // 1. ดึง Token จาก localStorage
            const token = localStorage.getItem('token');

            // ถ้าไม่มี Token ในเครื่อง ให้เด้งไปหน้าสมัครสมาชิกทันที
            if (!token) {
                window.location.href = '/register';
                return;
            }

            try {
                // 2. ส่ง Request โดยแนบ JWT Token ไปทาง Header 'Authorization'
                const response = await axios.get(`${API_URL}/check-auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.isAuthenticated) {
                    setUserdata(response.data.user); // เก็บข้อมูลผู้ใช้ไว้แสดงผล
                }
            } catch (error) {
                // ถ้า Token ไม่ถูกต้อง หมดอายุ หรือมี Error ให้ลบ Token ทิ้งแล้วเด้งกลับหน้า register
                localStorage.removeItem('token');
                window.location.href = '/register';
            } 
        };

        checkAuth();
    }, []);

    return (
        <div> 
            <div className="grid grid-cols-1 grid-rows-[50px_1fr_auto] h-[70dvh] ">
                <div className='flex items-center pl-[20px] '>
                   <div className='text-black bg-green-500 w-[100px] p-[6px] rounded-2xl text-center shadow-[0px_0px_10px_-3px_#ffffff]'>
                       {Userdata?.username}
                   </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className='bg-green-400 w-[200px] h-[200px] rounded-full flex justify-center items-center flex-col shadow-[0px_0px_30px_5px_#ffffff]'>
                        <div className='flex flex-col justify-center items-center'>
                            <span className='text-[15px]'>พ้อยที่ใช้ได้</span>
                            <span className='text-center text-[60px]'>{Userdata?.point || 0}</span>
                        </div>
                    </div>
                </div>
                <div>3</div>
            </div>
            <NavBar/>
        </div>
    );
}

export default MenuScore;