import Graphs from "../components/Graphs";
import ReportCard from "../components/reportCard";
import SideBar from "../components/SideBar";
import TopNav from "../components/ToNav";

export default function GridLayout(){
    return(
        <div>
            <div className="grid  grid-cols-1 md:grid-cols-12 grid-rows-10 md:grid-rows-3  overflow-x-hidden h-full">
                <div className="absolute md:relative col-span-2 row-span-3 " style={{zIndex:99}}>
                    <SideBar />
                </div>
                <div className=" md:col-span-10 row-span-10  p-5">
                    <TopNav />
                    <ReportCard />
                    <Graphs />
                </div>
                <div className=" md:col-span-10  ">
                
                </div>
            </div>
        </div>
    )
}