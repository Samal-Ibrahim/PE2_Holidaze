import { LOGIN_API_URL } from "../../config/constants";


export default async function login_api(email: string, password: string) {
const credential = {
    email: email,
    password: password
}
try {
    const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential)
    });
    if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error("Error during login:", error);
    throw error;
}
}