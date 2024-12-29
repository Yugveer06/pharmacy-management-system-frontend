import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

const NotFound = () => {
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='text-center'>
				<div className='flex items-center justify-center gap-2 flex-col'>
					<h1 className='text-8xl font-bold text-indigo-600'>404</h1>
					<h2 className='text-3xl font-semibold'>Page Not Found</h2>
					<p className='text-gray-600'>The page you're looking for doesn't exist or has been moved.</p>
				</div>
				<RippleButton className='mt-8 active:scale-95 transition-all group rounded-lg bg-indigo-600 px-6 py-3 hover:bg-indigo-700 p-0 h-fit border border-neutral-500/50'>
					<Link className='px-2 py-1' to='/' draggable='false'>
						<div className='flex gap-2 items-center group-hover:gap-4 transition-all'>
							<ChevronLeft className='max-w-3 max-h-3' />
							<span>Back to home</span>
						</div>
					</Link>
				</RippleButton>
			</div>
		</div>
	);
};

export default NotFound;
