import React, { useEffect, useState } from "react";
import BasicLineChart from "./BasicLineChart";

export default function Graphs() {
  const [productData, setProductData] = useState([]);
  const [hoverProduct,setHoverProdcut] = useState(null)
  const [hover,sethover] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const json = await response.json();
        console.log(json.products);
        setProductData(json.products); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.pageX, y: event.pageY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute grid grid-cols-8 grid-rows-1 gap-4 overflow-x-hidden py-5 ">
      {/* Chart Section */}
      <div className="col-span-6 shadow-xl rounded-2xl">
        <BasicLineChart />
      </div>

      {/* Product List Section */}
      

      <div className="grid grid-flow-row col-span-2 p-4 shadow-2xl rounded-xl grid-cols-1 overflow-y-auto max-h-[550px]">
      <div className=" p-5" style={{position:"sticky"}}>
            <h1 className="text-xl font-semibold underline text-[#]">Most Selled Products</h1>
        </div>
        
        {productData.map((product, index) => (
          <div
            key={product.id}
            className="flex flex-row justify-around items-center shadow-lg p-2 mb-2"
            onMouseEnter={()=>{setHoverProdcut(product); sethover(true); handleMouseMove();}}
            onMouseLeave={()=>{setHoverProdcut(null); sethover(false)}}
          >
            <div>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-16 w-16 rounded-lg"
              />
            </div>
            <div className="font-semibold">{product.title}</div>
            <div className="text-green-500 font-bold">${product.price}</div>

            
          </div>
        ))}
      </div>
      {
                hover?<div className={` absolute rounded-xl  shadow-xl p-5 bg-white w-52`} style={{bottom: mousePosition.y-273, left:mousePosition.x - 383}}>
                <div>
                    <img src={hoverProduct.thumbnail} alt="this is the HoverProduct" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold">Product Title : {hoverProduct.title}</h1>
                    <h2 className={`text-md font-semibold ${hoverProduct.stock>5?"text-green-500": "text-red-500"}`}>Stock : {hoverProduct.stock}</h2>
                    <h2>Price : {hoverProduct.price}</h2>
                </div>
        </div> : null
            }
    </div>
  );
}
