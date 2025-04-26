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

export interface Message {
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
    price: number;
}

export interface Truck {
    id: number;
    plate: string;
    mileage: number;
    mark: string;
    maxWeight: number;
    consumption: number; // l/km
    manufactoringDateUnix: number;
    lastMaintenenceDateUnix: number;
}

export interface Settings {
    pricePerKilogram: number,
    pricePerLiterFuel: number,
    pricePerHourDriver: number,
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
    truck: Truck;
    driver: User;
    totalDistance: number;
    durationMinutes: number;
    etd: string;
    eta: string;
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

export interface SettingsEntity {
    pricePerKilogram: number;
    PricePerLiterFuel: number;
    PricePerHourDriver: number;
}

// DTOs
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
    contactEmail: string,
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

export interface UserUpdateRequest {
    name: string;
    surname: string;
};

export interface UpdateTruckRequest {
    plate: string;
    mileage: number;
    mark: string;
    consumption: number; // l/km
    maxWeight: number;
    manufactoringDateUnix: number;
    lastMaintenenceDateUnix: number;
}

// type TruckCreateRequest = Omit<Truck, "id">
export interface CreateNewTruckRequest {
    plate: string;
    mileage: number;
    mark: string;
    consumption: number;
    maxWeight: number;
    lastMaintenance: Date;
    manufacturingDate: Date;
}

export interface CreateNewThreadRequest {
    toEmail: string,
    subject: string,
    text: string,
};

export interface ReplyToThreadRequest {
    text: string,
};