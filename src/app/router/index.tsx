import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layout";
import { HomePage } from "@/pages/home/ui/home-page";
import { AnalyticsPage } from "@/pages/analytics/ui/analytics-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "anailitica",
        element: <AnalyticsPage />,
      },
    ],
  },
]);
