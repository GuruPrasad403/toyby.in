import { useEffect, useState } from "react";
import axios from "axios";

export function useFetch({ route, method = "GET", token,paramsData }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const url = import.meta.env.VITE_API_URL; // Use Vite-compatible env variables

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios({
                    method: method,
                    url: `${url}/${route}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    params: paramsData,
                });
                setData(response.data); // Save response data
            } catch (err) {
                setError(err); // Capture error
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, [route, method, token, url]); // Dependencies

    return { data, error, loading }; // Return state
}
