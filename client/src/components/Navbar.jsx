import React, { useState } from 'react'
import axios from 'axios'
import logo from '../assets/logo.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FiMenu, FiX, FiChevronRight } from 'react-icons/fi'
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

 const links = [
  { label: "Home", path: "/" },
  { label: "Builder", path: "/builder" },
  // { label: "Billing", path: "/billing" },
  ...(user?.isAdmin
    ? [{ label: "Admin", path: "/admin" }]
    : []),
];

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      toast.success("Logged out successfully!");  
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Failed to log out. Please try again.");
    } finally {
      setUser(null)
      navigate('/login', { replace: true })
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]'>
      <div className='absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-cyan-400/60 to-transparent' />

      <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='group flex items-center gap-3 rounded-2xl px-2 py-1 text-left transition-transform duration-300 hover:scale-[1.02]'
        >
          <div className='relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/20 ring-1 ring-white/10'>
            <img src={logo} alt='Jarvis AI logo' className='h-7 w-7 object-contain' />
            <div className='absolute inset-0 rounded-2xl bg-white/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100' />
          </div>

          <div>
            <div className='text-xs uppercase tracking-[0.3em] text-cyan-300/80'>AI Voice Assistant</div>
            <div className='text-lg font-semibold text-white'>Jarvis <span className='bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'>AI</span></div>
          </div>
        </button>

        <nav className='hidden items-center gap-2 md:flex'>
          {links.map((link) => (
            <button
              key={link.path}
              type='button'
              onClick={() => navigate(link.path)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          {user ? (
            <>
              <div className='flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-sm'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-blue-500 font-semibold text-black'>
                  {(user.name || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div className='leading-tight'>
                  <div className='text-[11px] uppercase tracking-[0.25em] text-cyan-200/70'>Signed in</div>
                  <div className='max-w-40 truncate font-medium text-white'>{user.name}</div>
                </div>
              </div>

              <button
                type='button'
                onClick={handleLogout}
                className='rounded-full border border-white/10 bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/20'
              >
                Logout
              </button>
            </>
          ) : null}
        </div>

        <button
          type='button'
          onClick={() => setMenuOpen((value) => !value)}
          className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden'
          aria-label='Toggle navigation menu'
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <div className={`border-t border-white/10 bg-black/95 px-4 py-4 md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className='mx-auto flex max-w-7xl flex-col gap-3'>
          {links.map((link) => (
            <button
              key={link.path}
              type='button'
              onClick={() => {
                navigate(link.path)
                setMenuOpen(false)
              }}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              <span>{link.label}</span>
              <FiChevronRight className='text-white/40' />
            </button>
          ))}

          {user ? (
            <>
              <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-blue-500 font-semibold text-black'>
                  {(user.name || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div className='min-w-0'>
                  <div className='text-xs uppercase tracking-[0.25em] text-cyan-200/70'>Account</div>
                  <div className='truncate font-medium text-white'>{user.name}</div>
                </div>
              </div>

              <button
                type='button'
                onClick={handleLogout}
                className='rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:shadow-lg hover:shadow-white/20'
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar
