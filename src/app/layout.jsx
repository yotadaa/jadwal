'use client'

import './globals.css';
import AppContext from './api/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { decodeToken, getValue, storeValue } from './api/context/functionality';
import { useRouter } from 'next/navigation';
import { generateMetadata } from './components/generateMetadata';
import Master from './components/master';
import TugasBar from './components/tugasBar';
import FriendBar from './components/friendBar';
import JadwalBar from './components/jadwalBar';
import Menu from './components/left-bar';
// import { Metadata } from 'next';



export default function RootLayout({ children }) {

  const [isLogin, setIsLogin] = useState(getValue('login') || false);
  const [users, setUsers] = useState(decodeToken());

  const [user, setUser] = useState(users || {});
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentTugasMenu, setCurrentTugasMenu] = useState(getValue("current-tugas-menu") || -1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(getValue("current-menu") || 0);
  const headRef = useRef(null);
  const [currentLink, setCurrentLink] = useState("/");
  const [rightBar, setRightBar] = useState(<FriendBar />)
  const [leftBar, setLeftBar] = useState(<Menu />)
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState(getValue("current-friend-email") || "");
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

  const [theme, setTheme] = useState(getValue('current-theme'));

  const [currentDay, setCurrentDay] = useState(getValue("current-day") || 0);
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
        console.log(data.success);
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
        console.log(data.success);
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
    console.log(showItemJadwal);
    setCurrentDay(getValue("current-day") || 0);
    setTheme(getValue('current-theme'));
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
    else if (currentMenu === 4) setRightBar(<FriendBar />)
    else if (currentMenu !== 4 || currentMenu !== 3 && window.location.href !== "/login" || window.location.href !== "/daftar") setRightBar(<JadwalBar />)
  }, [])

  useEffect(() => {
    // getJadwal();
    // if (user) {
    //   getTugas(user.email);
    // }
    document.title = "Jadwalku";
    const metaDescriptionTag = document.querySelector('meta[name="description"]');

    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', 'Simple schedule and app management app');
    }
    var linkIcon = document.querySelector('link[rel="icon"]');
    if (linkIcon) linkIcon.setAttribute('href', 'assets/schedule.ico');

    var newMetaTag = document.createElement('meta');
    if (newMetaTag) {
      newMetaTag.name = 'keywords';
      newMetaTag.content = 'schedule, task, schedule management app';
      document.head.appendChild(newMetaTag);
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
