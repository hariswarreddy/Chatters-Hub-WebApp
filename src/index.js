import React from 'react';
import ReactDOM from 'react-dom/client';

import App from "./App.jsx";
import {ChakraProvider,theme} from "@chakra-ui/react"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <ChakraProvider theme={theme}>
   <App />
   </ChakraProvider>
  </React.StrictMode>
);

