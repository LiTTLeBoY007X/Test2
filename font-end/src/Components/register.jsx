import { useState } from 'react';
import axios from 'axios';
import shieldUserIcon from '../assets/shield-user-svgrepo-com.svg';
import callChatIcon from '../assets/call-chat-svgrepo-com.svg';
import keySquareIcon from '../assets/key-square-svgrepo-com.svg';
import logoWeb from '../assets/77DB8929-B1F3-4A50-AC08-1A763457A2B2.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function UserRegister() {
    const [UserName, setUserName] = useState('');
    const [Tel, setTel] = useState('');
    const [Password, setPassword] = useState('');

    const SubmitButton = async (e) => {
        e.preventDefault();
        if (Tel.length !== 10) {
            alert('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
            return;
        }
        try {
            // 1. ส่งข้อมูลสมัครสมาชิกไปยัง Backend
            const response = await axios.post(`${API_URL}/user`, {
                usernameRegister: UserName,
                telRegister: Tel,
                passwordRegister: Password
            });

            // 2. หากสมัครสำเร็จและได้ Token กลับมา ให้บันทึกลง localStorage (Auto-Login)
            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                window.location.href = response.data.redirectUrl || '/';
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
            console.error('Register Error:', errorMessage);

            // กรณีเบอร์โทรซ้ำ (Status 409) ถามผู้ใช้เพื่อนำทางไปหน้า Login
            if (error.response?.status === 409) {
                const goToLogin = window.confirm(`${errorMessage}\n\nต้องการไปหน้าเข้าสู่ระบบตอนนี้เลยหรือไม่?`);
                if (goToLogin) {
                    window.location.href = '/login';
                }
            } else {
                alert(errorMessage);
            }
        }
    };

    return (
        <div className='Register-Container flex flex-col items-center h-screen'>
            <img className='max-h-[40%]' src={logoWeb} alt="Logo" /> 
            <div className='flex-initial flex-col items-center text-center justify-items-center bg-[#F2FFF7] w-[85%] p-[20px] pl-[30px] pr-[30px] rounded-4xl max-w-[400px] shadow-[-3px_0px_54px_-7px_#000000]'>
                <h1 className='mb-[20px] text-2xl text-[#56ce52]'>สมัครบัญชีผู้ใช้</h1>                                           
                <form className='Register-form border-b-[0.5px] flex-initial flex-col items-center w-full' onSubmit={SubmitButton}>
                    <div className='UserName-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                        <img src={shieldUserIcon} className='w-[40px] bg-[#CDFFE1] rounded-xl p-1' alt="User Icon" />
                        <input 
                            className='p-2 focus:outline-none w-full' 
                            type='text' 
                            placeholder='ชื่อผู้ใช้' 
                            value={UserName} 
                            onChange={(e) => setUserName(e.target.value)} 
                        />
                    </div>
                    <div className='PhoneNumber-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                        <img src={callChatIcon} className='w-[40px] bg-[#CDFFE1] rounded-xl p-1' alt="Phone Icon" />
                        <input 
                            className='p-2 focus:outline-none w-full' 
                            type='tel' 
                            placeholder='เบอร์โทร' 
                            value={Tel} 
                            onChange={(e) => { const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10); setTel(onlyNums); }} 
                            maxLength={10} 
                            inputMode='numeric' 
                        />
                    </div>
                    <div className='PassWord-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                        <img src={keySquareIcon} className='w-[40px] bg-[#CDFFE1] rounded-xl p-1' alt="Key Icon" />
                        <input 
                            className='p-2 focus:outline-none w-full' 
                            type='password' 
                            value={Password} 
                            placeholder='รหัสผ่าน' 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className='Button-Form-Input-Container bg-[#11c140] shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start'>
                        <input className='p-2 focus:outline-none text-center w-full text-white cursor-pointer' type='submit' value="สมัครบัญชี" />
                    </div>
                </form>
                <div className='login-link'>
                    <a href='/login' className='hover:cursor-pointer text-blue-500'>เข้าสู่ระบบ</a>
                </div>
            </div>
        </div>
    );
}

export default UserRegister;