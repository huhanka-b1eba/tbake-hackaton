import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layout";
import { HomePage } from "@/pages/home/ui/home-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
