// Debug utility for page errors
const DEBUG_ENABLED = true;

export const debug = {
  // Log errors with context
  error: (component, error, context = {}) => {
    if (!DEBUG_ENABLED) return;
    
    console.error(`🚨 [${component}] Error:`, error);
    if (Object.keys(context).length > 0) {
      console.error(`📋 Context:`, context);
    }
  },

  // Log warnings
  warn: (component, message, context = {}) => {
    if (!DEBUG_ENABLED) return;
    
    console.warn(`⚠️ [${component}] Warning:`, message);
    if (Object.keys(context).length > 0) {
      console.warn(`📋 Context:`, context);
    }
  },

  // Log info messages
  info: (component, message, context = {}) => {
    if (!DEBUG_ENABLED) return;
    
    console.log(`ℹ️ [${component}] Info:`, message);
    if (Object.keys(context).length > 0) {
      console.log(`📋 Context:`, context);
    }
  },

  // Log cart state
  cartState: (cartItems, action = 'unknown') => {
    if (!DEBUG_ENABLED) return;
    
    console.log(`🛒 Cart State [${action}]:`, {
      itemCount: cartItems.length,
      items: cartItems,
      total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    });
  },

  // Log component lifecycle
  lifecycle: (component, phase, data = {}) => {
    if (!DEBUG_ENABLED) return;
    
    console.log(`🔄 [${component}] ${phase}:`, data);
  }
};

// Error boundary helper
export const logError = (error, errorInfo, componentName) => {
  console.error(`💥 Error Boundary - ${componentName}:`, {
    error: error.toString(),
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });
};

// Network error helper
export const logNetworkError = (url, error, method = 'GET') => {
  console.error(`🌐 Network Error [${method}] ${url}:`, {
    message: error.message,
    status: error.status,
    response: error.response
  });
};

export default debug;
