type UserRoles = 'Admin' | 'Driver';

export interface UserInfo {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: UserRoles;
}

export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: UserRoles;
}

export interface Thread {
    id: number;
    subject: string;
    teaser: string;
    isRead: boolean;
    name: string;
    surname: string;
    date: string; // Date
};

export interface TruckIcon {
    id: number,
    name: string,
    plate: string,
    speed: number,
    lon: number,
    lat: number,
};

export type Message = {
    id: number;
    name: string;
    surname: string;
    email: string;
    subject: string;
    date: string;
    text: string;
    isRead: boolean;
};

export interface PaginatedRequestDto {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string; // search term for filtering results
    sortBy?: string; // Field by which to sort the results
    sortOrder?: "asc" | "desc";
}

export type PagedResult<T> = {
    data: T[];
    pageIndex: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export interface Parcel {
    id: number;
    weight: number;
    origin: string;
    destination: string;
    contactEmail: string;
    eta: string;
    etd: string;
    guid: string;
}

export interface Truck {
    id: number;
    plate: string;
    mileage: number;
    mark: string;
    consumption: number; // l/km
    manufactoringDateUnix: number;
    lastMaintenenceDateUnix: number;
}

// https://www.sertrans.es/peso-maximo-autorizado-en-camiones/#:~:text=Para%20tr%C3%A1ilers%20o%20remolques%20con,l%C3%ADmite%20es%20de%2040%20toneladas.
// https://app.croneri.co.uk/topics/vehicle-weights-and-weight-limits/indepth?topic=4461#:~:text=Determining%20Maximum%20Authorised%20Weight,laid%20down%20in%20the%20regulations.

export interface Trailer {
    length: string;
    width: string;
    height: string;
    plate: string;
    load: Parcel[];
    totalWeight: number;
    maxWeight: number; // 36 toneladas para 2 ejes
}

export enum TrailerType {
    Trailer,
    SemiTrailer,
}

export enum FreightStatus {
    Scheduled = 1,
    Active = 2,
    Completed = 3,
    Canceled = 4,
}

// export interface Driver {
//     name: string;
//     surname: string;
//     birthdate: Date;
//     lastShiftEnd: Date;
// }

export interface Freight {
    id: number;
    status: FreightStatus;
    origin: string;
    destination: string;
    dueStart: Date; // TODO
    truck: Truck;
    driver: User;
    totalDistance: number;
    durationMinutes: number;
    finishTime: Date;
}

export interface WareHouse {
    lat: number;
    lon: number;
    name: string;
    unloadTime: number;
}

export interface City {
    id: number;
    lat: number;
    lon: number;
    name: string;
    code: string;
};

export interface Route {
    distance: number;
    code: number;
    avgSpeed: number;
    origin: City;
    destination: City;

    points: IGeographicCoordiantes[];
}

export interface IGeographicCoordiantes {
    lat: number;
    lon: number;
}

export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    token: string;
};

export interface AddParcelToFreightRequest {
    originId: number,
    destinationId: number,
    parcelWeight: number,
}

export interface CreateNewUserRequest {
    name: string;
    surname: string;
    dateOfBirth: string;
    email: string;
}

export interface CreateNewUserResponse {
    id: number;
    password: string;
}

// =============== mock data ==============

export const mockWarehouses: WareHouse[] = [
    { "lat": 40.7128, "lon": -74.0060, "name": "NYC Warehouse", "unloadTime": 120 },
    { "lat": 34.0522, "lon": -118.2437, "name": "LA Warehouse", "unloadTime": 90 }
];

export const mockCities: City[] = [
    { "id": 1, "lat": 40.7128, "lon": -74.0060, "name": "New York", "code": "NYC" },
    { "id": 2, "lat": 34.0522, "lon": -118.2437, "name": "Los Angeles", "code": "LAX" }
];

export const routes: Route[] = [
    {
        "distance": 4500,
        "code": 101,
        "avgSpeed": 80,
        "origin": { "id": 1, "lat": 40.7128, "lon": -74.0060, "name": "New York", "code": "NYC" },
        "destination": { "id": 2, "lat": 34.0522, "lon": -118.2437, "name": "Los Angeles", "code": "LAX" },
        "points": [
            { "lat": 39.0997, "lon": -94.5786 },
            { "lat": 36.1627, "lon": -86.7816 }
        ]
    }
];

export const mockPaginatedUsers = {
    "data": [
        { "id": 1, "name": "Alice Smith", "email": "alice@example.com", "role": "admin" },
        { "id": 2, "name": "Bob Jones", "email": "bob@example.com", "role": "driver" },
        { "id": 3, "name": "Charlie Brown", "email": "charlie@example.com", "role": "user" }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 3,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPreviousPage": false,
};