// 'Page.js' on the client side
'use client'
import { useEffect, useContext, useState, useRef } from 'react';
import AppContext from './api/context/AppContext';
import JadwalBar from './components/jadwalBar';
import ProcessingAnimation from './components/processing';
import { decodeToken, getValue, getWaktu } from './api/context/functionality';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Menu from './components/left-bar';
import JadwalForm from './lihatjadwal/jadwal-form';
export default function Page() {

  const user = decodeToken();
  const router = useRouter();

  const context = useContext(AppContext);
  const [showProcessing, setShowProcessing] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [forEdit, setForEdit] = useState({});
  const [initialShow, setInitialShow] = useState(false);
  const [countForCurrentDay, setCountForCurrentDay] = useState(0);
  const styling = "flex items-center gap-3";
  const [isInit, setIsInit] = useState(true);
  const [idDay, setIdDay] = useState(Array.from({ length: 24 }, (_, index) => index));
  const [displayImport, setDisplayImport] = useState(-1);
  const [showJadwalForm, setShowJadwalForm] = useState(false);

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


  useEffect(() => {
    getJadwal();
  }, [])

  const cancelAllDialog = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const isClickInsideDialog = ev.target.closest('.dialog-item'); // Replace 'your-dialog-class' with the actual class of your dialog

    if (!isClickInsideDialog) {
      setCurrentItem({});
    }
  }

  const daftarHari = [
    "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
  ]


  useEffect(() => {
    for (var i = 0; i < context.refDay.length; i++) {
      if (context.refDay[i].current) {
        context.refDay[i].current.style.display = "none"
      }
    }
    // context.setFriendEmail(context.user.email);
    context.setLeftBar(<Menu />)
    context.setRightBar(<JadwalBar />)

    context.setCurrentMenu(0);

    // document.addEventListener("click", cancelAllDialog);

    // return () => document.removeEventListener("click", cancelAllDialog);

  }, []);

  useEffect(() => {
    console.log(currentItem);
    console.log(Object.keys(currentItem).length);
  }, [currentItem])

  useEffect(() => {
    setCountForCurrentDay(context.jadwal ? context.jadwal.filter((item) => item.hari === context.currentDay).length : 0)
    console.log(countForCurrentDay);
  }, [context.jadwal, context.currentDay])

  const updateFav = async (id) => {
    try {
      context.setShowProcessing(true);
      const res = await fetch("../api/mongos/jadwals", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          favorite: forEdit.favorite,
          todo: "favorite",
        }),
      });
      const data = await res.json();
      if (data.success) {
        getJadwal();
      } else {
        console.error("Error fetching jadwal:", data.err);
      }
    } catch (err) {
      console.error(err)
    } finally {
      context.setShowProcessing(true)
    }
  }

  const removeItem = async (id) => {
    try {
      context.setShowProcessing(true);
      const res = await fetch("../api/mongos/jadwals", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          todo: "delete",
        }),
      });

      const data = await res.json();
      if (data.success) {
        getJadwal();
        setCountForCurrentDay(context.jadwal ? context.jadwal.filter((item) => item.hari === context.currentDay).length : 0)
        for (var i = 0; i < context.refDay.length; i++) {
          if (context.refDay[i].current) {
            if (context.refDay[i].current.childElementCount === 1) {
              context.refDay[i].current.style.display = "none";
            }
          }
        }
      } else {
        console.error("Error fetching jadwal:", data.error);
      }
    } catch (err) {
      console.error("Error fetching jadwal:", err);
    } finally {
      context.setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
    }
  }


  if (context.isLogin) return (
    <>
      <div
      >
        <div>
          <div className='flex flex-col items-center justify-center p-5 pl-3 pt-0 pb-0 ml-2'>
            <div className='p-3 rounded-xl font-extrabold flex justify-start items-center w-full bg-white m-5 mb-1 shadow-xl'>
              Kamu {countForCurrentDay > 0 ? ` punya ${countForCurrentDay} ` : "tidak punya "} jadwal pada <span className='text-teal-600'> &nbsp; {" " + daftarHari[context.currentDay]}</span>
            </div>
          </div >
          <div className='flex flex-col items-center justify-center p-5'>
            {idDay.map((clock, indexes) => {
              return (
                <div key={indexes} className="w-full flex-col mt-2" ref={context.refDay[indexes]}
                  style={{
                    display: "none",
                  }}
                  onClick={() => {
                    console.log("the child count: ", context.refDay[indexes].current.childElementCount)
                    if (context.refDay[indexes].current) {
                      if (context.refDay[indexes].current.classList.contains("shown")) {
                        context.refDay[indexes].current.classList.remove("shown");
                      } else {
                        context.refDay[indexes].current.classList.add("shown");
                      }
                      console.log(context.refDay[indexes].current.classList);
                    }
                  }}
                >
                  <div className={`dialog-item flex items-center justify-start bg-white w-full rounded-lg shadow-xl mb-2 hover:opacity-80 cursor-pointer select-none p-2`}
                    onClick={(ev) => {
                      context.setShowItemJadwal((prevShowItemJadwal) => {
                        const updatedShowItemJadwal = prevShowItemJadwal.map((item, i) => {
                          if (i === indexes) {
                            return { ...item, shown: !item.shown };
                          }
                          return item;
                        });

                        return updatedShowItemJadwal;
                      });
                    }}
                  >
                    mulai dari jam {clock > 9 ? "" : "0"}{clock}:00
                  </div>
                  {context.jadwal && context.jadwal.map((item, index) => {
                    const det = clock > 9 ? "" + clock : "0" + clock;
                    if (item.hari === context.currentDay) {
                      if (getWaktu(item.mulai)[0] === det) {
                        if (context.refDay[index].current) context.refDay[indexes].current.style.display = "flex"
                        return (
                          <div
                            className={`${context.showItemJadwal[indexes].shown ? "flex" : "hidden"} items-center justify-between gap-2`}
                            key={index}
                            onMouseEnter={() => {
                              setDisplayImport(index);
                              setForEdit(item);
                              console.log(context.currentTugasMenu, displayImport)
                            }}
                            onMouseLeave={() => {
                              setDisplayImport(-1);
                            }}
                          >
                            <div
                              key={index}
                              className={`dialog-item items-center justify-start bg-emerald-100 w-full h-11 rounded-lg shadow-xl mb-2 hover:opacity-80 cursor-pointer select-none flex`}
                              onClick={(ev) => {
                                // ev.preventDefault();
                                ev.stopPropagation();
                                setCurrentItem(item);
                                setIsInit(false);
                              }}
                            >
                              <div className="p-2 flex justify-center items-center w-20 h-11 shadow-md bg-emerald-300 rounded-l-lg overflow-hidden">
                                <div>{getWaktu(item.mulai)[0]} : {getWaktu(item.mulai)[1]}</div>
                              </div>
                              <div className="p-2 w-20 h-11 flex justify-center items-center bg-emerald-200 shadow-md overflow-hidden">
                                <div>{getWaktu(item.selesai)[0]} : {getWaktu(item.selesai)[1]}</div>
                              </div>
                              <div
                                className={`p-2 h-11 ${displayImport === index ? "w-44" : "w-72"} font-bold overflow-hidden`}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                <div className={`w-72 animate-text ${displayImport === index ? 'animate-right-to-left' : ''}`}>
                                  {item.judul}
                                </div>
                              </div>
                            </div>

                            <div className={`${displayImport === index ? "block" : "hidden"} shadow-xl rounded-full cursor-pointer hover:opacity-80 select-none bg-white p-1`}
                              onDoubleClick={() => {
                                setShowJadwalForm(true)
                              }}
                              onClick={() => {
                                setForEdit(item);
                              }}
                            >
                              <img
                                src='assets/pencil.png'
                                width={30}
                                className='p-1'
                              />
                            </div>

                            <div className={`${displayImport === index ? "block" : "hidden"} shadow-xl rounded-full cursor-pointer hover:opacity-80 select-none`}
                              onDoubleClick={() => {
                                removeItem(item.id)
                              }}
                            >
                              <img
                                src='assets/trash.png'
                                width={30}
                                className='shadow-xl'
                              />
                            </div>
                            <div className={`${displayImport === index ? "block" : "hidden"} rounded-full cursor-pointer hover:opacity-80 select-none`}
                              onDoubleClick={() => {
                                updateFav(item.id);
                              }}
                            >
                              <img
                                src={`assets/${item.favorite ? 'star' : 'paporit'}.png`}
                                width={35}
                                className=''
                              />
                            </div>
                          </div>
                        )
                      }
                    }
                  })}
                </div>
              )
            })}
          </div>
          <div className='flex flex-col items-center justify-center p-5'>
          </div>
          <div className={`${Object.keys(currentItem).length > 0 ? "flex" : (!isInit) ? "animate-down-s hidden" : "hidden"} container-popup fixed bottom-0`}
            style={{
              width: 500,
              height: 250
            }}
          >

            <div
              className={`popup-dialog custom-scrollbar bg-gray-50 rounded-t-3xl flex flex-col`}
              style={{
                height: 500
              }}
            >
              <div
                className={`${Object.keys(currentItem).length > 0 ? "opacity-100" : "opacity-0"}`}
              >
                <img
                  src='assets/close.png'
                  width={25}
                  className='absolute select-none cursor-pointer hover:opacity-80 top-2 right-2'

                  onClick={() => {
                    setCurrentItem({})
                  }}
                />
                <div className='flex items-center justify-center mt-6 font-extrabold text-xl text-center p-2'>{currentItem.judul}</div>
                <div
                  className='p-5 '
                >
                  <div className={`p-2 mt-3`}>
                    <div className={`font-bold text-xl ` + styling}><img src="assets/cal.png" width={20} />{daftarHari[currentItem.hari]}</div>
                  </div>

                  <div className='hover:scale-105 cursor-pointer font-bold text-xl py-1 px-2 rounded-full bg-red-400 flex justify-between'>
                    <div className={styling}><img src="assets/clock.png" width={20} /> Waktu</div>
                    <div>{getWaktu(currentItem.mulai || "")[0]}:{getWaktu(currentItem.mulai || "")[1]} - {getWaktu(currentItem.selesai || "")[0]}:{getWaktu(currentItem.selesai || "")[1]}</div>
                  </div>

                  <div className={`p-2`}>
                    <div className={`font-bold text-xl ` + styling}><img src="assets/loc.png" width={20} />Lokasi</div>
                    <div className='text-base'>{currentItem.lokasi}</div>
                  </div>

                  <div className={`p-2`}>
                    <div className={`font-bold text-xl ` + styling}><img src="assets/description.png" width={20} />Deskripsi</div>
                    <div className='text-base'>{currentItem.deskripsi}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${context.showProcessing ? "block" : 'hidden'}`}>
            <ProcessingAnimation />
          </div>
        </div>
      </div>
      <JadwalForm component={{ showJadwalForm, setShowJadwalForm, }} edit={true} task={forEdit} />
    </>
  );
  else {
    return (
      <div className='flex flex-col justify-center items-center'>
        <div>Cant visit this page</div>
        <div>You must login/register first</div>

      </div>
    )
  }
}
