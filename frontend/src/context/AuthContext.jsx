import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: false
};

// Create context
const AuthContext = createContext(initialState);

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const SET_LOADING = 'SET_LOADING';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set axios default headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        dispatch({ type: SET_LOADING, payload: true });
        const res = await axios.get('/api/users/me');
        dispatch({
          type: AUTH_SUCCESS,
          payload: {
            user: res.data.user,
            token
          }
        });
      } catch (error) {
        dispatch({
          type: AUTH_FAILURE,
          payload: error.response?.data?.message || 'Authentication failed'
        });
      }
    } else {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await axios.post('/api/users/register', userData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: res.data.user,
          token: res.data.token
        }
      });
      return res.data;
    } catch (error) {
      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || 'Registration failed'
      });
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await axios.post('/api/users/login', credentials);
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: res.data.user,
          token: res.data.token
        }
      });
      return res.data;
    } catch (error) {
      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || 'Login failed'
      });
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('/api/users/profile', userData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: res.data.user,
          token: state.token
        }
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
    clearError,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
