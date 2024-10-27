import { useEffect, useState } from "react";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const TIMEOUT = 10_000; // milliseconds timeout

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestOptions = {
    headers?: HeadersInit;
    params?: Record<string, string>;
    body?: any;
};

type Data<T> = T | null;
type ErrorType = Error | null;

interface Params<T> {
    data: Data<T>;
    loading: boolean;
    error: Error | null;
}

export const useFetch = <T>(
    method: HttpMethod,
    slug: string,
    body: any = null
): Params<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType>(null);

    useEffect(() => {
        let controller = new AbortController();

        // Set timeout to abort the request
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, TIMEOUT);

        const requestOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal, // Attach the AbortSignal to the request
            credentials: 'include', // Includes cookies in the request
        };

        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await fetch(BASE_URL + slug, controller);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData: T = await response.json();
                setData(jsonData);
                setError(null);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('An unknown error occurred');
                if (error.name === 'AbortError') {
                    throw new Error('Request timed out');
                }

                setError(error);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };

    }, [slug, method, body]);

    return { data, loading, error };
};