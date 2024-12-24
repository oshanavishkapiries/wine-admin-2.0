import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
            <p className="mt-2 text-gray-500">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Button className="mt-5">
                <Link to="/dashboard"> Go Back Home</Link>
            </Button>
        </div>
    );
};

export default NotFound;
