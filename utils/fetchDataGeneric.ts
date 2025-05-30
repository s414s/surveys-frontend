export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type QueryParams = Record<string, string | number | boolean | undefined> | null;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5097';
// const BASE_URL = 'http://ec2-54-162-145-215.compute-1.amazonaws.com';

const mapQueryParams = (params: QueryParams): string => {
    if (!params) return "";
    const queryString = Object.entries(params)
        .filter(([key, value]) => key && value !== undefined) // Remove undefined values
        .map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");
    return queryString ? `?${queryString}` : "";
};

export const fetchDataGeneric = async <T>(
    method: HttpMethod,
    endpoint: string,
    queryParams: QueryParams = null,
    body: unknown = null,
    jwtToken?: string
): Promise<T> => {
    const queryString = queryParams ? mapQueryParams(queryParams) : "";

    const requestOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` })
        },
        body: body ? JSON.stringify(body) : undefined,
    };

    const url = `${BASE_URL}${endpoint}${queryString}`;
    console.log("CALLING", url);

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        console.error(response);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
