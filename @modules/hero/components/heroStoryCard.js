import React from 'react';
import Link from "next/link";
import HeroStoryLinks from "@modules/hero/components/heroStoryLinks";

function MenuCard({ img, title, links }) {
    return (
        <div>
            <div className="min-w-[290px] border border-[#ECF2F8] hover:bg-[#ECF2F8] transition duration-300 p-[10px] rounded-full flex gap-3 items-center cursor-pointer">
                <img
                    src={img}
                    className="w-[68px] aspect-[1/1]"
                />
                <div>
                    {title}
                    <HeroStoryLinks links={links} />
                </div>
            </div>
        </div>
    );
}

export default MenuCard;