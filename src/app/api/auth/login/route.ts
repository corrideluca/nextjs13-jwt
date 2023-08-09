import axios from "axios";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { publicAxios } from "@/axios/axiosInstance";

const TOKEN_NAME = 'cookieToken' 
const expiresIn = 60 * 60 * 24 * 30;

export async function POST(req: Request, res: Response) {
    const body = await req.json()
    const { username, password } = body;
    
    try {
        const response = await publicAxios.post("/account/api/login/", {
          username,
          password,
        });

    
        const cookieObj = {
          expiresIn: expiresIn,
          access: response.data.access,
          refresh: response.data.refresh,
        };


        const serialized = serialize(TOKEN_NAME, JSON.stringify(cookieObj), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: expiresIn,
            sameSite: "strict",
            path: "/",
        })
        

        return new Response(JSON.stringify({message: 'authenticated'}), {
            status: 200,
            headers: { "Set-Cookie": serialized },
        });


    
    } catch (error) {
        // console.error(error)
        return new Response(JSON.stringify(error));
    }

}