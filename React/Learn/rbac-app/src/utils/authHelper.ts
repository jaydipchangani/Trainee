export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  export const setToken = (token: string): void => {
    localStorage.setItem("token", token);
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem("token");
  };
  
  export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getToken();
  };
  