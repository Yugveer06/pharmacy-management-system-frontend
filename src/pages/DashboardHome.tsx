import React, { useState, useEffect } from "react";
import { motion as m } from "motion/react";
import axios from "axios";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { Link } from "react-router";
import { LoaderCircle } from "lucide-react";

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

interface Order {
	id: number;
	// ...other order properties...
}

const DashboardHome: React.FC = () => {
	const [userLoader, setUserLoader] = useState<boolean>(true);
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
				const [usersResponse, drugsResponse, ordersResponse] = await Promise.all([axios.get("/api/users"), axios.get("/api/drugs"), axios.get("/api/orders")]);

				const users: User[] = usersResponse.data;
				const drugs = drugsResponse.data;
				const orders: Order[] = ordersResponse.data;

				setStats({
					orders: orders.length,
					drugs: drugs.length,
					admins: users.filter(user => user.role_id === 1).length,
					managers: users.filter(user => user.role_id === 2).length,
					pharmacists: users.filter(user => user.role_id === 3).length,
					salesmen: users.filter(user => user.role_id === 4).length,
				});
				setUserLoader(false);
			} catch (error) {
				setUserLoader(false);
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }}
			exit={{ opacity: 0, scale: 0.9, transition: { ease: [0.75, 0, 1, 0.25] } }}
			className='flex-1 min-h-screen bg-neutral-100 dark:bg-neutral-950 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Dashboard</h1>
				<p>Welcome to the Pharmacy Management System Dashboard</p>
			</header>
			<main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* Orders */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-blue-500'>
					<Link to='/dashboard/orders' className='p-6 flex flex-col items-center justify-center w-full h-full' draggable={false}>
						<h2 className='text-xl font-bold text-blue-500 mb-2'>Orders</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>{userLoader ? <LoaderCircle className='animate-spin' /> : <span>{stats.orders}</span>}</p>
					</Link>
				</RippleButton>
				{/* Drugs */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-purple-500'>
					<Link to='/dashboard/drugs' className='p-6 flex flex-col items-center justify-center w-full h-full' draggable={false}>
						<h2 className='text-xl font-bold text-purple-500 mb-2'>Drugs</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>{userLoader ? <LoaderCircle className='animate-spin' /> : <span>{stats.drugs}</span>}</p>
					</Link>
				</RippleButton>
				{/* Admins */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-red-500'>
					<Link to='/dashboard/admin/view' className='p-6 flex flex-col items-center justify-center w-full h-full' draggable={false}>
						<h2 className='text-xl font-bold text-red-500 mb-2'>Admins</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>{userLoader ? <LoaderCircle className='animate-spin' /> : <span>{stats.admins}</span>}</p>
					</Link>
				</RippleButton>
				{/* Managers */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-orange-500'>
					<Link to='/dashboard/manager/view' className='p-6 flex flex-col items-center justify-center w-full h-full' draggable={false}>
						<h2 className='text-xl font-bold text-orange-500 mb-2'>Managers</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>{userLoader ? <LoaderCircle className='animate-spin' /> : <span>{stats.managers}</span>}</p>
					</Link>
				</RippleButton>
				{/* Pharmacists */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-teal-500'>
					<Link to='/dashboard/pharmacist/view' className='p-6 flex flex-col items-center justify-center w-full h-full' draggable={false}>
						<h2 className='text-xl font-bold text-teal-500 mb-2'>Pharmacists</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>{userLoader ? <LoaderCircle className='animate-spin' /> : <span>{stats.pharmacists}</span>}</p>
					</Link>
				</RippleButton>
				{/* Salesmen */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-green-500'>
					<Link to='/dashboard/salesman/view' className='p-6 flex flex-col items-center justify-center w-full h-full' draggable={false}>
						<h2 className='text-xl font-bold text-green-500 mb-2'>Salesmen</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>{userLoader ? <LoaderCircle className='animate-spin' /> : <span>{stats.salesmen}</span>}</p>
					</Link>
				</RippleButton>
			</main>
		</m.div>
	);
};

export default DashboardHome;
