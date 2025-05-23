import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import AllSpots from "./components/Spots/AllSpots/AllSpots";
import SpotDetails from "./components/Spots/SpotDetails/SpotDetails";
import CreateSpotPage from "./components/Spots/CreateSpot/CreateSpot";
import ManageSpots from "./components/Spots/ManageSpots/ManageSpots";
import UpdateSpotPage from "./components/Spots/ManageSpots/UpdateSpotPage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AllSpots />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails />,
      },
      {
        path: "/spots/new",
        element: <CreateSpotPage />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotPage />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
