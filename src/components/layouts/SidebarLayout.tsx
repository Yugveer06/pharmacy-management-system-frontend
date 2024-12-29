import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { Bandage, Briefcase, ChevronUp, DollarSign, LayoutGrid, LoaderCircle, Menu, Pill, Shield, Tickets, User2, UserPlus, Users } from "lucide-react";
import { motion as m } from "motion/react";
import { Link, Outlet, useLocation } from "react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	useSidebar,
} from "../ui/sidebar";

function SidebarLayout() {
	const { user, logout } = useAuth();
	const location = useLocation();

	const hasPermission = (allowedRoles?: UserRole[]) => {
		if (!allowedRoles || allowedRoles.length === 0) return true;
		return user && allowedRoles.includes(user.role_id);
	};

	const filteredGroups = groups.filter(group => hasPermission(group.allowedRoles));

	return (
		<>
			<SidebarProvider className='w-screen bg-gray-100'>
				<Sidebar>
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link to='/' className='flex items-center gap-2 p-2 rounded'>
									<img src='/logo.png' alt='PMS Logo' className='w-8' />
									<h1 className='text-lg font-bold text-indigo-800'>PMS</h1>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>
					<SidebarContent>
						{filteredGroups.map(group => {
							const filteredItems = group.items.filter(item => hasPermission(item.allowedRoles));

							if (filteredItems.length === 0) return null;

							return (
								<SidebarGroup key={group.id}>
									<SidebarGroupLabel>{group.name}</SidebarGroupLabel>
									<SidebarGroupContent>
										<SidebarMenu>
											{filteredItems.map(item => {
												const filteredSubitems = item.subitems?.filter(subitem => hasPermission(subitem.allowedRoles));

												if (item.subitems && (!filteredSubitems || filteredSubitems.length === 0)) {
													return null;
												}

												return (
													<SidebarMenuItem key={item.href || item.title}>
														{item.subitems ? (
															<Collapsible
																defaultOpen
																className={cn("group/collapsible rounded-md", location.pathname.includes(item.id) && "bg-indigo-100/20 border border-indigo-50")}
															>
																<CollapsibleTrigger asChild>
																	<SidebarMenuSubButton asChild>
																		<RippleButton variant='ghost' className='active:scale-95 transition-all font-normal w-full justify-start'>
																			<div className='flex gap-2 items-center'>
																				{item.icon}
																				<span>{item.title}</span>
																			</div>
																		</RippleButton>
																	</SidebarMenuSubButton>
																</CollapsibleTrigger>
																{location.pathname.includes(item.id) && (
																	<m.div layoutId='activeItemIndicator' className='rounded-full absolute top-0 -left-1.5 h-full w-0.5 bg-indigo-500' />
																)}
																<CollapsibleContent className='space-y-1 flex flex-col'>
																	<SidebarMenuSub>
																		{filteredSubitems!.map(subItem => (
																			<SidebarMenuSubItem className='relative' key={subItem.href}>
																				<SidebarMenuSubButton asChild>
																					<RippleButton
																						variant='ghost'
																						className={cn(
																							"active:scale-95 transition-all p-0 font-normal w-full justify-start",
																							location.pathname === subItem.href && "bg-indigo-100/40 border border-indigo-100",
																							location.pathname.includes(item.id) && "hover:bg-indigo-100"
																						)}
																					>
																						<Link to={subItem.href} className='relative flex items-center justify-start p-2 w-full h-full'>
																							<div className='flex gap-2 items-center'>
																								{subItem.icon}
																								<span>{subItem.title}</span>
																							</div>
																						</Link>
																					</RippleButton>
																				</SidebarMenuSubButton>
																				{location.pathname === subItem.href && (
																					<m.div
																						initial={{ opacity: 0 }}
																						animate={{ opacity: 1 }}
																						exit={{ opacity: 0 }}
																						layoutId={`activeSubItem${filteredSubitems?.[0]?.id || ""}Indicator`}
																						className='rounded-full absolute top-0 -left-3 h-full w-0.5 bg-indigo-500'
																					/>
																				)}
																			</SidebarMenuSubItem>
																		))}
																	</SidebarMenuSub>
																</CollapsibleContent>
															</Collapsible>
														) : (
															<SidebarMenuButton asChild>
																<>
																	<RippleButton
																		variant='ghost'
																		className={cn(
																			"active:scale-95 transition-all p-0 font-normal w-full justify-start",
																			location.pathname === item.href && "bg-indigo-100/40 border border-indigo-100 hover:bg-indigo-100"
																		)}
																	>
																		<Link to={item.href || "#"} className='flex items-center justify-start p-2 w-full h-full'>
																			<div className='flex gap-2 items-center'>
																				{item.icon}
																				<span>{item.title}</span>
																			</div>
																		</Link>
																	</RippleButton>
																	{location.pathname === item.href && (
																		<m.div layoutId='activeItemIndicator' className='rounded-full absolute top-0 -left-1.5 h-full w-0.5 bg-indigo-500' />
																	)}
																</>
															</SidebarMenuButton>
														)}
													</SidebarMenuItem>
												);
											})}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							);
						})}
					</SidebarContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<div>
											<SidebarMenuButton className={cn(location.pathname.startsWith("/dashboard/profile") && "bg-indigo-100/40 border border-indigo-100 hover:bg-indigo-100")}>
												<User2 />
												{user ? user?.f_name + " " + user?.l_name : <LoaderCircle className='animate-spin' />}
												<ChevronUp className='ml-auto' />
											</SidebarMenuButton>
											{location.pathname.startsWith("/dashboard/profile") && <div className='rounded-full absolute top-0 -left-1.5 h-full w-0.5 bg-indigo-500' />}
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent side='top' className='w-[--radix-popper-anchor-width]'>
										<DropdownMenuItem asChild>
											<Link to='/dashboard/profile'>Profile</Link>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={logout}>
											<span>Sign out</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>

				<div className='flex flex-1 flex-col min-w-0'>
					<MobileHeader />
					<main className='flex-1 min-w-0'>
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</>
	);
}

