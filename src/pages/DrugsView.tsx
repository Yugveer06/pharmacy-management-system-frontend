import { useState, useEffect } from "react";
import { columns } from "@/components/drugs-view/columns";
import axios from "axios";
import { motion as m } from "motion/react";
import { LoaderCircle } from "lucide-react";
import { DataTable } from "@/components/drugs-view/data-table";

function DrugsView() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get("/api/drugs");

			// Transform the data to match the table structure
			const transformedData = response.data.map((drug: any) => ({
				id: drug.id,
				name: drug.name,
				manufacturer: drug.manufacturer,
				description: drug.description,
				price: drug.price,
				quantity: drug.quantity,
				mfg_date: drug.mfg_date,
				exp_date: drug.exp_date,
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
	}, []);

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }}
			exit={{ opacity: 0, scale: 0.9, transition: { ease: [0.75, 0, 1, 0.25] } }}
			className='flex flex-1 flex-col bg-gray-100 p-6 w-full overflow-x-hidden'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>View Drugs</h1>
			</header>
			<main className='w-full min-w-0'>
				<DataTable columns={columns} data={data} onDataChange={fetchData} isLoading={isLoading} />
			</main>
		</m.div>
	);
}

export default DrugsView;
