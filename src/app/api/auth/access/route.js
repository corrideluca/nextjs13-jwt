import cookie from "cookie";
import jwt_decode from 'jwt-decode';
const TOKEN_NAME = 'cookieToken' 

export default Access = async  (req, res) => {
  const cookies = cookie.parse(req.headers?.cookie ?? "");
  const appCookie = cookies?.[TOKEN_NAME] ?? "";
  const parsedCookies = appCookie ? JSON.parse(appCookie) : {};
  const accessToken = parsedCookies?.accessToken ?? null;

  if (!accessToken) { 
    res.status(200).json({ success: true, token: null });
  }

  const { exp } = jwt_decode(accessToken);
  const isAccessTokenExpired = Date.now() / 1000 > exp;

  const refreshToken = parsedCookies?.refreshToken;

  /**
   * Fetch new access token if it expires
   */
  if (isAccessTokenExpired) {
    try {
      /**
       * It can be REST API or GraphQL
       */
      const data = await getNewAccessToken({refreshToken: refreshToken});

      const cookieObj = {
        expiresIn: data.ExpiresIn,
        accessToken: data.AccessToken,
        refreshToken,
      }

      res.setHeader(
        "Set-Cookie",
        cookie.serialize(
          TOKEN_NAME,
          JSON.stringify(cookieObj),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: data.ExpiresIn,
            sameSite: "strict",
            path: "/",
          }
        )
      );

    } catch (error) {
      // if refresh token fails to get new access token 
      res
        .status(400)
        .json({
          success: false,
          message: "Please logout user or push user to login route",
        });
    }
  }

  res
    .status(200)
    .json({ success: true, token: parsedCookies?.accessToken ?? null });
};