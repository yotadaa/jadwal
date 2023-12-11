import { useContext, useEffect, useState } from "react";
import FixedContainer from "../components/fixedContainer";
import dayjs from "dayjs";
// import customParseFormat from 'dayjs/plugin/customParseFormat';

import { DatePicker, Button, Flex } from "antd";
import AppContext from "../api/context/AppContext";
import ProcessingAnimation from "../components/processing";
import Notification from "../components/notification";
// dayjs.extend(customParseFormat);
import 'dayjs/locale/id'; // Import the Indonesian locale

dayjs.locale('id'); // Set the locale to Indonesian


export default function TaskAdd(props) {

    const context = useContext(AppContext);
    const { showTaskAdd, setShowTaskAdd } = props.component;
    const inputStyle = "w-full p-2 px-4 placeholder:text-gray-600 focus:outline-gray-500 focus:bg-gray-50 bg-gray-100 rounded-sm border border-gray-500";
    const inputContainer = "mt-3 flex flex-col"
    const [judul, setJudul] = useState(props.task ? props.task.judul || "" : "");
    const [deskripsi, setDeskripsi] = useState(props.task ? props.task.deskripsi || "" : "");
    const [date, setDate] = useState(props.task ? new Date(props.task.deadline * 1000) || null : null);
    // const [time, setTime] = useState(0);
    const format = 'HH:mm';
    const [selectedDate, setSelectedDate] = useState(props.task ? new Date(props.task.deadline * 1000) : new Date());


    useEffect(() => {
        if (props.task) {
            if (Object.keys(props.task).length > 0) {
                setJudul(props.task.judul || "");
                setDeskripsi(props.task.deskripsi || "");
            }
        }
    }, [props.task]);

    useEffect(() => {
        if (props.task) {
            console.log(props.task.deadline)
            console.log(new Date(props.task.deadline * 1000));
            setDate(props.task ? new Date(props.task.deadline * 1000) : null);
            console.log(dayjs(date))
        }
    }, [showTaskAdd]);




    const onChange = (time, timeString) => {
        if (dayjs.isDayjs(time)) {
            const dateObject = time.toDate(); // Convert dayjs to JavaScript Date
            setDate(dateObject);
        }
    };

    // useEffect(() => console.log(date), [date])

    const onOk = (value) => {
        // console.log('onOk: ', value);
        console.log(typeof time);
        setDate(time.toDate());
    };
    const submitForm = async () => {
        try {
            context.setShowProcessing(true);
            const res = await fetch("../api/mongos/tugas", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    judul: judul,
                    deskripsi: deskripsi,
                    deadline: Math.floor(date.getTime() / 1000),
                    id: props.task ? props.task.id : "",
                    todo: props.task ? "update" : "add",
                }),
            });

            const data = await res.json();
            if (data.success) {
                context.insertNotif("Berhasil menambah tugas!", false);
                context.getTugas(context.user.email);
                setJudul("")
                setDeskripsi("")
                // setDate(new Date())
                setSelectedDate(null);
                setShowTaskAdd(false);
            } else {
                console.error("Error fetching jadwal:", data.error);
                context.insertNotif("Gagal...", true);
            }
        } catch (err) {
            console.error("Error fetching jadwal:", err);
        } finally {
            context.setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
        }
    }

    useEffect(() => {
        if (selectedDate) {
            console.log("The date : ", selectedDate)
        } else console.log("Cant see the date")
    }, [selectedDate])


    return (
        <FixedContainer
            style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                display: showTaskAdd ? "flex" : "none",
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
                    <div className="font-bold text-sm flex items-center gap-2" >
                        <img
                            src='assets/calendar-week.png'
                            width={20}
                            onClick={() => {
                                setShowJadwalForm(false);
                            }}
                            className="hover:opacity-80 cursor-pointer"
                        />
                        <div>Buat Tugas</div>
                    </div>
                    <img
                        src='assets/close.png'
                        width={30}
                        onClick={() => {
                            setShowTaskAdd(false);
                            setJudul("")
                            setDeskripsi("")
                            setDate(new Date())
                        }}
                        className="hover:opacity-80 cursor-pointer"
                    />
                </div>
                <form
                    className="p-5"
                >
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
                                setJudul(ev.target.value);
                            }}
                        />
                    </div>
                    <div className={inputContainer + "flex flex-row gap-2 w-full items-center px-3"} >
                        <div>Deadline</div>
                        <DatePicker
                            className={inputStyle + "w-full border-gray-500 border bg-gray-50"}
                            showTime={{
                                format: 'HH:mm',
                            }}
                            format="DD-MM-YYYY HH:mm"
                            value={(date) ? dayjs(date) : null}
                            onChange={onChange}

                        />
                    </div>
                    <p className="font-bold text-xs ml-20 text-red-500">*Enter setelah memilih tanggal</p>
                    <div className={inputContainer}>
                        <label htmlFor="judul" className={`ml-3 ${deskripsi.length > 0 ? "block" : "hidden"}`}>
                            Deskripsi Tugas
                        </label>
                        <textarea
                            placeholder="Deskripsi tugas"
                            className={inputStyle + "rounded-2xl max-h-32 border border-gray-500"}
                            value={deskripsi}
                            onChange={(ev) => {
                                setDeskripsi(ev.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full mt-5 flex items-center justify-end px-1">
                        <div type="submit" className="text-lg cursor-pointer px-8 rounded-full font-bold text-white py-2 bg-blue-500 hover:opacity-80" value={`Buat!`}
                            onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                if (judul.length === 0 || deskripsi.length === 0 || selectedDate === null) {
                                    context.insertNotif("Tolong isi semua field", true);
                                } else {
                                    submitForm();
                                }
                            }}
                        >
                            {props.task ? "UBAH!" : "BUAT!"}
                        </div >
                    </div>
                </form>
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