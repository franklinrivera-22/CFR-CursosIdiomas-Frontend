import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./presentation/context/AuthContext";
import { CartProvider } from "./presentation/context/CartContext";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;