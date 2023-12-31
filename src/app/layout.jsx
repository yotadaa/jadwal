'use client'

import './globals.css';
import AppContext from './api/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { decodeToken, getValue, storeValue } from './api/context/functionality';
import { useRouter } from 'next/navigation';
import { generateMetadata } from './components/generateMetadata';
import Master from './components/master.jsx';
import TugasBar from './components/tugasBar';
import FriendBar from './components/friendBar';
import JadwalBar from './components/jadwalBar';
import Menu from './components/left-bar';
import Search from './components/search';
// import { Metadata } from 'next';



export default function RootLayout({ children }) {

  const [isLogin, setIsLogin] = useState(false);
  const [users, setUsers] = useState(decodeToken());

  const [user, setUser] = useState(users || {});
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentTugasMenu, setCurrentTugasMenu] = useState(-1);
  useEffect(() => setCurrentTugasMenu(getValue("current-tugas-menu")), []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(0);
  const headRef = useRef(null);
  const [currentLink, setCurrentLink] = useState("/");
  const [rightBar, setRightBar] = useState(<div className="p-3"><Search /></div>)
  const [leftBar, setLeftBar] = useState(<Menu />)
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  useEffect(() => setFriendEmail(getValue("current-friend-email")), []);
  const refDay = Array.from({ length: 24 }, () => useRef(null));
  const daftarHari = [
    "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
  ]
  const [showItemJadwal, setShowItemJadwal] = useState(Array.from({ length: 24 }, () => {
    return { shown: true }
  }));
  const [countFavorite, setCountFavorite] = useState(0);
  const [showCari, setShowCari] = useState(true);

  const menuItem = [
    { name: "LIHAT JADWAL", href: "assets/calendar.png", target: "/" },
    { name: "JADWAL FAVORITE", href: "assets/star.png", target: "/jadwalfavorite" },
    { name: "JADWAL KOSONG", href: "assets/schedule.png", target: "/jadwalkosong" },
    { name: "TUGAS", href: "assets/tasks.png", target: "/tugas" },
    { name: "AKUN", href: "assets/user (1).png", target: "/akun" },
  ];

  const [friendList, setFriendList] = useState([]);

  const insertFriends = (name, id) => {
    setFriendList((prevFriend) => [...prevFriend, {
      name: name,
      id: id
    }])
  }

  const removeFriendsDuplicates = () => {
    // Use a Set to keep track of unique IDs
    const uniqueIds = new Set();

    // Filter the list to keep only the items with unique IDs
    const uniqueList = friendList.filter((friend) => {
      if (!uniqueIds.has(friend.id)) {
        uniqueIds.add(friend.id);
        return true;
      }
      return false;
    });

    setFriendList(uniqueList);
  };

  const initialFriends = async () => {
    try {
      const res = await fetch("../api/mongos/tugas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          todo: "get-friends"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFriendList(data.list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const profilePicture = [
    { name: "male1", href: "assets/male1.png" },
    { name: "male2", href: "assets/male2.png" },
    { name: "male3", href: "assets/male3.png" },
    { name: "male4", href: "assets/male4.png" },
    { name: "female1", href: "assets/female1.png" },
    { name: "female2", href: "assets/female2.png" },
    { name: "female3", href: "assets/female3.png" },
    { name: "female4", href: "assets/female4.png" },
  ]

  const [theme, setTheme] = useState(true);

  const [currentDay, setCurrentDay] = useState(0);
  useEffect(() => {
    setTheme(getValue('current-theme'));
    setCurrentDay(getValue("current-day"))
  }, [])
  const [jadwal, setJadwal] = useState([]);
  const [tugas, setTugas] = useState([]);
  const router = useRouter();
  const [showProcessing, setShowProcessing] = useState(false);
  const [notif, setNotif] = useState([]);
  const [paddingTugas, setPaddingTugas] = useState(50);

  const insertNotif = (message, danger) => {
    setNotif((prevNotif) => [...prevNotif, {
      message: message,
      danger: danger
    }]);
  };

  const relog = async () => {
    try {
      const res = await fetch("../api/mongos/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          todo: "relog"
        }),
      });

      const data = await res.json()
      if (data.success) {
        storeValue('login', data.success);
        storeValue('login-token', data.token);
        setUser(decodeToken());
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getJadwal = async () => {
    try {
      const res = await fetch("../api/mongos/jadwals", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          todo: "get",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setJadwal(data.data);
        // console.log(data.success);
      } else {
        console.error("Error fetching jadwal:", data.error);
      }
    } catch (err) {
      console.error("Error fetching jadwal:", err);
    } finally {
    }
  };
  const getTugas = async (email) => {
    try {
      setIsProcessing(true);
      const res = await fetch("../api/mongos/tugas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          todo: "get",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTugas(data.data);
        // console.log(data.success);
      } else {
        console.error("Error fetching jadwal:", data.error);
      }
    } catch (err) {
      console.error("Error fetching jadwal:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setIsLogin(getValue('login'));
    setCurrentMenu(getValue("current-menu"))
  }, [])

  useEffect(() => {
    // console.log(showItemJadwal);
    setCurrentDay(getValue("current-day") || 0);
    // setTheme(getValue('current-theme'));
    setIsLogin(getValue("login") || false);
    setWindowWidth(window.innerWidth);
    getJadwal();
    if (user) {
      initialFriends();
      getTugas(user.email);
    }
    // if (!isLogin && !user) {
    //   router.push('/login');
    // }
  }, [])

  // useEffect(() => {
  //   removeFriendsDuplicates();
  // }, [user])

  const contextValue = {
    users, theme, setTheme, menuItem, friendList, profilePicture, user, setUser,
    currentDay, setCurrentDay, jadwal, setJadwal, windowWidth, setWindowWidth, tugas, setTugas,
    relog, insertFriends, removeFriendsDuplicates, setFriendList, initialFriends, currentTugasMenu, setCurrentTugasMenu,
    getTugas, isProcessing, setIsProcessing, currentMenu, setCurrentMenu, isLogin, currentLink, setCurrentLink, setShowProcessing, showProcessing, notif, insertNotif, setNotif, paddingTugas, setPaddingTugas,
    rightBar, setRightBar, setUsers, setIsLogin, leftBar, setLeftBar, friendName, setFriendName, daftarHari,
    friendEmail, setFriendEmail, getJadwal, refDay, setShowItemJadwal, showItemJadwal, countFavorite, setCountFavorite,
    showCari, setShowCari
  }

  useEffect(() => {
    if (currentMenu === 3) setRightBar(<TugasBar />)
    else if (currentMenu === 4) setRightBar(<div className="p-3"><Search /></div>)
    else if (currentMenu !== 4 || currentMenu !== 3 && window.location.href !== "/login" || window.location.href !== "/daftar") setRightBar(<JadwalBar />)
  }, [])

  useEffect(() => {
    document.title = "Jadwalku";
    var linkIcon = document.querySelector('link[rel="icon"]');
    if (linkIcon) linkIcon.setAttribute('href', 'assets/schedule.ico');

    const metaDescriptionTag = document.createElement('meta');
    if (metaDescriptionTag) {
      metaDescriptionTag.name = 'description';
      metaDescriptionTag.content = 'Aplikasi manajemen tugas dan jadwal sederhana. Aplikasi untuk mengolah tugas dan jadwal simpelmu';
      document.head.appendChild(metaDescriptionTag);
    }


    var newMetaTag = document.createElement('meta');
    if (newMetaTag) {
      newMetaTag.name = 'keywords';
      newMetaTag.content = 'schedule, task, schedule management app';
      document.head.appendChild(newMetaTag);
    }

    var authorMetaTag = document.createElement('meta');
    if (authorMetaTag) {
      authorMetaTag.name = 'author';
      authorMetaTag.content = 'Mukhtada Nasution';
      document.head.appendChild(authorMetaTag);
    }
    var viewportMetaTag = document.createElement('meta');
    if (viewportMetaTag) {
      viewportMetaTag.name = 'viewport';
      viewportMetaTag.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewportMetaTag);
    }

    var languageMetaTag = document.createElement('meta');
    if (languageMetaTag) {
      languageMetaTag.httpEquiv = 'Content-Language';
      languageMetaTag.content = 'id-ID'; // Replace with your language code
      document.head.appendChild(languageMetaTag);
    }

    var robotsMetaTag = document.createElement('meta');
    if (robotsMetaTag) {
      robotsMetaTag.name = 'robots';
      robotsMetaTag.content = 'index, follow'; // Adjust as needed
      document.head.appendChild(robotsMetaTag);
    }



  }, []);

  return (
    <html lang="en">
      <Head>
        {/* <title>Jadwalku</title>
        <link
          rel="icon"
          href="assets/schedule.ico<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <meta name="description" content="A Simple schedule and task management app" /> */}
        {headRef.current}
      </Head>
      <body>
        <AppContext.Provider value={contextValue}>
          <Master>
            {children}
          </Master >
        </AppContext.Provider>
      </body>
    </html>
  )
}
