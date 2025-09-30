# 🚂 ThroughputAI - Railway Control Center

<div align="center">

**AI-Powered Railway Operations Management System**

*Real-time train scheduling optimization with machine learning predictions*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-green.svg)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)

</div>

---

## 🌟 Overview

ThroughputAI is a sophisticated railway control center dashboard that combines modern web technologies with advanced machine learning to provide real-time train operations management, predictive analytics, and intelligent scheduling optimization for Indian Railways.

### ✨ Key Features

- 🤖 **AI-Powered Predictions** - Delay forecasting, conflict detection, and throughput optimization
- 📊 **Real-time Dashboard** - Live train monitoring with interactive visualizations
- 🎯 **Smart Recommendations** - ML-driven scheduling suggestions and operational insights
- 🌙 **Modern UI/UX** - Dark/light themes with smooth animations
- 🔐 **Secure Authentication** - JWT-based login with MongoDB Atlas integration
- 📱 **Responsive Design** - Optimized for all devices and screen sizes
- 🌐 **Multi-language Support** - Internationalization ready

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2+ | UI Framework |
| **TypeScript** | 5.2+ | Type Safety |
| **Vite** | 4.4+ | Build Tool |
| **Tailwind CSS** | 3.3+ | Styling |
| **Radix UI** | Latest | Component Library |
| **Framer Motion** | 10.16+ | Animations |
| **Recharts** | 2.15+ | Data Visualization |
| **React Router** | 6.26+ | Navigation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | Runtime |
| **Express.js** | 4.21+ | Web Framework |
| **MongoDB Atlas** | Latest | Database |
| **Mongoose** | 8.18+ | ODM |
| **JWT** | 9.0+ | Authentication |
| **Multer** | 1.4+ | File Uploads |

### Machine Learning
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11+ | ML Runtime |
| **TensorFlow** | 2.15+ | Deep Learning |
| **Scikit-learn** | Latest | ML Utilities |
| **Pandas** | Latest | Data Processing |
| **NumPy** | Latest | Numerical Computing |
| **OR-Tools** | Latest | Optimization |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **PostCSS** | CSS Processing |
| **Autoprefixer** | CSS Vendor Prefixes |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://python.org/) (v3.11 or higher)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://cloud.mongodb.com/) account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PranavTechie21/ThroughputAI.git
   cd ThroughputAI
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   cd ML
   pip install tensorflow pandas numpy scikit-learn joblib ortools
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env with your MongoDB Atlas credentials
   # See docs/MongoDB-Atlas-Setup.md for detailed instructions
   ```

5. **Set up MongoDB Atlas**
   - Follow the guide in `docs/MongoDB-Atlas-Setup.md`
   - Update your `.env` file with the connection string

### Running the Application

1. **Start the backend server**
   ```bash
   npm run server
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

4. **Login credentials**
   - Username: `user`
   - Password: `password`

---

## 📁 Project Structure

```
ThroughputAI/
├── docs/                        # Documentation
│   ├── MongoDB-Atlas-Setup.md   # Database setup guide
│   ├── Attributions.md          # Third-party credits
│   └── Guidelines.md            # Development guidelines
├── ML/                          # Machine Learning
│   ├── models/                  # Trained model files
│   │   ├── multi_task_model.h5  # Neural network model
│   │   ├── preprocessor.joblib  # Data preprocessor
│   │   ├── delay_scaler.joblib  # Delay prediction scaler
│   │   └── throughput_scaler.joblib # Throughput scaler
│   ├── predict.py               # Prediction API
│   ├── train.py                 # Model training
│   └── model.ipynb              # Development notebook
├── server/                      # Backend API
│   └── index.js                 # Express server
├── src/                         # Frontend source
│   ├── components/              # React components
│   │   ├── ui/                  # Base UI components
│   │   ├── PredictionDashboard.tsx # Main predictions view
│   │   ├── InputDataPanel.tsx   # Train data input
│   │   └── ControllerMessage.tsx # AI recommendations
│   ├── pages/                   # Application pages
│   │   ├── DashboardHomePage.tsx # Home dashboard
│   │   ├── Configuration.tsx    # Input configuration
│   │   ├── Analytics.tsx        # Data analytics
│   │   └── Login.tsx            # Authentication
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom hooks
│   ├── utils/                   # Utility functions
│   └── App.tsx                  # Main app component
├── .env.example                 # Environment template
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/predict` | POST | ML prediction generation |
| `/api/files/upload` | POST | File upload |
| `/api/files/:id` | GET | File download |

---

## 🤖 Machine Learning Features

### Multi-Task Neural Network
- **Delay Prediction**: Forecasts train delays in minutes
- **Conflict Detection**: Probability of scheduling conflicts
- **Throughput Optimization**: Network efficiency metrics

### AI Scheduler
- **Platform Assignment**: Optimal platform allocation
- **Schedule Optimization**: Minimizes delays and conflicts
- **Real-time Recommendations**: Actionable scheduling suggestions

### Data Processing
- **Feature Engineering**: Time-based and categorical features
- **Scaling & Normalization**: Standardized data preprocessing
- **Model Persistence**: Joblib serialization for fast loading

---

## 🎨 UI Components

The application features a comprehensive design system with 45+ reusable components:

- **Navigation**: Responsive header, sidebar, breadcrumbs
- **Data Display**: Cards, tables, charts, progress indicators
- **Forms**: Inputs, selects, switches, sliders
- **Feedback**: Alerts, toasts, loading states
- **Overlays**: Modals, popovers, tooltips

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run server       # Start backend server
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Building for Production

```bash
# Build frontend
npm run build

# The built files will be in the `dist/` directory
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Atlas (required)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/railway_dashboard

# JWT Secret (required for auth)
JWT_SECRET=your-secure-jwt-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend API URL
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testing the ML Integration

1. **Navigate to Configuration page** (default after login)
2. **Fill in train parameters:**
   - Train Type: Express, Local, Freight, etc.
   - Section ID: sc_1, sc_2, etc.
   - Priority: Low (1) to High (3)
   - Scheduled times
   - Platform availability
   - Signal status
   - Track capacity

3. **Click "Run Prediction"**
4. **View results in Home dashboard:**
   - Live prediction metrics
   - AI recommendations in control action card
   - Visualization charts

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder

### Backend (Railway/Render)
1. Deploy the `server/` directory
2. Set environment variables in hosting platform
3. Ensure Python dependencies are available for ML predictions

### Database
- MongoDB Atlas (cloud) - recommended
- Handles authentication, file uploads, and application data

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

See [CONTRIBUTING.md](docs/Guidelines.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Indian Railways** for domain expertise and inspiration
- **Ministry of Railways** for supporting digital transformation
- **Open Source Community** for the amazing tools and libraries

---

<div align="center">

**Built with ❤️ for smarter railway operations**

*ThroughputAI - Powering the future of Indian Railways*

</div>
