import { Switch } from "@headlessui/react"
import { useState } from "react"
const Navbar = () => {
  const [darkMode, setDarkMode] = useState<false | true>(false)
  useState(()=>{
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value)
    if (value) {
      localStorage.theme = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      localStorage.theme = 'light'
      document.documentElement.classList.remove('dark')
    }
  }
  return (
    <nav className="flex w-full justify-between px-10 py-5">
        <h2 className="font-bold text-2xl">SyncLink</h2>
        <div className="flex gap-4">
            <a href="/">Github</a>
            <a href="/">Linkedin</a>
            <Switch 
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`${
                darkMode ? 'bg-white' : 'bg-black'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  darkMode ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white'
                } inline-block h-4 w-4 transform rounded-full transition`}
              />
            </Switch>
        </div>
    </nav>
  )
}

export default Navbar