import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

import Home from './Component/Home/Home.jsx';
import ContactUs from './Component/ContactUs/ContactUs.jsx';
import ErrorPage from './Component/ERROR/Error.jsx';

import LinearDeterminate from './Component/LoadingPage.jsx';

// Lazy load components
const MapPM = lazy(() => import('./Component/PM25/MapPM'));
const MapHID = lazy(() => import('./Component/HID/MapHID'));
const MapDangue = lazy(() => import('./Component/Dangue/MapDangue'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage/>
  },
  {
    path: 'pm',
    element: (
      <Suspense fallback={<LinearDeterminate />}>
        <MapPM />
      </Suspense>
    )
  },
  {
    path: 'hid',
    element: (
      <Suspense fallback={<LinearDeterminate />}>
        <MapHID />
      </Suspense>
    )
  }
  ,
  {
    path: 'dng',
    element: (
      <Suspense fallback={<LinearDeterminate />}>
        <MapDangue />
      </Suspense>
    )
  },
  {
    path: 'ContactUs',
    element: <ContactUs />,
    action: ({ navigate }) => {
      navigate('/ContactUs', { state: nanoid() });
      return null;
    },
  },
  
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
