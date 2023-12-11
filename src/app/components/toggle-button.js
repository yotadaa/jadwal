// import { useEffect, useContext } from 'react';
// import './styles/toggle-theme.css'
// import { storeValue } from '../api/context/functionality';
// import AppContext from '../api/context/AppContext';

// export default function ToggleTheme() {

//     const context = useContext(AppContext);

//     useEffect(() => {
//         const storageKey = 'theme-preference'

//         const onClick = () => {
//             // flip current value
//             theme.value = theme.value === 'light'
//                 ? 'dark'
//                 : 'light'

//             setPreference()
//         }

//         const getColorPreference = () => {
//             if (localStorage.getItem(storageKey))
//                 return localStorage.getItem(storageKey)
//             else
//                 return window.matchMedia('(prefers-color-scheme: dark)').matches
//                     ? 'dark'
//                     : 'light'
//         }

//         const setPreference = () => {
//             localStorage.setItem(storageKey, theme.value);
//             reflectPreference()
//         }

//         const reflectPreference = () => {
//             document.firstElementChild
//                 .setAttribute('data-theme', theme.value)

//             document
//                 .querySelector('#theme-toggle')
//                 ?.setAttribute('aria-label', theme.value)
//         }

//         const theme = {
//             value: getColorPreference(),
//         }

//         // set early so no page flashes / CSS is made aware
//         reflectPreference()

//         window.onload = () => {
//             // set on load so screen readers can see latest value on the button
//             reflectPreference()

//             // now this script can find and listen for clicks on the control
//             document
//                 .querySelector('#theme-toggle')
//                 .addEventListener('click', onClick)
//         }

//         // sync with system changes
//         window
//             .matchMedia('(prefers-color-scheme: dark)')
//             .addEventListener('change', ({ matches: isDark }) => {
//                 theme.value = isDark ? 'dark' : 'light'
//                 setPreference()
//             })
//     }, [])

//     return (
//         <div>
//             <button
//                 className="theme-toggle focus:outline-none" id="theme-toggle" title="Toggles light & dark" aria-label="auto" aria-live="polite"
//             >
//                 <svg
//                     onClick={(event) => {
//                         context.setTheme(!context.theme);
//                         storeValue('current-theme', !context.theme);
//                     }}
//                     style={{
//                         fill: context.theme ? 'white' : 'black'
//                     }}
//                     className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
//                     <mask className="moon" id="moon-mask">
//                         <rect x="0" y="0" width="100%" height="100%" fill="white" />
//                         <circle cx="24" cy="10" r="6" fill="black" />
//                     </mask>
//                     <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
//                     <g className="sun-beams" stroke="currentColor">
//                         <line x1="12" y1="1" x2="12" y2="3" />
//                         <line x1="12" y1="21" x2="12" y2="23" />
//                         <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
//                         <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
//                         <line x1="1" y1="12" x2="3" y2="12" />
//                         <line x1="21" y1="12" x2="23" y2="12" />
//                         <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
//                         <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//                     </g>
//                 </svg>
//             </button>
//         </div >
//     )
// }

'use client'
import { useState, useContext } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import AppContext from '../api/context/AppContext';
import { getValue, storeValue } from '../api/context/functionality';

export default function ToggleTheme() {
    const [isDarkMode, setDarkMode] = useState(getValue("current-theme"));
    const context = useContext(AppContext);

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        context.setTheme(checked);
        storeValue("current-theme", checked);
    };

    return (
        <DarkModeSwitch
            style={{ marginBottom: '2rem' }}
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={25}
        />
    );
}