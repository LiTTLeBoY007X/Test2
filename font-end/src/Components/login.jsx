import { useState } from 'react';
import axios from 'axios';
import shieldUserIcon from '../assets/shield-user-svgrepo-com.svg'; // ปรับ Path ให้ถูกต้องตามโครงสร้างโฟลเดอร์ของคุณ
import callChatIcon from '../assets/call-chat-svgrepo-com.svg';
import keySquareIcon from '../assets/key-square-svgrepo-com.svg';
import logoWeb from '../assets/77DB8929-B1F3-4A50-AC08-1A763457A2B2.png';


function UserLogin() {

    const [TelLogin,setTelLogin] = useState()
    const [Password,setPassword] = useState('')

    const SubmitButton = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://test2-cwly.onrender.com/user/login', {
                TelLogin: TelLogin,
                PasswordLogin: Password

                
            });
            
            window.location.href = response.data.redirectUrl || '/';
        } catch (error) {
        if (error.response) {
            console.log(error.response.data.message); // จะได้: "เกิดข้อผิดพลาดในการลงทะเบียน"
            alert(error.response.data.message)
        } else {
            console.error('ไม่สามารถเชื่อมต่อ Server ได้');
    }
        }
    };
 






    return <div className='Register-Container flex flex-col  items-center h-screen'>
        <img className=' max-h-[40%]' src={logoWeb}></img> 
        <div className='flex-initial flex-col items-center text-center justify-items-center bg-[#F2FFF7] w-[85%] p-[20px] pl-[30px] pr-[30px] rounded-4xl max-w-[400px] shadow-[-3px_0px_54px_-7px_#000000]' >
            <h1 className='mb-[20px] text-2xl text-[#56ce52]'>เข้าสู่ระบบ</h1>                                            
            <form className='Register-form border-b-[0.5px] flex-initial flex-col items-center w-full' onSubmit={SubmitButton} >
                <div className='PhoneNumber-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                    <img src={callChatIcon} className='w-[40px] bg-[#CDFFE1] rounded-xl p-1'/>
                    <input className='p-2 focus:outline-none w-full' type='tel' placeholder='เบอร์โทร' value={TelLogin} onChange={(e) => { const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10); setTelLogin(onlyNums); }} maxLength={10} inputMode='numeric'></input>
                </div>
                <div className='PassWord-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                    <img src={keySquareIcon} className='w-[40px] bg-[#CDFFE1] rounded-xl p-1'/>
                    <input className='p-2 focus:outline-none w-full ' type='password' placeholder='รหัสผ่าน' onChange={(e) =>{setPassword(e.target.value)}}></input>
                </div>
                <div className='Button-Form-Input-Container bg-[#11c140] hadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                    <input className='p-2 focus:outline-none text-center w-full text-white' type='submit' value="เข้าสู่ระบบ"></input>
                </div>
            </form>
            <div className='login-link' >
                <a href='/register' className='hover:cursor-pointer text-blue-500'>สมัครบัญชี</a>
            </div>
        </div>
        
    </div>
}


export default UserLogin