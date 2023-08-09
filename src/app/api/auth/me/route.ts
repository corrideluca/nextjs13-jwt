import { getAuthAxios } from "@/axios/axiosInstance";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const authAxios = await getAuthAxios();

    try {
        const response = await authAxios.get("/ibkr/api/activos/");
        return NextResponse.json({
            status: 200,
            data: response.data
        })

    } catch (error) {
        if (error?.response?.status) {
            return NextResponse.json({
              status: error?.response?.status,
              message: error.message,
            });
        }   

        return NextResponse.json({
            status: 500,
            message: 'Internal server Error'
        });
    }
}