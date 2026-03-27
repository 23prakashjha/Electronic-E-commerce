# Electronic E-Commerce Website - MERN Stack

A full-featured electronic e-commerce website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based authentication with secure password hashing
- **Product Management**: CRUD operations for products with categories, brands, and specifications
- **Order Management**: Complete order processing with status tracking
- **Payment Integration**: Razorpay payment gateway integration
- **Admin Dashboard**: Product and order management for administrators
- **API Documentation**: RESTful APIs with proper error handling

### Frontend Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Catalog**: Advanced filtering and search functionality
- **Shopping Cart**: Real-time cart management with localStorage persistence
- **User Profile**: Profile management and order history
- **Product Details**: Detailed product pages with reviews and recommendations
- **Homepage**: 15+ sections including hero banner, featured products, testimonials
- **Navigation**: Intuitive navigation with category dropdowns
- **Wishlist**: Save favorite products for later

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for building APIs
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing for security
- **Razorpay**: Payment gateway integration
- **Multer**: File upload handling
- **Cloudinary**: Cloud image storage (optional)

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Notification system
- **Heroicons**: Icon library

## 📁 Project Structure

```
Electronic E-commerce/
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   └── paymentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── uploads/
│   ├── .env
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProductCard.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── CartPage.jsx
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── hooks/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Electronic-E-commerce
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/electronic-ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Start MongoDB**
   - For local MongoDB: `mongod`
   - Or use MongoDB Atlas and update the connection string

6. **Run the application**
   
   Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   
   Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/best-sellers` - Get best sellers

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/key` - Get Razorpay key

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `RAZORPAY_KEY_ID`: Razorpay API key ID
- `RAZORPAY_KEY_SECRET`: Razorpay API secret key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## 🎨 Customization

### Adding New Categories
1. Update the categories array in `HomePage.jsx`
2. Add category to database via admin panel or API
3. Update product filtering logic

### Customizing Theme
- Modify `tailwind.config.js` for color scheme
- Update CSS variables in `index.css`
- Customize component styles as needed

## 🚀 Deployment

### Backend Deployment (Vercel/Heroku)
1. Set environment variables in deployment platform
2. Update MongoDB URI to production database
3. Deploy using platform-specific commands

### Frontend Deployment (Netlify/Vercel)
1. Build the application: `npm run build`
2. Deploy the `dist` folder
3. Set API base URL to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@electroshop.com
- Documentation: [Link to documentation]

## 🔮 Future Enhancements

- [ ] Real-time chat support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Social login integration
- [ ] Product comparison feature
- [ ] Advanced search with autocomplete
- [ ] Email notifications
- [ ] SMS notifications for orders
- [ ] Affiliate marketing system

---

**Built with ❤️ using MERN Stack**
