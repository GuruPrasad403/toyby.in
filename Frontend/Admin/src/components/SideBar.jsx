import { useState } from "react"
import profile from '../assets/react.svg'
import { RiAlignItemLeftFill } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import { LuBaggageClaim } from "react-icons/lu";
import { FaUserSecret } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { MdContactMail } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const MenuItems = [{
    title:"Dashbord",
    icon:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
        ,
    route:"/Dashbord"
},
{
    title:"Products",
    icon:<RiAlignItemLeftFill />,
    route:"/Products"
},
{
    title:"Category",
    icon:<MdCategory />,
    route:"/Category"
},
{
    title:"Orders",
    icon:<LuBaggageClaim />,
    route:"/Orders"
},
{
    title:"Users",
    icon:<FaUserSecret />,
    route:"/Users"
},
{
    title:"Contact",
    icon:<MdContactMail />,
    route:"/Contact"
}
]

export default function SideBar(){
    const [mobileUser, setMobileuser] = useState(false)
    const toggal = ()=> setMobileuser(!mobileUser)
    const notify = ()=> toast.warn("Under Devlopment")
    return (
        <div>
            
        {
            !mobileUser?<div className="block lg:hidden grid-rows-20 h-screen w-96 bg-[#1e2640] text-white">
                 <div onClick={toggal} className='block cursor-pointer lg:hidden py-4 p-2 text-white'>                 
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</div> 
            <div className="overflow-hidden flex justify-between items-start pt-5 pl-5 pr-2">
                <div className="flex flex-row justify-around items-start gap-2">
                    <div className='w-14 h-14'>
                        <img className="rounded-lg w-12 h-12 " src={profile} alt="this is the profile pic"  />
                    </div>
                    <div className='text-white'>
                        <h1 className='font-semibold text-md'>Guruprasad G</h1>
                        <a href="#" className='text-sm underline' onClick={notify}>Visit Store</a>
                    </div>
                </div>
                
            </div>
            <div className="row-span-8 mx-2 my-10 ">
                {
                    MenuItems.map((ele,key)=>{
                        return <MenuCards title={ele.title} icon={ele.icon} key={key} />
                    })
                }
            </div>
            <div className="flex flex-row justify-start items-center gap-5  bg-[#818d9a54] m-4 py-2 pl-5 rounded-lg ">
                <div>
                    <MdContactSupport />                    
                </div>
                <div className='flex text-xs flex-col'>
                    <div>
                        <p>Help & Support</p>
                    </div>
                </div>
            </div>
        </div>: <div className='block py-6 p-2 lg:hidden cursor-pointer' onClick={toggal}> <svg class="w-6 h-6" aria-hidden="true" fill="currentolor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path></svg>


</div>
        }
            <div className="fixed hidden lg:grid grid-rows-10 h-full w-72 bg-[#1e2640] text-white">
            <div className=" flex justify-between items-start pt-5 pl-5 pr-2">
                <div className="flex flex-row justify-around items-start gap-2">
                    <div className='w-14 h-14 mt-2'>
                        <img className="rounded-lg w-12 h-12 " src={profile} alt="this is the profile pic"  />
                    </div>
                    <div className='text-white flex flex-col'>
                        <h1 className='font-semibold text-md'>Toyby.in</h1>
                        <a href="#" className='text-sm  underline' onClick={notify}>Visit Store</a>
                    </div>
                </div>
                
            </div>
            <div className="row-span-8 mx-5 my-10 ">
                {
                    MenuItems.map((ele,key)=>{
                        return <MenuCards title={ele.title} icon={ele.icon} key={key} />
                    })
                }
            </div>
            <div className="flex flex-row justify-start items-center gap-5  bg-[#818d9a54] m-4 py-2 pl-5 rounded-lg ">
            <div className="text-2xl">
                    <MdContactSupport />                    
                </div>

                <div className='flex text-xs flex-col'>
                    <div>
                        <p>Help & Support</p>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />
        </div>
    )
}

const MenuCards = ({title,icon})=>{

    return <div className='flex flex-cols justify-start items-center w-full gap-3 p-2 mx-2 my-3 text-sm font-semibold hover:bg-[#818d9a54] rounded-md'>
                <div className="text-xl">
                {icon}
                </div>
                <div className="w-full">
                    <h1 className='hover:opacity-100 text-xl  hover:text-white'>{title}</h1>
                </div>
            </div>
}