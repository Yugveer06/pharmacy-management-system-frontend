import { columns } from "@/components/user-view/columns";
import { DataTable } from "@/components/user-view/data-table";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function UserView() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();

	const getRoleDetails = () => {
		const path = location.pathname;
		if (path.includes("/admin")) return { id: 1, name: "admin", title: "Admins" };
		if (path.includes("/manager")) return { id: 2, name: "manager", title: "Managers" };
		if (path.includes("/pharmacist")) return { id: 3, name: "pharmacist", title: "Pharmacists" };
		if (path.includes("/salesman")) return { id: 4, name: "salesman", title: "Salesmen" };
		return { id: 5, name: "user", title: "Users" };
	};

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const role = getRoleDetails().id;
			const response = await axios.get(`/api/users/${role}`);

			// Transform the data to match the table structure
			const transformedData = response.data.map((user: any) => ({
				id: user.id,
				avatar: user.avatar,
				name: user.f_name + " " + user.l_name,
				email: user.email,
				phone: user.phone,
				role: user.role_id,
			}));

			setData(transformedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [location.pathname]);

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }}
			exit={{ opacity: 0, scale: 0.9, transition: { ease: [0.75, 0, 1, 0.25] } }}
			className='flex-1 min-h-screen bg-gray-100 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>View {getRoleDetails().title}</h1>
			</header>
			<main>
				{isLoading ? (
					<div className='flex justify-center items-center'>
						<LoaderCircle className=' animate-spin' />
					</div>
				) : (
					<DataTable columns={columns} data={data} />
				)}
			</main>
		</m.div>
	);
}

export default UserView;
