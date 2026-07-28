import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../../hooks/useCart";
import { checkoutAction } from "../../../core/actions/checkout.action";


interface PaymentForm {
  customerName: string;
  customerEmail: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export const CartPage = () => {
  const { items, totalAmount, increment, decrement, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<PaymentForm>({
    customerName: "",
    customerEmail: "",
    cardNumber: "4242424242424242",
    cardExpiry: "12/28",
    cardCvv: "123",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheckout = async () => {setMessage(null);

    if (!form.customerName || !form.customerEmail) {
      setMessage({ ok: false, text: "Completa tu nombre y correo." });
      return;
    }
    if (items.length === 0) {
      setMessage({ ok: false, text: "Tu carrito esta vacio." });
      return;
    }

    setLoading(true);
    try {const res = await checkoutAction({...form,items: items.map((i) => ({ courseId: i.course.id, quantity: i.quantity })), });

      if (res.status && res.data.approved) {
        setMessage({ ok: true, text: `¡Pago aprobado! Referencia: ${res.data.paymentReference}` });
        clearCart();
        setTimeout(() => navigate("/historial"), 1800);
      } else {
        const motivo = res.data?.transaction?.paymentMessage || res.message;
        setMessage({ ok: false, text: `Pago rechazado: ${motivo}` });
      }
    } catch {
      setMessage({ ok: false, text: "Ocurrio un error al procesar el pago." });
    } finally {
      setLoading(false);
    }
  };

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

      {/* Formulario de pago (sandbox) */}
      <div className="rounded-lg bg-white p-5 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-950">
          <CreditCard size={20} /> Datos de pago
        </h2>

        <div className="mb-4 rounded-md bg-blue-50 p-3 text-xs text-blue-800">
          Tarjeta aprobada: 4242 4242 4242 4242 · Rechazada: 4000 0000 0000 0002
        </div>

        <div className="space-y-3">
          <input name="customerName" value={form.customerName} onChange={onChange} placeholder="Nombre completo"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="customerEmail" value={form.customerEmail} onChange={onChange} placeholder="Correo electrónico"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="cardNumber" value={form.cardNumber} onChange={onChange} placeholder="Número de tarjeta"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex gap-3">
            <input name="cardExpiry" value={form.cardExpiry} onChange={onChange} placeholder="MM/AA"
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="cardCvv" value={form.cardCvv} onChange={onChange} placeholder="CVV"
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="my-4 flex items-center justify-between border-t pt-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-blue-950">Lps.{totalAmount.toFixed(2)}</span>
        </div>

        {message && (
          <div className={`mb-3 rounded-md p-3 text-sm ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <button onClick={handleCheckout} disabled={loading} className="w-full rounded-md bg-blue-800 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50">
          {loading ? "Procesando..." : `Pagar Lps.${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};