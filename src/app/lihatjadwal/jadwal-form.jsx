import FixedContainer from '../components/fixedContainer';
import { useState, useContext, useEffect } from "react";
import { DownOutlined, CaretRightFilled } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip, TimePicker } from 'antd';
import moment from 'moment';
import AppContext from '../api/context/AppContext';
import ProcessingAnimation from '../components/processing';
import Notification from '../components/notification';


export default function JadwalForm(props) {
    const context = useContext(AppContext)
    const { showJadwalForm, setShowJadwalForm } = props.component;
    const inputStyle = "w-full p-2 px-4 placeholder:text-gray-600 focus:outline-gray-500 focus:bg-gray-50 bg-gray-100 rounded-sm border border-gray-500";
    const inputContainer = "mt-3 flex flex-col";
    const [judul, setJudul] = useState(props.task ? props.task.judul || "" : "");
    const [lokasi, setLokasi] = useState(props.task ? props.task.lokasi || "" : "");
    const [deskripsi, setDeskripsi] = useState(props.task ? props.task.deskripsi || "" : "");
    const [choosenDay, setChoosenDay] = useState(props.task ? props.task.hari || 0 : 0);
    const amulai = props.task ? props.task.mulai || "09 00" : "09 00";
    const aselesai = props.task ? props.task.selesai || "11 00" : "11 00";
    const [startTime, setStartTime] = useState(props.task ? props.task.mulai || "09 00" : "09 00");
    const [endTime, setEndTime] = useState(props.task ? props.task.selesai || "09 00" : "09 00");
    const [choosenRepeat, setChoosenRepeat] = useState(0);

    useEffect(() => {
        if (props.task) {
            if (Object.keys(props.task).length > 0) {
                setJudul(props.task.judul || "");
                setDeskripsi(props.task.deskripsi || "");
                setLokasi(props.task.lokasi || "");
                setChoosenDay(props.task.hari || 0);
                const am = props.task ? props.task.mulai || "09 00" : "09 00";
                const as = props.task ? props.task.selesai || "11 00" : "11 00";
                setStartTime(am.split(" ").join(":"));
                setEndTime(as.split(" ").join(":"));
            }
        }
    }, [props.task]);

    const getJadwal = async () => {
        try {
            context.setShowProcessing(true);
            const res = await fetch("../api/mongos/jadwals", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    todo: "get",
                }),
            });

            const data = await res.json();
            if (data.success) {
                context.setJadwal(data.data);
                console.log(data.success);
            } else {
                console.error("Error fetching jadwal:", data.error);
            }
        } catch (err) {
            console.error("Error fetching jadwal:", err);
        } finally {
            context.setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
        }
    };


    const submitForm = async () => {
        try {
            context.setShowProcessing(true);
            const res = await fetch("../api/mongos/jadwals", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: props.task ? props.task.id : "",
                    judul: judul,
                    deskripsi: deskripsi,
                    hari: choosenDay,
                    mulai: startTime.split(":").join(" "),
                    selesai: endTime.split(":").join(" "),
                    lokasi: lokasi,
                    email: context.user.email,
                    todo: props.task ? "update" : "add",
                }),
            });

            const data = await res.json();
            if (data.success) {
                context.insertNotif("Berhasil menambah jadwal!", false);
                context.getJadwal();
                setJudul("");
                setDeskripsi("")
                setChoosenDay(0)
                setLokasi("")
                setShowJadwalForm(false);
                getJadwal();
            } else {
                console.error("Error fetching jadwal:", data.err);
                context.insertNotif("Gagal...", data.err);
            }
        } catch (err) {
            console.error("Error fetching jadwal:", err);
        } finally {
            context.setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
        }
    }

    const handleRepeatClick = (e) => {
        setChoosenRepeat(e.key - 1);
    }

    const handleMenuClick = (e) => {
        setChoosenDay(e.key - 1);
    };
    const daftarRepeat = [
        "None", "Harian", "Mingguan"
    ]
    const daftarHari = [
        "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
    ]
    const items = [
        {
            label: 'Senin',
            key: 1,
            icon: <CaretRightFilled />,
        },
        {
            label: 'Selasa',
            key: 2,
            icon: <CaretRightFilled />,
        },
        {
            label: 'Rabu',
            key: 3,
            icon: <CaretRightFilled />,
        },
        {
            label: 'Kamis',
            key: 4,
            icon: <CaretRightFilled />,
        },
        {
            label: 'Jumat',
            key: 5,
            icon: <CaretRightFilled />,
        },
        {
            label: 'Sabtu',
            key: 6,
            icon: <CaretRightFilled />,
        },
        {
            label: 'Minggu',
            key: 7,
            icon: <CaretRightFilled />,
        },
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    useEffect(() => {
        console.log(startTime, endTime)
    }, [startTime, endTime])

    return (
        <FixedContainer
            style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                display: showJadwalForm ? "flex" : "none",
            }}
        >
            <div
                className="bg-white rounded-xl relative shadow-2xl mb-20"
                style={{
                    width: 490,
                    // height: 300,
                }}
            >
                <div className=" rounded-t-xl w-full h-9 flex items-center justify-between pr-1 pl-3">
                    <div className="font-bold text-lg flex items-center gap-2" >
                        <img
                            src='assets/calendar-month.png'
                            width={20}
                            onClick={() => {
                                setShowJadwalForm(false);
                            }}
                            className="hover:opacity-80 cursor-pointer"
                        />
                        <div>Buat Jadwal</div>
                    </div>
                    <img
                        src='assets/close.png'
                        width={30}
                        onClick={() => {
                            setShowJadwalForm(false);
                            setJudul("")
                            setDeskripsi("")
                            setLokasi("")
                            setChoosenDay(0)
                        }}
                        className="hover:opacity-80 cursor-pointer"
                    />
                </div>
                <div className='p-5'>
                    <div className={inputContainer}>
                        <label htmlFor="judul" className={`ml-3 ${judul.length > 0 ? "block" : "hidden"}`}>
                            Judul Tugas
                        </label>
                        <input
                            id="judul"
                            type="text"
                            placeholder="Judul tugas"
                            className={inputStyle}
                            value={judul}
                            onChange={(ev) => {
                                const inputValue = ev.target.value.substring(0, 50);
                                setJudul(inputValue);
                            }}
                        />
                    </div>
                    <div className='flex gap-1 mb-3'>
                        <div className={`flex flex-row gap-4 mt-3 ml-5 items-center`}>
                            <div>Hari</div>
                            <div>
                                <Dropdown menu={menuProps}>
                                    <Button>
                                        <Space>
                                            {daftarHari[choosenDay]}
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        <div className={`flex flex-row gap-4 mt-3 ml-5 items-center`}>
                            <div>Waktu</div>
                            <div>
                                <TimePicker.RangePicker
                                    format="HH:mm"
                                    onChange={(time, timeString) => {
                                        setStartTime(timeString[0])
                                        setEndTime(timeString[1])
                                    }}
                                // value={[startTime, endTime]}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className={`flex flex-row gap-4 mt-3 ml-5 items-center`}>
                        <div>Repeat</div>
                        <div>
                            <div>
                                <Dropdown menu={repeatProps}>
                                    <Button>
                                        <Space>
                                            {daftarHari[choosenDay]}
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    </div> */}
                    <div className={inputContainer + "mt-3"}>
                        <label htmlFor="lokasi" className={`mt-3 ml-3 ${lokasi.length > 0 ? "block" : "hidden"}`}>
                            Lokasi
                        </label>
                        <input
                            id="lokasi"
                            type="text"
                            placeholder="Lokasi"
                            className={inputStyle}
                            value={lokasi}
                            onChange={(ev) => {
                                const inputValue = ev.target.value.substring(0, 50);
                                setLokasi(inputValue);
                            }}
                        />
                    </div>
                    <div className={inputContainer}>
                        <label htmlFor="deskripsi" className={`ml-3 ${deskripsi.length > 0 ? "block" : "hidden"}`}>
                            Deskripsi Tugas
                        </label>
                        <textarea
                            id="deskripsi"
                            placeholder="Deskripsi tugas"
                            className={inputStyle + "rounded-2xl max-h-32 border border-gray-500"}
                            value={deskripsi}
                            onChange={(ev) => {
                                const inputValue = ev.target.value.substring(0, 300);
                                setDeskripsi(inputValue);
                            }}
                        />
                    </div>
                    <div className="w-full mt-5 flex items-center justify-end px-1">
                        <div type="submit" className="text-base cursor-pointer px-8 rounded-full font-bold text-white py-2 bg-blue-400 hover:opacity-80" value={`Buat!`}
                            onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                if (judul.length === 0 || deskripsi.length === 0 || lokasi.length === 0) {
                                    context.insertNotif("Tolong isi semua field", true);
                                } else {
                                    submitForm();
                                }
                            }}
                        >
                            {props.task ? "UBAH!" : "BUAT!"}
                        </div >
                    </div>
                </div>
            </div>
            <div className={`${context.showProcessing ? "block" : 'hidden'}`}>
                <ProcessingAnimation />
            </div>
            <div className={`${context.notif.length > 0 ? "block" : "hidden"}`}>
                {context.notif.map((item, index) => {
                    return (
                        <Notification message={item.message} danger={item.danger} key={index} />
                    )
                })}
            </div>
        </FixedContainer>
    )
}