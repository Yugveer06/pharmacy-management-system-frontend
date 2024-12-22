import {
	Bandage,
	Briefcase,
	ChevronUp,
	DollarSign,
	LayoutGrid,
	LoaderCircle,
	Pill,
	Shield,
	Tickets,
	User2,
	UserPlus,
	Users,
} from "lucide-react";
import { Link, Outlet } from "react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
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
} from "../ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

function SidebarLayout() {
	const { user, logout } = useAuth();

	const hasPermission = (allowedRoles?: UserRole[]) => {
		if (!allowedRoles || allowedRoles.length === 0) return true;
		return user && allowedRoles.includes(user.role_id);
	};

	const filteredGroups = groups.filter(group => hasPermission(group.allowedRoles));

	return (
		<>
			<SidebarProvider className='w-screen'>
				<Sidebar>
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<h1 className='text-xl'>PMS</h1>
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
												const filteredSubitems = item.subitems?.filter(subitem =>
													hasPermission(subitem.allowedRoles)
												);

												if (item.subitems && (!filteredSubitems || filteredSubitems.length === 0)) {
													return null;
												}

												return (
													<SidebarMenuItem key={item.href || item.title}>
														{item.subitems ? (
															<Collapsible defaultOpen className='group/collapsible'>
																<CollapsibleTrigger asChild>
																	<SidebarMenuSubButton asChild>
																		<RippleButton
																			variant='ghost'
																			className='font-normal w-full justify-start'
																		>
																			<div className='flex gap-2 items-center'>
																				{item.icon}
																				<span>{item.title}</span>
																			</div>
																		</RippleButton>
																	</SidebarMenuSubButton>
																</CollapsibleTrigger>
																<CollapsibleContent className='space-y-1 flex flex-col'>
																	<SidebarMenuSub>
																		{filteredSubitems!.map(subItem => (
																			<SidebarMenuSubItem key={subItem.href}>
																				<SidebarMenuSubButton asChild>
																					<RippleButton
																						variant='ghost'
																						className='p-0 font-normal w-full justify-start'
																					>
																						<Link
																							to={subItem.href}
																							className='flex items-center justify-start p-2 w-full h-full'
																						>
																							<div className='flex gap-2 items-center'>
																								{subItem.icon}
																								<span>{subItem.title}</span>
																							</div>
																						</Link>
																					</RippleButton>
																				</SidebarMenuSubButton>
																			</SidebarMenuSubItem>
																		))}
																	</SidebarMenuSub>
																</CollapsibleContent>
															</Collapsible>
														) : (
															<SidebarMenuButton asChild>
																<RippleButton
																	variant='ghost'
																	className='p-0 font-normal w-full justify-start'
																>
																	<Link
																		to={item.href || "#"}
																		className='flex items-center justify-start p-2 w-full h-full'
																	>
																		<div className='flex gap-2 items-center'>
																			{item.icon}
																			<span>{item.title}</span>
																		</div>
																	</Link>
																</RippleButton>
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
										<SidebarMenuButton>
											<User2 />
											{user ? (
												user?.f_name + " " + user?.l_name
											) : (
												<LoaderCircle className='animate-spin' />
											)}
											<ChevronUp className='ml-auto' />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent side='top' className='w-[--radix-popper-anchor-width]'>
										<DropdownMenuItem onClick={logout}>
											<span>Sign out</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>

				<Outlet />
			</SidebarProvider>
		</>
	);
}

type SubItem = {
	title: string;
	href: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
};

type MenuItem = {
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
				title: "Admin",
				icon: <Shield />,
				subitems: [
					{
						title: "View Admins",
						href: "/dashboard/admin/view",
						icon: <Users />,
					},
					{
						title: "Add Admin",
						href: "/dashboard/admin/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN],
					},
				],
			},
			{
				title: "Managers",
				icon: <Briefcase />,
				subitems: [
					{
						title: "View Managers",
						href: "/dashboard/manager/view",
						icon: <Users />,
					},
					{
						title: "Add Manager",
						href: "/dashboard/manager/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN],
					},
				],
			},
			{
				title: "Pharmacists",
				icon: <Bandage />,
				subitems: [
					{
						title: "View Pharmacists",
						href: "/dashboard/pharmacist/view",
						icon: <Users />,
					},
					{
						title: "Add Pharmacist",
						href: "/dashboard/pharmacist/add",
						icon: <UserPlus />,
						allowedRoles: [UserRole.ADMIN, UserRole.MANAGER],
					},
				],
			},
			{
				title: "Salesmen",
				icon: <DollarSign />,
				subitems: [
					{
						title: "View Salesmen",
						href: "/dashboard/salesman/view",
						icon: <Users />,
					},
					{
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
				title: "Drugs",
				href: "/dashboard/drugs",
				icon: <Pill />,
				allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.PHARMACIST],
			},
			{
				title: "Orders",
				href: "/dashboard/orders",
				icon: <Tickets />,
				allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.PHARMACIST, UserRole.SALESMAN],
			},
		],
	},
];

export default SidebarLayout;
