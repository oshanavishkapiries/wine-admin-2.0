'use client'

import {ArrowLeft, Printer} from 'lucide-react'
import {useLocation, useNavigate} from "react-router-dom"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import type {Orders} from "@/components/section/orders/columns"

const OrderInvoice = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state
    const order: Orders | undefined = state?.order

    const handleBackClick = () => {
        navigate(-1)
    }

    const handlePrint = () => {
        window.print()
    }

    if (!order) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 font-sans">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">Order details not found.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatAddress = (address: any) => (
        <div>
            <p className="font-medium">{address.fullName}</p>
            <p>{address.streetAddress}</p>
            {address.additionalAddress && <p>{address.additionalAddress}</p>}
            <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:underline no-print"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Back to Orders
                </button>

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 no-print"
                >
                    <Printer className="h-4 w-4"/>
                    Print Invoice
                </button>
            </div>

            <Card className="p-6 invoice print:shadow-none print:border-0">
                <CardHeader className="text-center">
                    <h1 className="text-2xl font-bold">Invoice</h1>
                    <p className="text-sm text-gray-500">Order #{order._id}</p>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex justify-between">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Billed To:</h3>
                            {formatAddress(order.shippingAddress)}

                            <h3 className="text-sm font-medium mt-5 mb-2">Mobile No:</h3>
                            {order.mobileNumber}

                            <h3 className="text-sm font-medium mt-5 mb-2">Delivery Type : <span
                                className='font-medium text-gray-500'>{order.deliveryType}</span></h3>
                            {
                                order?.deliveryDate && (
                                    <h3 className="text-sm font-medium mt-5 mb-2">{order?.deliveryType || 'Delivary'} Date: <span
                                        className='font-medium text-gray-500'>{new Intl.DateTimeFormat(undefined, {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                    }).format(new Date(order.deliveryDate))}</span></h3>
                                )
                            }

                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-medium">Invoice Date:</h3>
                            <p>{new Intl.DateTimeFormat(undefined, {dateStyle: 'short'}).format(new Date(order.updatedAt))}</p>
                        </div>
                    </div>

                    <Separator className="my-6"/>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Payment Information:</h3>
                        <p>Method: {order.paymentMethod}</p>
                        <p>Status: <Badge className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                        </p>
                        <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
                    </div>

                    <Separator className="my-6"/>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium">Order Items:</h3>
                        <table className="w-full border-collapse text-sm">
                            <thead>
                            <tr className="border-b">
                                <th className="py-2 text-left">Item</th>
                                <th className="py-2 text-center">Quantity</th>
                                <th className="py-2 text-right">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.products.map((product: any, index: number) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2">{product?.product?.name}</td>
                                    <td className="py-2 text-center">{product.quantity}</td>
                                    <td className="py-2 text-right">
                                            <span>
                                                ${((product.product.unitPrice * (1 - product.product.unitDiscount / 100)) * product.quantity).toFixed(2)}
                                            </span>
                                        {product.product.unitDiscount > 0 && (
                                            <span className="ms-5 line-through">${product.product.unitPrice}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="border-t ">
                                <th colSpan={2} className="py-2 text-left">Total Discount:</th>
                                <td className="py-2 text-right">
                                    ${order.products.reduce((acc, cur) => {
                                    return acc + (cur.product.unitPrice * cur.quantity * (cur.product.unitDiscount / 100));
                                }, 0).toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>

                    <Separator className="my-6"/>

                    <div className="text-right">
                        <h3 className="text-lg font-bold">Total: ${order.totalAmount.toFixed(2)}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderInvoice
