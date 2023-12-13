import { useRouter } from "next/navigation";
import { useContext, useState } from "react"
import AppContext from "../api/context/AppContext";


export default function Search() {
    const [isHover, setIsHover] = useState(false);
    const router = useRouter();
    const context = useContext(AppContext);

    return (
        <div className="w-full p-2 bg-white shadow-lg rounded-md ">
            <div
                className="flex justify-between gap-2 items-center "
            >
                <p className="ml-2 text-gray-500 font-sans">
                    Cari...
                </p>
                <div className={`${isHover ? "hover-round" : ""} `}>
                    <img
                        src="assets/search.png"
                        width="25"
                        className="p-2 w-10 cursor-pointer rounded-full"
                        onClick={() => {
                            router.push("/cari");
                            context.setCurrentMenu(-1);
                        }}
                        onMouseEnter={() => {
                            setIsHover(true)
                        }}
                        onMouseLeave={() => {
                            setIsHover(false)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}