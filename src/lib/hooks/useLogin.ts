import { AuthService } from "../services/authentication";
import Cookies from 'js-cookie'

interface User {
    username: string;
};

export const authService = new AuthService("https://dev.wakeful.io/");

export const useLogin = () => {
    const login = async (username: string, password: string) => {
        const user = await authService.login(username, password)
        if (user) {
            Cookies.set("currentUser", JSON.stringify(user))
        }
        return user as User
    }

    return {login}
}
