export default function ProcessingAnimation() {
    return (
        <div className={`fixed flex select-none items-start justify-center w-screen h-screen top-0 left-0`}
            style={{
                backgroundColor: 'rgba(0,0,0,0.2)',//'transparent',
                // pointerEvents: 'none'
            }}
        >
            <div className="loading-dialog bg-emerald-300 flex items-center justify-start rounded-lg px-3 gap-4 mt-6 shadow-xl"
                style={{
                    width: 300,
                    height: 40
                }}
            >
                <img
                    alt='loading'
                    src='assets/loading.png'
                    width={25}
                    className="loading"
                />
                <div className="text-black text-sm font-bold">Mohon tunggu ya..</div>
            </div>
        </div>
    )
}