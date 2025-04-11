import UsersTable from "@/components/tables/usersTable";

export default function Page() {
    return (
        <div className="flex w-full flex-col">
            <h2 className="text-3xl font-bold tracking-tight">
                Users
            </h2>
            <UsersTable />
        </div>
    );
}