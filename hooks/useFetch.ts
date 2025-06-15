import { useAppStore } from "@/store/userStore";
import { useEffect, useState, useCallback } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5097';
// const BASE_URL = 'http://ec2-23-20-104-5.compute-1.amazonaws.com';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// const TIMEOUT = 10_000; // milliseconds timeout

type QueryParams = Record<string, string | number | boolean | undefined> | null;

type Data<T> = T | null;
type ErrorType = Error | null;

interface Params<T> {
    data: Data<T>;
    loading: boolean;
    error: Error | null;
}

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

export const useFetch = <T>(
    method: HttpMethod,
    endpoint: string,
    queryParams: QueryParams = null,
    body: unknown = null
): Params<T> & { refetch: () => void; } => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType>(null);
    const jwtToken = useAppStore((s) => s.jwtToken);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const qs = queryParams ? mapQueryParams(queryParams) : "";
            const url = `${BASE_URL}${endpoint}${qs}`;
            console.log("CALLING", url);

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
                },
                body: body ? JSON.stringify(body) : undefined,
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json: T = await res.json();
            setData(json);
            setError(null);
        } catch (err) {
            const e = err instanceof Error ? err : new Error("Unknown error");
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [method, endpoint, queryParams, body, jwtToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};
