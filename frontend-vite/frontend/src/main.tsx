import './index.css'
import UsersPage from './Users.tsx'
import User from './User.tsx'
import NewUser from './NewUser.tsx'
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/users/:id",
    element: <User />,
  },
  {
    path: "/users/newuser",
    element: <NewUser />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
