import { Route, Routes, useLocation } from "react-router";

import "./App.css";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NavbarLayout from "@/components/layouts/NavbarLayout";
import SidebarLayout from "@/components/layouts/SidebarLayout";
import DashboardHome from "@/pages/DashboardHome";
import UserView from "./pages/UserView";
import UserAdd from "./pages/UserAdd";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfileView from "./pages/ProfileView";
import { AnimatePresence } from "motion/react";
import EditProfile from "./pages/EditProfile";
import DrugsView from "./pages/DrugsView";
import OrdersView from "./pages/OrdersView";

function App() {
	const location = useLocation();
	return (
		<AuthProvider>
			<AnimatePresence mode='wait'>
				<Routes key={location.pathname} location={location.pathname}>
					<Route path='/' element={<NavbarLayout />}>
						<Route index element={<Home />} />
						<Route path='login' element={<Login />} />
						<Route path='forgot-password' element={<ForgotPassword />} />
						<Route path='reset-password/:token' element={<ResetPassword />} />
					</Route>
					<Route path='/dashboard' element={<SidebarLayout />}>
						<Route
							index
							element={
								<ProtectedRoute>
									<DashboardHome />
								</ProtectedRoute>
							}
						/>
						<Route path='admin'>
							<Route
								path='view'
								element={
									<ProtectedRoute>
										<UserView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='add'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit/:id'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path='manager'>
							<Route
								path='view'
								element={
									<ProtectedRoute>
										<UserView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='add'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit/:id'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path='pharmacist'>
							<Route
								path='view'
								element={
									<ProtectedRoute>
										<UserView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='add'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit/:id'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path='salesman'>
							<Route
								path='view'
								element={
									<ProtectedRoute>
										<UserView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='add'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit/:id'
								element={
									<ProtectedRoute>
										<UserAdd />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path='profile'>
							<Route
								index
								element={
									<ProtectedRoute>
										<ProfileView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit'
								element={
									<ProtectedRoute>
										<EditProfile />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path='drugs'>
							<Route
								index
								element={
									<ProtectedRoute>
										<DrugsView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit/:id'
								element={
									<ProtectedRoute>
										<EditProfile />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path='orders'>
							<Route
								index
								element={
									<ProtectedRoute>
										<OrdersView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='edit/:id'
								element={
									<ProtectedRoute>
										{/* <EditProfile /> */}
										<span>Hi</span>
									</ProtectedRoute>
								}
							/>
						</Route>
					</Route>
				</Routes>
			</AnimatePresence>
		</AuthProvider>
	);
}

export default App;
