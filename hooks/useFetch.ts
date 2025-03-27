import { useAppStore } from "@/store/userStore";
import { useEffect, useState } from "react";

const BASE_URL = process.env.API_URL || 'http://localhost:5097';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// const TIMEOUT = 10_000; // milliseconds timeout

// type QueryParams = Record<string, unknown> | null;
type QueryParams = Record<string, string | number | boolean | undefined> | null;

type Data<T> = T | null;
type ErrorType = Error | null;

interface Params<T> {
    data: Data<T>;
    loading: boolean;
    error: Error | null;
}

export const useFetch = <T>(
    method: HttpMethod,
    endpoint: string,
    queryParams: QueryParams = null,
    body: unknown = null
): Params<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType>(null);

    const jwtToken = useAppStore(state => state.jwtToken);

    useEffect(() => {
        // const controller = new AbortController();
        // Get the JWT token from your Zustand store

        // Set timeout to abort the request
        // const timeoutId = setTimeout(() => {
        //     controller.abort();
        // }, TIMEOUT);

        // Map queryParams to URL if provided
        const queryString = queryParams ? mapQueryParams(queryParams) : "";
        // const fullUrl = `${url}${queryString}`;

        const requestOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` })
            },
            body: body ? JSON.stringify(body) : undefined,
            // signal: controller.signal, // Attach the AbortSignal to the request
            // credentials: 'include', // Includes cookies in the request
        };

        setLoading(true);

        const fetchData = async () => {
            try {
                // const response = await fetch(BASE_URL + endpoint, controller);
                const response = await fetch(`${BASE_URL}${endpoint}${queryString}`, requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData: T = await response.json();
                console.table(jsonData);

                setData(jsonData);
                setError(null);
            } catch (err) {
                console.error(err);
                const error = err instanceof Error ? err : new Error('An unknown error occurred');
                // if (error.name === 'AbortError') {
                //     throw new Error('Request timed out');
                // }

                setError(error);
            } finally {
                // clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        fetchData();

        // return () => { controller.abort(); };

    }, [endpoint, method, body, queryParams, jwtToken]);

    return { data, loading, error };
};

const mapQueryParams = (params?: QueryParams): string => {
    if (!params) return "";

    const queryString = Object.entries(params)
        .filter(([key, value]) => key && value !== undefined) // Remove undefined values
        .map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");

    return queryString
        ? `?${queryString}`
        : "";
};