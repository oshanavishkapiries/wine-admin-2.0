import {useEffect, useState} from "react";
import {columns, User} from "@/components/section/users/columns";
import {DataTable} from "@/components/section/users/data-table";
import {Pagination} from "@/components/common/Pagination";

import {Input} from "@/components/ui/input";
import CLoader from "@/components/common/CLoader";
import ErrorFetching from "@/components/common/ErrorFetching.tsx";
import {useGetAllUserQuery} from "@/features/api/userSlice.ts";

export default function Users() {
    const [page, setPage] = useState(1);
    const [tableData, setTableData] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    const {
        data: users,
        isLoading,
        isFetching,
        error,
    } = useGetAllUserQuery({
        page,
        limit: 10,
    }) as any;

    console.log(users?.data?.docs);

    useEffect(() => {
        if (users?.data) {
            const transformedData: User[] = users.data.docs.map((doc: any) => ({
                createdAt: doc.createdAt,
                email: doc.email,
                firstName: doc.firstName,
                lastName: doc.lastName,
                isActive: doc.isActive,
                isAdminUser: doc.isAdminUser,
                isEcomUser: doc.isEcomUser,
                isEmailVerified: doc.isEmailVerified,
                password: doc.password, // Sensitive field - ensure it's used securely
                updatedAt: doc.updatedAt,
                _id: doc._id,
            }));

            setTableData(transformedData);
            setTotalPages(users.data.totalPages);
        }
    }, [users]);

    console.log(tableData);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    if (isLoading) {
        return <div className='h-[80vh] w-full flex items-center justify-center'><CLoader/></div>;
    }

    if (error) {
        return <div className="h-[80vh] w-full flex justify-center items-center"><ErrorFetching/></div>;
    }

    return (
        <div className="w-full p-2">

            {/* Search */}
            {/*<div className="flex items-center py-2 w-full">*/}
            {/*    <Input*/}
            {/*        placeholder="Search"*/}
            {/*        className="w-full"*/}
            {/*        value={search}*/}
            {/*        onChange={handleSearchChange}*/}
            {/*    />*/}
            {/*</div>*/}

            {/* Table */}
            {isFetching ? (
                <CLoader/>
            ) : (
                <DataTable columns={columns} data={tableData} fortable={tableData}/>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
