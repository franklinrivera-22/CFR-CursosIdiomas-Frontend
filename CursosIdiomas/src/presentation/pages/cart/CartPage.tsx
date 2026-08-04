import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "../../hooks/useCart";
import {
  createOrderAction,
  captureOrderAction,
} from "../../../core/actions/checkout.action";

export const CartPage = () => {
  const { items, totalAmount, increment, decrement, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  if (items.length === 0 && !message) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <ShoppingCart className="mx-auto mb-4 text-gray-300" size={64} />
        <h2 className="text-xl font-semibold text-gray-700">Tu carrito está vacío</h2>
        <button onClick={() => navigate("/catalogo")} className="mt-4 rounded-md bg-blue-800 px-4 py-2 text-white">
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-4 lg:grid-cols-3">
      {/* Lista de items */}
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-2xl font-bold text-blue-950">Carrito</h1>
        <div className="space-y-3">
          {items.map(({ course, quantity }) => (
            <div key={course.id} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
              <img src={course.imageUrl || "https://placehold.co/80"} alt={course.title} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-950">{course.title}</h3>
                <p className="text-sm text-gray-500">Lps.{course.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decrement(course.id)} className="rounded bg-gray-100 p-1 hover:bg-gray-200">
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button onClick={() => increment(course.id)} className="rounded bg-gray-100 p-1 hover:bg-gray-200">
                  <Plus size={16} />
                </button>
              </div>
              <span className="w-20 text-right font-bold text-blue-950">
                Lps.{(course.price * quantity).toFixed(2)}
              </span>
              <button onClick={() => removeFromCart(course.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pago con PayPal */}
      <div className="rounded-lg bg-white p-5 shadow-md">
        <h2 className="mb-4 text-lg font-bold text-blue-950">Pago con PayPal</h2>

        <div className="my-4 flex items-center justify-between border-t pt-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-blue-950">Lps.{totalAmount.toFixed(2)}</span>
        </div>

        {message && (
          <div className={`mb-3 rounded-md p-3 text-sm ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {items.length > 0 && (
          <PayPalScriptProvider
            options={{
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
              currency: "USD",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async () => {
                setMessage(null);
                const res = await createOrderAction(
                  items.map((i) => ({ courseId: i.course.id, quantity: i.quantity }))
                );
                if (!res.status || !res.data?.orderId) {
                  setMessage({ ok: false, text: res.message || "No se pudo crear la orden." });
                  throw new Error("create-order failed");
                }
                return res.data.orderId;
              }}
              onApprove={async (data) => {
                const res = await captureOrderAction(data.orderID!);
                if (res.status && res.data.approved) {
                  setMessage({ ok: true, text: `¡Pago aprobado! Referencia: ${res.data.paymentReference}` });
                  clearCart();
                  setTimeout(() => navigate("/mis-cursos"), 1800);
                } else {
                  const motivo = res.data?.transaction?.paymentMessage || res.message;
                  setMessage({ ok: false, text: `Pago rechazado: ${motivo}` });
                }
              }}
              onError={() => setMessage({ ok: false, text: "Ocurrió un error al procesar el pago con PayPal." })}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
};