// Add this new component
function MobileHeader() {
	const { toggleSidebar } = useSidebar();

	return (
		<div className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden'>
			<RippleButton variant='ghost' size='icon' className='md:hidden' onClick={toggleSidebar}>
				<div className='flex gap-2 items-center'>
					<Menu className='h-6 w-6' />
					<span className='sr-only'>Toggle Sidebar</span>
				</div>
			</RippleButton>
			<h1 className='font-semibold'>PMS</h1>
		</div>
	);
}

type SubItem = {
	id: string;
	title: string;
	href: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
};

type MenuItem = {
	id: string;
	title: string;
	href?: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
	subitems?: SubItem[];
};

type Group = {
	id: string;
	name: string;
	items: MenuItem[];
	allowedRoles?: UserRole[];
};

const groups: Group[] = [
	{
		id: "app",
		name: "App",
		items: [
			{
				id: "dashboard",
				title: "Dashboard",
				href: "/dashboard",
				icon: <LayoutGrid />,
			},
		],
	},
	{
		id: "users",
		name: "Users",
		items: [
			{
				id: "admin",
				title: "Admin",
				icon: <Shield />,
				subitems: [
					{
						id: "view_admins",
						title: "View Admins",
						href: "/dashboard/admin/view",
						icon: <Users />,
					},
					{
						id: "add_admins",
						title: "Add Admin",
						href: "/dashboard/admin/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN],
					},
				],
			},
			{
				id: "manager",
				title: "Managers",
				icon: <Briefcase />,
				subitems: [
					{
						id: "view_managers",
						title: "View Managers",
						href: "/dashboard/manager/view",
						icon: <Users />,
					},
					{
						id: "add_managers",
						title: "Add Manager",
						href: "/dashboard/manager/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN],
					},
				],
			},
			{
				id: "pharmacist",
				title: "Pharmacists",
				icon: <Bandage />,
				subitems: [
					{
						id: "view_pharmacists",
						title: "View Pharmacists",
						href: "/dashboard/pharmacist/view",
						icon: <Users />,
					},
					{
						id: "add_pharmacists",
						title: "Add Pharmacist",
						href: "/dashboard/pharmacist/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN, UserRole.MANAGER],
					},
				],
			},
			{
				id: "salesman",
				title: "Salesmen",
				icon: <DollarSign />,
				subitems: [
					{
						id: "view_salesmen",
						title: "View Salesmen",
						href: "/dashboard/salesman/view",
						icon: <Users />,
					},
					{
						id: "add_salesmen",
						title: "Add Salesman",
						href: "/dashboard/salesman/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.PHARMACIST],
					},
				],
			},
		],
	},
	{
		id: "other",
		name: "Other",
		items: [
			{
				id: "drugs",
				title: "Drugs",
				href: "/dashboard/drugs",
				icon: <Pill />,
				allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.PHARMACIST],
			},
			{
				id: "orders",
				title: "Orders",
				href: "/dashboard/orders",
				icon: <Tickets />,
				allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.PHARMACIST, UserRole.SALESMAN],
			},
		],
	},
];

export default SidebarLayout;
