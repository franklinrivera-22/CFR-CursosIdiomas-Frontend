import { createContext, useReducer, type ReactNode } from "react";
import type { CartItem, Course } from "../../core/models";


interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; course: Course }
  | { type: "REMOVE"; courseId: string }
  | { type: "INCREMENT"; courseId: string }
  | { type: "DECREMENT"; courseId: string }
  | { type: "CLEAR" };

const initialState: CartState = { items: [] };


function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.course.id === action.course.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.course.id === action.course.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { course: action.course, quantity: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.course.id !== action.courseId) };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.course.id === action.courseId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.course.id === action.courseId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  increment: (courseId: string) => void;
  decrement: (courseId: string) => void;
  clearCart: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, i) => sum + i.course.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalAmount,
        addToCart: (course) => dispatch({ type: "ADD", course }),
        removeFromCart: (courseId) => dispatch({ type: "REMOVE", courseId }),
        increment: (courseId) => dispatch({ type: "INCREMENT", courseId }),
        decrement: (courseId) => dispatch({ type: "DECREMENT", courseId }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};