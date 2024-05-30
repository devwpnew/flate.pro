import parseToJsx from "helpers/formatters/parseToJsx";

export default function PostDescription({ description }) {
    return (
        <>
            {description && (
                <div className="mb-5 md:mb-10">
                    <div className="block mb-2.5">
                        <span className="block text-[#4D4D4D]/50 text-sm mb-2">
                            Описание
                        </span>
                        <div className="text-sm leading-6">
                            {parseToJsx(description)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
