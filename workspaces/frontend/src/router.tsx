import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./common/routes";
//Pages
import HomePage from "./pages/Home/Home";
import InventoryPage from "./pages/Inventory/Inventory";
import DashboardLayout from "./components/DashboardLayout";
import Profile from "./pages/Profile/Profile";

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: (
      <DashboardLayout>
        <HomePage />
      </DashboardLayout>
    ),
  },
  {
    path: APP_ROUTES.INVENTORY,
    element: (
      <DashboardLayout>
        <InventoryPage />
      </DashboardLayout>
    ),
  },
  {
    path: APP_ROUTES.PROFILE,
    element: (
      <DashboardLayout>
        <Profile />
      </DashboardLayout>
    ),
  },
]);
