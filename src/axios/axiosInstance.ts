import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { cookies } from "next/headers";


const baseURL = "https://dev.wakeful.io/"
export const TOKEN_NAME = 'cookieToken' 


export const publicAxios = axios.create({
    baseURL: baseURL,
});

export const getAuthAxios = async () => {
    const authAxios = axios.create({
        baseURL: baseURL,
    })

    const cookieStore = cookies();
    const token = cookieStore.get("cookieToken");

    let access = '';
    let refresh = '';

    if (token && token.value) {
        access = JSON.parse(token.value).access
        refresh = JSON.parse(token.value).refresh     
    }


    authAxios.interceptors.request.use(
    (config) => {
        if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${access}`;
        }
        
        return config;
    },
    (error) => {
        console.error('token error', error)
        return Promise.reject(error);
    }
    );

    const refreshAuthLogic = async (failedRequest: any) => {
        const data = {
            refresh: refresh,
        };
            
        const options = {
            method: "POST",
            data,
            url: `${baseURL}account/api/login/refresh/`,
        };

        return axios(options)
            .then(async (tokenRefreshResponse) => {
            failedRequest.response.config.headers.Authorization =
                "Bearer " + tokenRefreshResponse.data.access;
            

            return Promise.resolve();
            }).catch(e => {
                cookieStore.delete(TOKEN_NAME)  
            })
    };

    createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

    return authAxios
}











