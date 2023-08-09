
export default async function verifyResponse(response: any) {
    if (response?.data?.status === 401) {
        window.location.href = "/";
    }
}
