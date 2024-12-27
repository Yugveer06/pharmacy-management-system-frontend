// NavbarLayout.tsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { useScrollToHash } from "../../hooks/useScrollToHash";
import { useAuth } from "@/contexts/AuthContext";

const NavbarLayout: React.FC = () => {
	const { isAuthenticated } = useAuth();
	useScrollToHash();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const linkStyle =
		"active:scale-95 transition-all relative after:absolute after:bg-white after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300";

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<div className='w-screen'>
			<nav className='flex items-center justify-between p-2 pl-4 text-white bg-slate-800  w-[98%] max-w-[1280px] fixed top-2 left-1/2 -translate-x-1/2 rounded-full border-slate-600 shadow-2xl border z-50'>
				<div>
					<Link to='/' preventScrollReset={true}>
						<h1 className='md:block hidden hover:tracking-wide transition-[letter-spacing] text-lg font-semibold'>
							Pharmacy Management System
						</h1>
						<h1 className='md:hidden hover:tracking-widest transition-[letter-spacing] text-lg font-semibold'>
							PMS
						</h1>
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<button className='lg:hidden p-2' onClick={toggleMenu} aria-label='Toggle menu'>
					<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						{isMenuOpen ? (
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						) : (
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
						)}
					</svg>
				</button>

				{/* Desktop Menu */}
				<div className='hidden lg:flex gap-8 items-center'>
					<Link to='/#home' preventScrollReset={true} className={linkStyle}>
						Home
					</Link>
					<Link to='/#about' preventScrollReset={true} className={linkStyle}>
						About
					</Link>
					<Link to='/#services' preventScrollReset={true} className={linkStyle}>
						Our Services
					</Link>
					<RippleButton className='active:scale-95 transition-all p-0 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 duration-300'>
						{!isAuthenticated ? (
							<Link to='/login' className='px-4 py-1.5' draggable={false} onClick={toggleMenu}>
								Login
							</Link>
						) : (
							<Link to='/dashboard' className='px-4 py-1.5' draggable={false} onClick={toggleMenu}>
								Dashboard
							</Link>
						)}
					</RippleButton>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className='lg:hidden absolute top-full left-0 right-0 mt-2 bg-slate-800 backdrop-blur-3xl rounded-3xl py-4 border border-slate-600'>
						<div className='flex flex-col items-center gap-4'>
							<Link to='/#home' preventScrollReset={true} className={linkStyle} onClick={toggleMenu}>
								Home
							</Link>
							<Link to='/#about' preventScrollReset={true} className={linkStyle} onClick={toggleMenu}>
								About
							</Link>
							<Link to='/#services' preventScrollReset={true} className={linkStyle} onClick={toggleMenu}>
								Our Services
							</Link>
							<RippleButton className='active:scale-95 transition-all p-0 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 duration-300'>
								{!isAuthenticated ? (
									<Link to='/login' className='px-4 py-1.5' draggable={false} onClick={toggleMenu}>
										Login
									</Link>
								) : (
									<Link to='/dashboard' className='px-4 py-1.5' draggable={false} onClick={toggleMenu}>
										Dashboard
									</Link>
								)}
							</RippleButton>
						</div>
					</div>
				)}
			</nav>

			<main className='flex justify-center items-center'>
				<Outlet />
			</main>
		</div>
	);
};

export default NavbarLayout;
