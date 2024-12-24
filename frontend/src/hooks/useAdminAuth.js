import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuth") === "true";
  });

  const setLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting local storage:", error);
    }
  };

  const removeLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing local storage:", error);
    }
  };

  const isAccessTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Invalid JWT token", error);
      return true;
    }
  };

  const login = async (accessToken, refreshToken) => {
    try {
      setLocalStorage("isAuth", true);
      if (accessToken) {
        await Cookies.set("accessToken", accessToken, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        console.error("no access token");
      }
      if (refreshToken) {
        await Cookies.set("refreshToken", refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        console.error("no refresh token");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      removeLocalStorage("isAuth");
      await Promise.all([
        Cookies.remove("accessToken"),
        Cookies.remove("refreshToken"),
      ]);

      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const checkAuth = async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const refreshResponse = await axios.post(
        "/auth/token/verify",
        { token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "token-type": "access",
            "Content-Type": "application/json",
          },
        }
      );
      if (
        refreshResponse.status === 200 &&
        refreshResponse.data.message === "Token is valid"
      ) {
        if (isAccessTokenExpired(accessToken)) {
          const newTokenResponse = await axios.post(
            "/auth/token/refresh",
            { token: refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const newAccessToken = newTokenResponse.data.accessToken;
          Cookies.set("accessToken", newAccessToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        logout(); // If the refresh token is invalid, log out the admin
      }
    } catch (error) {
      console.error("Error during authentication check:", error);
      logout(); // If there's an error in the authentication check, log out the admin
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 900000);

    return () => clearInterval(interval);
  });

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
};

export default useAdminAuth;
