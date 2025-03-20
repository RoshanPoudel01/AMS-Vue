import { jwtDecode } from "jwt-decode";

export interface TokenDetails {
  token: string;
  expiresIn: number;
}

function setToken(token: TokenDetails) {
  try {
    localStorage.setItem("token", JSON.stringify(token));
  } catch (e) {
    console.error("Error storing token", e);
  }
}

function getToken() {
  try {
    const tokenDetails = localStorage.getItem("token");
    if (!tokenDetails) return null;
    const tokenWithExpiry = jwtDecode(JSON.parse(tokenDetails)).exp;

    if (tokenWithExpiry && new Date().getTime() / 1000 > tokenWithExpiry) {
      localStorage.removeItem("token");
      return null;
    }

    return JSON.parse(tokenDetails);
  } catch (e) {
    console.error("Error getting token", e);
    return null;
  }
}

function isAuthenticated() {
  const tokenDetails = getToken();
  if (!tokenDetails) return false;
  const decodedToken = tokenDetails ? jwtDecode(tokenDetails) : null;
  if (decodedToken && decodedToken.exp && decodedToken.exp < Date.now()) {
    return true;
  } else {
    return false;
  }
}

function clearToken() {
  localStorage.removeItem("token");
}

const TokenService = {
  setToken,
  getToken,
  isAuthenticated,
  clearToken,
};

export default TokenService;
