import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  cartItems: [],
  totalItems: 0,
  totalAmount: 0,
  shipping: 0,
  tax: 0,
  grandTotal: 0
};

// Create context
const CartContext = createContext(initialState);

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const CALCULATE_TOTALS = 'CALCULATE_TOTALS';

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.cartItems.find(
        item => item.product === action.payload.product
      );

      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = state.cartItems.map(item =>
          item.product === action.payload.product
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedCartItems = [...state.cartItems, action.payload];
      }

      return {
        ...state,
        cartItems: updatedCartItems
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.product !== action.payload
        )
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: []
      };

    case CALCULATE_TOTALS:
      const totalItems = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      const totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const shipping = totalAmount > 1000 ? 0 : 50;
      const tax = totalAmount * 0.18; // 18% GST
      const grandTotal = totalAmount + shipping + tax;

      return {
        ...state,
        totalItems,
        totalAmount,
        shipping,
        tax,
        grandTotal
      };

    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate totals whenever cart items change
  useEffect(() => {
    dispatch({ type: CALCULATE_TOTALS });
  }, [state.cartItems]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: CLEAR_CART });
        cartItems.forEach(item => {
          dispatch({ type: ADD_TO_CART, payload: item });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url || '/placeholder-product.jpg',
      quantity
    };

    dispatch({ type: ADD_TO_CART, payload: cartItem });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
    }
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return state.totalItems;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.cartItems.some(item => item.product === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = state.cartItems.find(item => item.product === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
