import { Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";

// Layouts
import NavbarLayout from "@/components/layouts/NavbarLayout";
import SidebarLayout from "@/components/layouts/SidebarLayout";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import DashboardHome from "@/pages/DashboardHome";
import UserView from "@/pages/UserView";
import UserAdd from "@/pages/UserAdd";
import UserUpdate from "@/pages/UserUpdate";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import ProfileView from "@/pages/ProfileView";
import EditProfile from "@/pages/EditProfile";
import DrugsView from "@/pages/DrugsView";
import OrdersView from "@/pages/OrdersView";
import NotFound from "@/pages/NotFound";

// Styles
import "./App.css";

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
						<Route path='*' element={<NotFound />} />
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
								path='update/:id'
								element={
									<ProtectedRoute>
										<UserUpdate />
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
								path='update/:id'
								element={
									<ProtectedRoute>
										<UserUpdate />
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
								path='update/:id'
								element={
									<ProtectedRoute>
										<UserUpdate />
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
								path='update/:id'
								element={
									<ProtectedRoute>
										<UserUpdate />
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
						</Route>
					</Route>
				</Routes>
			</AnimatePresence>
		</AuthProvider>
	);
}

export default App;
