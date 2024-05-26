import React from 'react';
import Link from "next/link";

function MenuCard({ link, title, backgroundImage, className }) {
    return (
        <Link href={link}>
            <div 
                className={`
                    ${className}
                    rounded-tl-[0px] md:rounded-tl-[20px] rounded-[20px] 
                    overflow-hidden bg-cover bg-center cursor-pointer relative
                `}
            >
                <p className="
                    pt-[10px] pl-[10px] text-[14px]
                    md:pt-[15px] md:pl-[20px] md:text-base
                    z-20 absolute font-medium
                ">{title}</p>

                <img
                    src={backgroundImage}
                    className="w-full h-full object-cover absolute top-0 left-0 z-10 hover:scale-105 transition-all duration-300 ease-in-out" 
                />

            </div>
        </Link>
    );
}

export default MenuCard;