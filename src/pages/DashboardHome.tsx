import React, { useState, useEffect } from "react";
import { motion as m } from "motion/react";
import axios from "axios";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { Link } from "react-router";

interface CounterState {
	orders: number;
	drugs: number;
	admins: number;
	managers: number;
	pharmacists: number;
	salesmen: number;
}

interface User {
	role_id: number;
}

const DashboardHome: React.FC = () => {
	const [stats, setStats] = useState<CounterState>({
		orders: 0,
		drugs: 0,
		admins: 0,
		managers: 0,
		pharmacists: 0,
		salesmen: 0,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("/api/users");
				const users: User[] = response.data;

				setStats({
					orders: 120, // Simulated data
					drugs: 300, // Simulated data
					admins: users.filter(user => user.role_id === 1).length,
					managers: users.filter(user => user.role_id === 2).length,
					pharmacists: users.filter(user => user.role_id === 3).length,
					salesmen: users.filter(user => user.role_id === 4).length,
				});

				console.log("Fetched user data:", users);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='flex-1 min-h-screen bg-gray-100 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Dashboard</h1>
				<p>Welcome to the Pharmacy Management System Dashboard</p>
			</header>
			<main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* Orders */}
				<div className='bg-white shadow-md p-6 rounded-lg border-l-4 border-blue-500'>
					<h2 className='text-xl font-bold text-blue-500 mb-2'>Orders</h2>
					<p className='text-3xl font-semibold text-gray-800'>{stats.orders}</p>
				</div>
				{/* Drugs */}
				<div className='bg-white shadow-md p-6 rounded-lg border-l-4 border-purple-500'>
					<h2 className='text-xl font-bold text-purple-500 mb-2'>Drugs</h2>
					<p className='text-3xl font-semibold text-gray-800'>{stats.drugs}</p>
				</div>
				{/* Admins */}
				<RippleButton className='h-auto bg-white shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-red-500'>
					<Link
						to='/dashboard/admin/view'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-red-500 mb-2'>Admins</h2>
						<p className='text-3xl font-semibold text-gray-800'>{stats.admins}</p>
					</Link>
				</RippleButton>
				{/* Managers */}
				<RippleButton className='h-auto bg-white shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-orange-500'>
					<Link
						to='/dashboard/manager/view'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-orange-500 mb-2'>Managers</h2>
						<p className='text-3xl font-semibold text-gray-800'>{stats.managers}</p>
					</Link>
				</RippleButton>
				{/* Pharmacists */}
				<RippleButton className='h-auto bg-white shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-teal-500'>
					<Link
						to='/dashboard/pharmacist/view'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-teal-500 mb-2'>Pharmacists</h2>
						<p className='text-3xl font-semibold text-gray-800'>{stats.pharmacists}</p>
					</Link>
				</RippleButton>
				{/* Salesmen */}
				<RippleButton className='h-auto bg-white shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-green-500'>
					<Link
						to='/dashboard/salesman/view'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-green-500 mb-2'>Salesmen</h2>
						<p className='text-3xl font-semibold text-gray-800'>{stats.salesmen}</p>
					</Link>
				</RippleButton>
			</main>
		</m.div>
	);
};

export default DashboardHome;
