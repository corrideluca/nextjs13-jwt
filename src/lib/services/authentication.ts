import axios, { AxiosInstance } from 'axios'

export class AuthService {
  protected readonly instance: AxiosInstance;
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out",
    });
  }
 
  login = async (username: string, password: string) => {
    return this.instance
      .post("/account/api/login/", {
        username,
        password,
      })
      .then((res) => {
        return {
          username: res.data.username,
          accesToken: res.data.access,
          expiredAt: res.data.expiredAt,
        };
      });
 }
}
