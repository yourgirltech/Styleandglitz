import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "@/store/store";
import { ProductsProvider } from "@/context/ProductsContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ProductsProvider>
          <CustomerAuthProvider>
            <App />
          </CustomerAuthProvider>
        </ProductsProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);