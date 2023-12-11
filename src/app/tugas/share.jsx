import { useContext } from "react";
import AppContext from "../api/context/AppContext";

export default function Share(props) {
    const context = useContext(AppContext);
    const { showShare, setShowShare } = props.component;

    function copyToClipboard() {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = context.user.uniqueId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            console.log('Text successfully copied to clipboard:', context.user.uniqueId);
            // You can also provide user feedback here, such as showing a success message
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
            // Handle errors, such as displaying an error message to the user
        }
    }


    return (
        <div className={`${showShare ? "flex" : "hidden"} fixed w-screen h-screen top-0 left-0 items-center justify-center`}
            style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
            }}
        >
            <div
                className="bg-white mb-20 rounded-lg shadow-xl p-5 flex flex-col items-center justify-between"
                style={{
                    width: 400,
                    height: 200
                }}
            >
                <div className="font-bold">Bagikan kepada temanmu!</div>
                <div className="bg-gray-300 w-full rounded-full text-center py-1">{context.user.uniqueId}</div>
                <div className="flex items-center justify-between w-full px-14">
                    <div
                        className="w-20 py-1 bg-emerald-300 text-center cursor-pointer hover:opacity-80 rounded-sm"
                        onClick={() => {
                            copyToClipboard();
                        }}
                    >
                        Salin
                    </div>
                    <div
                        className="w-20 py-1 bg-emerald-300 text-center cursor-pointer hover:opacity-80 rounded-sm"
                        onClick={() => {
                            setShowShare(false);
                        }}
                    >OK</div>
                </div>
            </div>
        </div>
    )
}