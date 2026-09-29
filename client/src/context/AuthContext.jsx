import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { loginUser, logoutUser, refreshAccessToken } from "../api/auth";
import { getCurrentUser } from "../api/users";
import { setAccessToken, clearAccessToken } from "../lib/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const restoreStarted = useRef(false);
  const [user, setUser] = useState(null);
  // isLoading: true while we attempt to silently restore a session on
  // first load (via the refresh-token cookie).
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const applySession = useCallback((token, loggedInUser) => {
    setAccessToken(token);
    setUser(loggedInUser);
    setIsAuthed(true);
  }, []);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setIsAuthed(false);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const response = await loginUser({ email, password });
      const { accessToken, user: loggedInUser } = response.data;
      applySession(accessToken, loggedInUser);
      return loggedInUser;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the server call fails (e.g. token already expired),
      // the client must still forget the session locally.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  // const restoreSession = useCallback(async () => {
  //   try {
  //     const refreshResponse = await refreshAccessToken();
  //     const newToken = refreshResponse.data.accessToken;
  //     setAccessToken(newToken);

  //     const profileResponse = await getCurrentUser();
  //     applySession(newToken, profileResponse.data);
  //   } catch {
  //     clearSession();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [applySession, clearSession]);


  const restoreSession = useCallback(async () => {
  try {
    const refreshResponse = await refreshAccessToken();

    const newToken = refreshResponse?.data?.accessToken;

    if (!newToken) {
      throw new Error("No access token received during session restoration");
    }

    // Restore the access token immediately.
    setAccessToken(newToken);

    // Now use the restored token to fetch the logged-in user.
    const profileResponse = await getCurrentUser();

    const loggedInUser = profileResponse?.data;

    if (!loggedInUser) {
      throw new Error("Unable to restore user profile");
    }

    setUser(loggedInUser);
    setIsAuthed(true);
  } catch (error) {
    console.error("Session restoration failed:", error);
    clearSession();
  } finally {
    setIsLoading(false);
  }
}, [clearSession]);

  // useEffect(() => {
  //   restoreSession();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  
  useEffect(() => {
  if (restoreStarted.current) {
    return;
  }

  restoreStarted.current = true;
  restoreSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const value = {
    user,
    isAuthenticated: isAuthed,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}

export default AuthProvider;
