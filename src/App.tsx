import { Route, Routes } from "react-router";

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

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path='/' element={<NavbarLayout />}>
					<Route index element={<Home />} />
					<Route path='login' element={<Login />} />
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
					</Route>
				</Route>
			</Routes>
		</AuthProvider>
	);
}

export default App;
