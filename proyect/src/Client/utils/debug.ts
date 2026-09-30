import type { CartItem } from "../types/index.js";

/** Contexto libre que se adjunta a los logs de depuración. */
export type DebugContext = Record<string, unknown>;

/** Error de red con el status y la respuesta que agrega el cliente HTTP. */
export interface NetworkError extends Error {
  status?: number;
  response?: unknown;
}

export interface ErrorInfo {
  componentStack?: string | null;
}

// Debug utility for page errors
const DEBUG_ENABLED = true;

export const debug = {
  // Log errors with context
  error: (component: string, error: unknown, context: DebugContext = {}): void => {
    if (!DEBUG_ENABLED) return;

    console.error(`🚨 [${component}] Error:`, error);
    if (Object.keys(context).length > 0) {
      console.error(`📋 Context:`, context);
    }
  },

  // Log warnings
  warn: (component: string, message: string, context: DebugContext = {}): void => {
    if (!DEBUG_ENABLED) return;

    console.warn(`⚠️ [${component}] Warning:`, message);
    if (Object.keys(context).length > 0) {
      console.warn(`📋 Context:`, context);
    }
  },

  // Log info messages
  info: (component: string, message: string, context: DebugContext = {}): void => {
    if (!DEBUG_ENABLED) return;

    console.log(`ℹ️ [${component}] Info:`, message);
    if (Object.keys(context).length > 0) {
      console.log(`📋 Context:`, context);
    }
  },

  // Log cart state
  cartState: (cartItems: CartItem[], action = "unknown"): void => {
    if (!DEBUG_ENABLED) return;

    console.log(`🛒 Cart State [${action}]:`, {
      itemCount: cartItems.length,
      items: cartItems,
      total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    });
  },

  // Log component lifecycle
  lifecycle: (component: string, phase: string, data: DebugContext = {}): void => {
    if (!DEBUG_ENABLED) return;

    console.log(`🔄 [${component}] ${phase}:`, data);
  },
};

// Error boundary helper
export const logError = (
  error: Error,
  errorInfo: ErrorInfo,
  componentName: string
): void => {
  console.error(`💥 Error Boundary - ${componentName}:`, {
    error: error.toString(),
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  });
};

// Network error helper
export const logNetworkError = (
  url: string,
  error: NetworkError,
  method = "GET"
): void => {
  console.error(`🌐 Network Error [${method}] ${url}:`, {
    message: error.message,
    status: error.status,
    response: error.response,
  });
};

export default debug;
