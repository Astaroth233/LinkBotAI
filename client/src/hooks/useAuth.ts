import { useEffect, useState } from "react";
import { getMe, getProfile } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";

/** Hook to check auth state on mount and restore user session */
export function useAuth(): { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth(): Promise<void> {
      try {
        const meRes = await getMe();
        if (!meRes.success || !meRes.data) {
          return;
        }
        const profileRes = await getProfile();
        if (!cancelled && profileRes.success && profileRes.data) {
          setUser(profileRes.data.user);
        }
      } catch {
        // 401 is expected when not logged in — fail silently
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  return { isLoading };
}
