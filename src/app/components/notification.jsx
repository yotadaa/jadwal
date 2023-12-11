export default function Notification(props) {
    const { message, danger } = props;
    return (
        <div className={`fixed flex select-none items-start justify-center w-screen h-screen top-0 left-0`}
            style={{
                backgroundColor: 'transparent',
                pointerEvents: 'none'
            }}
        >
            <div className={`notif-dialog ${danger ? "bg-red-400" : "bg-emerald-300"} flex items-center justify-start rounded-lg px-3 gap-4 mt-6 shadow-xl`}
                style={{
                    width: 300,
                    height: 40
                }}
            >
                <div className="text-black text-sm font-bold">{message}</div>
            </div>
        </div>
    )
}