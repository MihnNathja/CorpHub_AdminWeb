import { useEffect, useState } from "react";
import { getUsers } from "../services/userApi";

export const useUser = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchEmployees() {
      try {
        setLoadingUsers(true);
        const res = await getUsers();
        if (isMounted) {
          setEmployees(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setErrorUsers(err.response?.data || err.message);
        }
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    }

    fetchEmployees();
    return () => {
      isMounted = false;
    };
  }, []);

  return { employees, loadingUsers, errorUsers, setEmployees };
};
