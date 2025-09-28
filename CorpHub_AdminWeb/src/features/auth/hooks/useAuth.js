// src/features/auth/hooks/useAuth.js
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useMemo } from "react";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, loading, error } = useSelector((state) => state.auth);

    // Tạo helper để check login & quyền
    const isAuthenticated = !!token;
    const roles = user?.roles || []; // ví dụ: ["ROLE_USER", "ROLE_MANAGER"]

    const hasRole = (role) => roles.includes(role);
    const hasAnyRole = (roleList = []) => roleList.some((r) => roles.includes(r));

    const logoutUser = () => dispatch(logout());

    return useMemo(
        () => ({
            user,
            token,
            roles,
            loading,
            error,
            isAuthenticated,
            hasRole,
            hasAnyRole,
            logout: logoutUser,
        }),
        [user, token, roles, loading, error]
    );
};
