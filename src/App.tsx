import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {useGetMetaQuery} from "./features/api/metaSlice";
import {Toaster} from "sonner";
import {useSelector} from "react-redux";
import {authRouters, publicRouters} from "@/constant/routers.tsx";

function App() {
    useGetMetaQuery(undefined, {
        pollingInterval: 40000,
        refetchOnMountOrArgChange: true,
    });

    const token = useSelector((state) => state.auth.token);

    const renderRoutes = (routes) => {
        return routes.map((router) => {
            const {name, path, component, layout} = router;
            const Layout = layout;
            const Component = component;
            return (
                <Route
                    key={name}
                    path={path}
                    element={<Layout>{<Component/>}</Layout>}
                />
            );
        })
    };

    return (
        <BrowserRouter>
            <Toaster/>
            <Routes>
                {/* Public Routes */}
                {renderRoutes(publicRouters)}

                {/* Authenticated Routes */}
                {token
                    ? renderRoutes(authRouters)
                    : <Route path="*" element={<Navigate to="/" replace/>}/>}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
