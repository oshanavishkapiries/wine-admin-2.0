import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Orders } from "@/components/section/orders/columns.tsx";

const OrderDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state; // Retrieve navigation state
    const order: Orders | undefined = state?.order; // Type assertion for order

    const handleBackClick = () => {
        navigate(-1);
    };

    if (!order) {
        return <div className="p-6 font-sans">Order details not found.</div>;
    }

    return (
        <div className="p-6 font-sans">
            <Button onClick={handleBackClick} className="mb-6">
                Back
            </Button>

            <Card className="flex flex-col gap-6">
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        <li>
                            <strong>Order ID:</strong> {order._id}
                        </li>
                        <li>
                            <strong>User Name:</strong> {order.user.fullName}
                        </li>
                        <li>
                            <strong>Mobile Number:</strong> {order.mobileNumber}
                        </li>
                        <li>
                            <strong>Payment Method:</strong> {order.paymentMethod}
                        </li>
                        <li>
                            <strong>Payment Status:</strong> {order.paymentStatus}
                        </li>
                        <li>
                            <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                        </li>
                        <li>
                            <strong>Status:</strong> {order.status}
                        </li>
                        <li>
                            <strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}
                        </li>
                        <li>
                            <strong>Shipping Address:</strong>
                            <p className="ml-4">{JSON.stringify(order.shippingAddress, null, 2)}</p>
                        </li>
                        <li>
                            <strong>Products:</strong>
                            <ul className="ml-4 list-disc">
                                {order.products.map((product: any, index: number) => (
                                    <li key={index}>
                                        <strong>Product {index + 1}:</strong> {JSON.stringify(product, null, 2)}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderDetailsPage;
