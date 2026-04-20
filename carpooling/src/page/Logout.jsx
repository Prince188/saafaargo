import API from "../api/api";

const logout = () => {
    // remove user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // remove token from axios (if set globally)
    delete API.defaults.headers.common["Authorization"];
};

export default logout;