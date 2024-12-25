import {useEffect, useState} from "react";
import {columns, Orders} from "@/components/section/orders/columns";
import {DataTable} from "@/components/section/orders/data-table";
import {Pagination} from "@/components/common/Pagination";

import CLoader from "@/components/common/CLoader";
import {useGetAllOrdersQuery} from "@/features/api/orderSlice.ts";
import ErrorFetching from "@/components/common/ErrorFetching.tsx";

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const [tableData, setTableData] = useState<Orders[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    //const [search, setSearch] = useState("");

    const {
        data: orders,
        isLoading,
        isFetching,
        error,
    } = useGetAllOrdersQuery({
        page,
        limit: 10,
    }) as any;

    console.log(orders?.data?.docs);

    useEffect(() => {
        if (orders?.data) {
            const transformedData: Orders[] = orders.data.docs.map((doc: any) => ({
                mobileNumber: doc.mobileNumber,
                paymentMethod: doc.paymentMethod,
                paymentStatus: doc.paymentStatus,
                products: doc.products,
                shippingAddress: doc.shippingAddress,
                status: doc.status,
                totalAmount: doc.totalAmount,
                updatedAt: doc.updatedAt,
                user: {
                    fullName: `${doc.user.firstName} ${doc.user.lastName}`,
                    ...doc.user
                },
                _id: doc._id
            }));

            setTableData(transformedData);
            setTotalPages(orders.data.totalPages);
        }
    }, [orders]);

    console.log(tableData);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearch(event.target.value);
    // };

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
