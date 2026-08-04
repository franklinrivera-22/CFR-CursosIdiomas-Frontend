export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  status: boolean;
  data: T;
}

export interface Page<T> {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryOne {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  durationHours: number;
  imageUrl: string;
  isActive: boolean;
  category: CategoryOne | null;
}

export interface CartItem {
  course: Course;
  quantity: number;
}

export interface TransactionItem {
  courseId: string;
  courseTitle: string;
  unitPrice: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentReference: string;
  paymentMessage: string;
  createdDate: string;
  items: TransactionItem[];
}

export interface CheckoutResult {
  approved: boolean;
  paymentReference: string;
  transaction: Transaction;
}

export interface LoginResponse {
  email: string;
  fullName: string;
  roles: string[];
  token: string;
}

export interface Statistics {
  coursesCount: number;
  categoriesCount: number;
  transactionsCount: number;
  totalRevenue: number;
}

export interface CheckoutForm {
  items: { courseId: string; quantity: number }[];
}

export interface Enrollment {
  id: string;
  progress: number;
  isActive: boolean;
  createdDate: string;
  course: Course;
}