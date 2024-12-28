'use client'

import {ArrowLeft} from 'lucide-react'
import {useLocation, useNavigate} from "react-router-dom"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import type {Orders} from "@/components/section/orders/columns"

const OrderDetailsPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state
    const order: Orders | undefined = state?.order

    const handleBackClick = () => {
        navigate(-1)
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

    const formatAddress = (address: any) => {
        return (
            <div className="space-y-1">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.streetAddress}</p>
                {address.additionalAddress && <p>{address.additionalAddress}</p>}
                <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
            <Button
                onClick={handleBackClick}
                variant="ghost"
                className="mb-6 gap-2"
            >
                <ArrowLeft className="h-4 w-4"/>
                Back to Orders
            </Button>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Order Details</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Last updated {new Date(order.updatedAt).toLocaleString()}
                            </p>
                        </div>
                        <Badge
                            className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)} hover:cursor-default`}>
                            {order.status}
                        </Badge>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Customer Details</h3>
                                    <p className="mt-1 font-medium">{order.user.fullName}</p>
                                    <p className="text-sm">{order.mobileNumber}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                                    <div className="mt-1 space-y-1">
                                        <p>Method: <span className="font-medium">{order.paymentMethod}</span></p>
                                        <p>Status: <Badge
                                            className={`${getStatusColor(order.paymentStatus)} hover:${getStatusColor(order.paymentStatus)} hover:cursor-default`}
                                            variant="outline">{order.paymentStatus}</Badge></p>
                                        <p>Amount: <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                                <div className="mt-1 rounded-lg border p-4">
                                    {formatAddress(order.shippingAddress)}
                                </div>
                            </div>
                        </div>

                        <Separator/>
                        <div>
                            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Delivery type</h3>
                            <p className="text-sm ms-5">{order.deliveryType}</p>

                            {order?.deliveryDate && (
                                <>
                                    <h3 className="my-4 text-sm font-medium text-muted-foreground">Date</h3>
                                    <p className="text-sm ms-5">{new Intl.DateTimeFormat(undefined, {dateStyle: 'short', timeStyle: 'short'}).format(new Date(order.deliveryDate))}</p>
                                </>
                            )}
                        </div>

                        <Separator/>

                        <div>
                            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Order Items</h3>
                            <div className="space-y-4">
                                {order.products.map((product: any, index: number) => (
                                    <Card key={index}>
                                        <CardContent className="grid gap-2 p-4 sm:grid-cols-2 items-center">
                                            <div className="flex items-center justify-between">
                                                {product?.product?.image && (
                                                    <img
                                                        src={product?.product?.image}
                                                        alt={product?.product?.name}
                                                        className="h-20 w-20 object-cover"
                                                    />
                                                )}
                                                <p className="font-medium">{product?.product?.name}</p>
                                            </div>
                                            <div className="text-sm text-center
                                            ">
                                                <p className="font-medium">Quantity: {product.quantity}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default OrderDetailsPage

