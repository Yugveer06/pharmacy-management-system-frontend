import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const checkAuth = async () => {
	try {
		const response = await axios.get(`/api/auth/check`, {
			withCredentials: true,
		});
		return response.data.user;
	} catch (error) {
		return null;
	}
};
