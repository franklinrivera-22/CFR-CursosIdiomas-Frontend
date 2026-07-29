import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import type { Transaction } from "../../../core/models";
import { getTransactionsAction } from "../../../core/actions/transactions.action";
import { Spinner } from "../../components/common/Spinner";

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

const statusLabel: Record<string, string> = {
  COMPLETED: "Aprobada",
  FAILED: "Rechazada",
  PENDING: "Pendiente",
};

export const TransactionsPage = () => {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const pageData = await getTransactionsAction("1");
        setTransactions(pageData.items);
      } catch {
        setError("No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold text-blue-950">
        {isAdmin ? "Todas las Transacciones" : "Historial de Transacciones"}
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Cargando transacciones..." />
      ) : transactions && transactions.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
          No hay transacciones registradas.
        </div>
      ) : (
        transactions && (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t.id} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <p className="font-semibold text-blue-950">
                      Ref: {t.paymentReference || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(t.createdDate).toLocaleString("es-HN")}
                    </p>

                    {/* Mmostramos la información del cliente si es Administrador */}
                    {isAdmin && "customerName" in t && t.customerName && (
                      <p className="mt-1 text-sm font-medium text-indigo-900">
                        Cliente: {t.customerName} ({t.customerEmail || "N/A"})
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[t.status]}`}
                  >
                    {statusLabel[t.status] ?? t.status}
                  </span>
                </div>

                <ul className="mb-3 space-y-1 text-sm">
                  {t.items.map((it, idx) => (
                    <li
                      key={`${t.id}-${it.courseId}-${idx}`}
                      className="flex justify-between text-gray-600"
                    >
                      <span>
                        {it.courseTitle} × {it.quantity}
                      </span>
                      <span>Lps.{(it.unitPrice * it.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between border-t pt-3 font-bold text-blue-950">
                  <span>Total</span>
                  <span>Lps.{t.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
