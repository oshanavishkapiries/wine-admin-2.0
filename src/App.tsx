import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routers } from "./data/routers";
import { useGetMetaQuery } from "./features/api/metaSlice";

function App() {

  useGetMetaQuery(undefined, {
    pollingInterval: 40000,
    refetchOnMountOrArgChange: true
});


  return (
    <BrowserRouter>
      <Routes>
        {routers.map((router) => {
          const { name, path, component, layout } = router;
          const Layout = layout;
          const Component = component;
          return (
            <Route
              key={name}
              path={path}
              element={<Layout>{<Component />}</Layout>}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
