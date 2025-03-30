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
    email: string;
    role: UserRoles;
}

export type Thread = {
    id: number;
    subject: string;
    teaser: string;
    isRead: boolean;
    name: string;
    surname: string;
    date: string; // Date
};

export type TruckIcon = {
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

export interface Pallet {
    id: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    code: string;
    origin: string;
    destination: string;
    dueDate: Date;
}

export interface Truck {
    id: number;
    plate: string;
    mileage: number;
    //driverName: string;
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
    load: Pallet[];
    totalWeight: number;
    maxWeight: number; // 36 toneladas para 2 ejes
}

export enum TrailerType {
    Trailer,
    SemiTrailer,
}

export enum ShiftStatus {
    Planned,
    Ongoing,
    Completed,
    Canceled,
}

export interface Driver {
    name: string;
    surname: string;
    birthdate: Date;

    lastShiftEnd: Date;
}

export interface Shift {
    id: number;
    totalDistance: number;
    expectedDuration: number; // Unix ms
    startDate: Date;
    expectedFinishTime: Date;
    routes: Route[];
    pilot: Driver;
    status: ShiftStatus;
}

export interface WareHouse {
    lat: number;
    lon: number;
    name: string;
    unloadTime: number;
}

export interface City {
    lat: number;
    lon: number;
    name: string;
    code: string;
}

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

// =============== mock data ==============

export const mockUsers: User[] = [
    { "id": 1, "name": "Alice Smith", "email": "alice@example.com", "role": "Admin" },
    { "id": 2, "name": "Bob Jones", "email": "bob@example.com", "role": "Driver" },
    { "id": 3, "name": "Charlie Brown", "email": "charlie@example.com", "role": "Admin" }
];

export const mockPallets: Pallet[] = [
    { "length": 1.2, "width": 0.8, "height": 1.5, "weight": 500, "code": "P12345", "origin": "MAD", "destination": "BCN", "id": 1, "dueDate": new Date() },
    { "length": 1.2, "width": 0.8, "height": 1.5, "weight": 450, "code": "P67890", "origin": "MAD", "destination": "BCN", "id": 1, "dueDate": new Date() }
];

// export const mockTrucks: Truck[] = [
//     { "plate": "ABC123", "consumption": 0.3, "id": 1 },
//     { "plate": "XYZ789", "consumption": 0.32, "id": 2 }
// ];

export const mockDrivers: Driver[] = [
    {
        "name": "John",
        "surname": "Doe",
        "birthdate": new Date(),
        "lastShiftEnd": new Date(),
    },
    {
        "name": "Jane",
        "surname": "Smith",
        "birthdate": new Date(),
        "lastShiftEnd": new Date(),
    }
];

export const mockWarehouses: WareHouse[] = [
    { "lat": 40.7128, "lon": -74.0060, "name": "NYC Warehouse", "unloadTime": 120 },
    { "lat": 34.0522, "lon": -118.2437, "name": "LA Warehouse", "unloadTime": 90 }
];

export const mockCities: City[] = [
    { "lat": 40.7128, "lon": -74.0060, "name": "New York", "code": "NYC" },
    { "lat": 34.0522, "lon": -118.2437, "name": "Los Angeles", "code": "LAX" }
];

export const routes: Route[] = [
    {
        "distance": 4500,
        "code": 101,
        "avgSpeed": 80,
        "origin": { "lat": 40.7128, "lon": -74.0060, "name": "New York", "code": "NYC" },
        "destination": { "lat": 34.0522, "lon": -118.2437, "name": "Los Angeles", "code": "LAX" },
        "points": [
            { "lat": 39.0997, "lon": -94.5786 },
            { "lat": 36.1627, "lon": -86.7816 }
        ]
    }
];

export const mockShifts: Shift[] = [
    {
        "id": 1,
        "status": ShiftStatus.Completed,
        "totalDistance": 4500,
        "expectedDuration": 162000,
        "startDate": new Date("2024-10-26T09:35:39.662Z"),
        "expectedFinishTime": new Date("2024-10-28T09:35:39.662Z"),
        "routes": [
            {
                "distance": 4500,
                "code": 101,
                "avgSpeed": 80,
                "origin": { "lat": 40.7128, "lon": -74.0060, "name": "Valencia", "code": "VLC" },
                "destination": { "lat": 34.0522, "lon": -118.2437, "name": "Madrid", "code": "MAD" },
                "points": [
                    { "lat": 39.0997, "lon": -94.5786 },
                    { "lat": 36.1627, "lon": -86.7816 }
                ]
            }
        ],
        "pilot": {
            "name": "John",
            "surname": "Doe",
            "birthdate": new Date("1985-05-14T00:00:00.000Z"),
            "lastShiftEnd": new Date("2024-10-25T23:35:39.662Z")
        },
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

export const mockTrailers: Trailer[] = [
    {
        "length": "13.6m",
        "width": "2.5m",
        "height": "2.7m",
        "plate": "TR123",
        "load": mockPallets,
        "totalWeight": 950,
        "maxWeight": 36000
    }
];
