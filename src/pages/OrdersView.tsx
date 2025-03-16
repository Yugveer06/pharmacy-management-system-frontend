import { useState, useEffect, useCallback } from "react";
import { columns } from "@/components/orders-view/columns";
import axios from "axios";
import { motion as m } from "motion/react";
import { LoaderCircle } from "lucide-react";
import { DataTable } from "@/components/orders-view/data-table";

function OrdersView() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await axios.get("/api/orders");

			// Transform the data to match the table structure
			const transformedData = response.data.map((order: any) => ({
				id: order.id,
				status: order.status,
				quantity: order.quantity,
				price: order.price,
			}));

			setData(transformedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{
				opacity: 1,
				scale: 1,
				transition: { ease: [0, 0.75, 0.25, 1] },
			}}
			exit={{
				opacity: 0,
				scale: 0.9,
				transition: { ease: [0.75, 0, 1, 0.25] },
			}}
			className='flex-1 min-h-screen bg-gray-100 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>View Orders</h1>
			</header>
			<main className='w-full'>
				<DataTable
					columns={columns}
					data={data}
					onDataChange={fetchData}
					isLoading={isLoading}
				/>
			</main>
		</m.div>
	);
}

export default OrdersView;
