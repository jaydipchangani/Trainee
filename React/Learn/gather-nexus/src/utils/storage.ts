export const setToken = (token: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };
  
  export const getToken = () => localStorage.getItem("token");
  
  export const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };
  
