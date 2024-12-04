import { GiTakeMyMoney } from "react-icons/gi";
import { LiaUserSecretSolid } from "react-icons/lia";
import { MdDeliveryDining } from "react-icons/md";
import { FaSitemap } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
export default function ReportCard(){
    const [data,setData] = useState()
    const fetchData = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: 'https://toyby-in.vercel.app/api/reports/summary',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTczMTE3NTk1OX0.bhaHTB96SUPmPOAPJBpG-3OVulkIRmjSBmsKyLTY4Fg',
                },
                params: {
                    isAdmin: true, // Body data
                },
            });
            setData(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(()=>{
        fetchData()
    },[])    
    return(
        
        <div className="p-1 md:p-3 my-5">
            <div className="grid md:grid-cols-4 grid-rows-1 gap-12 my-2 ">
                <div className="grid grid-cols-2 gap-5 p-5 w-full shadow-lg rounded-3xl items-center  pl-5 hover:bg-[#1e2640] hover:text-white" >
                    <div>
                        <div>
                            {data?<h1 className="text-3xl">{data.totalRevenue}</h1>:"Loading"}
                        </div>
                        <div>
                            <h1 className="py-2 text-lg md:text-xl font-semibold">
                                Total  Revenu
                            </h1>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-5xl flex flex-row justify-evenly items-center hover:text-white">
                        <GiTakeMyMoney />
                        
                        <div className=" flex flex-row gap-1 justify-around items-baseline">
                            <div className=" h-4 w-2 opacity-50 rounded-full bg-orange-500 "></div>
                            <div className=" h-8 w-2 opacity-50 rounded-full bg-orange-500 "></div>
                            <div className=" h-12 w-2 opacity-80 rounded-full bg-orange-500 "></div>
                            <div className=" h-6 w-2 opacity-50 rounded-full bg-orange-500 "></div>
                            <div className=" h-6 w-2 opacity-50 rounded-full bg-orange-500 "></div>
                        </div>
                        </h1>

                    </div>
                </div>
                <div>
                <div className="grid grid-cols-2 gap-5 p-5 w-full shadow-lg rounded-3xl items-center  pl-5 hover:bg-[#1e2640] hover:text-white" >
                    <div>
                        <div>
                            {data?<h1 className="text-3xl"> {data.totalOrders}</h1>:"loading"}
                        </div>
                        <div>
                            <h1 className="py-2 text-lg md:text-xl font-semibold">
                                Total Orders
                            </h1>
                        </div>
                    </div>
                    <div>
                    <h1 className="text-5xl flex flex-row justify-evenly items-center hover:text-white">
                    <MdDeliveryDining />
                        <div className=" flex flex-row gap-1 justify-around items-baseline">
                            <div className=" h-4 w-2 opacity-50 rounded-full bg-green-500 "></div>
                            <div className=" h-6 w-2 opacity-50  rounded-full bg-green-500 "></div>
                            <div className=" h-8 w-2 opacity-50  rounded-full bg-green-500 "></div>
                            <div className=" h-6 w-2 opacity-50  rounded-full bg-green-500 "></div>
                            <div className=" h-11 w-2 opacity-80  rounded-full bg-green-500 "></div>
                            <div className=" h-4 w-2 opacity-50  rounded-full bg-green-500 "></div>
                        </div>
                        </h1>

                    </div>
                </div>
                </div>
                <div>
                <div className="grid grid-cols-2 gap-5 p-5 w-full shadow-lg rounded-3xl items-center  pl-5 hover:bg-[#1e2640] hover:text-white" >
                    <div>
                        <div>
                            {data?<h1 className="text-3xl"> {data.totalUsers}</h1>:"Loading"}
                        </div>
                        <div>
                            <h1 className="py-2 text-lg md:text-xl font-semibold" >
                                Total  Users
                            </h1>
                        </div>
                    </div>
                    <div>
                    <h1 className="text-5xl flex flex-row justify-evenly items-center hover:text-white">
                        <LiaUserSecretSolid />
                        <div className=" flex flex-row gap-1 justify-around items-baseline">
                            <div className=" h-4 w-2 opacity-50 rounded-full bg-blue-500 "></div>
                            <div className=" h-6 w-2 opacity-50  rounded-full bg-blue-500 "></div>
                            <div className=" h-12 w-2 opacity-80  rounded-full bg-blue-500 "></div>
                            <div className=" h-8 w-2 opacity-50  rounded-full bg-blue-500 "></div>
                            <div className=" h-10 w-2 opacity-50  rounded-full bg-blue-500 "></div>
                            <div className=" h-6 w-2 opacity-50  rounded-full bg-blue-500 "></div>
                        </div>
                        </h1>

                    </div>
                </div>
                </div>
                <div>
                <div className="grid grid-cols-2 gap-5 p-5 w-full shadow-lg rounded-3xl items-center  pl-5 hover:bg-[#1e2640] hover:text-white" >
                    <div>
                        <div>
                            {data?<h1 className="text-3xl">{data.totalProducts}</h1>:"Loading"}
                        </div>
                        <div>
                            <h1 className="py-2 text-lg md:text-xl font-semibold">
                                Total  Products
                            </h1>
                        </div>
                    </div>
                    <div>
                    <h1 className="text-5xl flex flex-row justify-evenly items-center hover:text-white">
                    <FaSitemap />
                        <div className=" flex flex-row gap-1 justify-around items-baseline">
                            <div className=" h-2 w-1 rounded-full bg-yellow-500 "></div>
                            <div className=" h-4 w-1  rounded-full bg-yellow-500 "></div>
                            <div className=" h-6 w-1  rounded-full bg-yellow-500 "></div>
                            <div className=" h-8 w-1  rounded-full bg-yellow-500 "></div>
                            <div className=" h-10 w-1  rounded-full bg-yellow-500 "></div>
                            <div className=" h-11 w-1  rounded-full bg-yellow-500 "></div>
                        </div>
                        </h1>

                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}