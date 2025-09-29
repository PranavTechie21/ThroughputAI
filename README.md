<h1 align="center">🚂 ThroughputAI - Railway Control Center 🚆</h1>

<p align="center">
  A sophisticated AI-powered Railway Control Center dashboard providing real-time operations management, predictive analytics, and intelligent decision support for train scheduling and throughput optimization.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow">
</p>

---

## ✨ Features

- **🎛️ AI-Powered Control Center**: Advanced railway operations dashboard with real-time monitoring and intelligent recommendations
- **🧠 Predictive Analytics**: Multi-task machine learning models for delay prediction, conflict detection, and throughput optimization
- **📊 Interactive Dashboards**: Real-time visualization of train schedules, delays, conflicts, and system performance metrics
- **⚡ High-Priority Alerts**: Intelligent controller messages with actionable recommendations and confidence scores
- **📈 Advanced Visualizations**: Interactive charts built with Recharts for trend analysis and performance monitoring
- **🏆 Achievement Tracking**: Performance milestones and system efficiency achievements
- **📚 Controller Records**: Comprehensive historical data and decision tracking
- **🎨 Modern UI/UX**: Responsive design with dark/light themes, animations, and accessibility features
- **🌐 Multi-language Support**: Internationalization with context-based translations
- **🔐 Secure Authentication**: JWT-based login system with role-based access
- **⚙️ Configuration Management**: System settings and parameter tuning interface

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible, unstyled components
- **Framer Motion** for smooth animations and transitions
- **Recharts** for data visualization
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **CORS** for cross-origin resource sharing
- **Multer** for file upload handling

### Machine Learning
- **Python** with TensorFlow/Keras
- **Scikit-learn** for preprocessing and scaling
- **Joblib** for model serialization
- **Multi-task neural networks** for simultaneous prediction tasks

### Development Tools
- **TypeScript** for enhanced developer experience
- **ESLint** and **Prettier** for code quality
- **Autoprefixer** and **PostCSS** for CSS processing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Python** (v3.8 or later)
- **pip** for Python package management
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PranavTechie21/ThroughputAI.git
   cd ThroughputAI
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Install machine learning dependencies:**
   ```bash
   cd ML
   pip install -r requirements.txt
   cd ..
   ```

### Configuration

1. **Environment Variables:** Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/throughputai
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

2. **ML Models:** Ensure pre-trained models are in the `ML/models/` directory

### Running the Application

1. **Start the backend server:**
   ```bash
   npm run server
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

4. **Login Credentials:**
   - Username: `user`
   - Password: `password`

---

## 📂 Project Structure

```
ThroughputAI/
├── 📁 docs/                     # Documentation files
│   ├── Attributions.md          # Third-party attributions
│   └── Guidelines.md            # Development guidelines
├── 📁 ML/                       # Machine Learning pipeline
│   ├── 📁 models/               # Trained model files
│   │   ├── delay_scaler.joblib         # Delay prediction scaler
│   │   ├── multi_task_model.h5         # Multi-task neural network
│   │   ├── preprocessor.joblib         # Data preprocessor
│   │   └── throughput_scaler.joblib    # Throughput scaler
│   ├── model.ipynb              # Model development notebook
│   ├── predict.py               # Prediction inference script
│   ├── train.py                 # Model training script
│   └── train_level_dataset.csv  # Training dataset
├── 📁 server/                   # Backend API server
│   └── index.js                 # Express server configuration
├── 📁 src/                      # Frontend source code
│   ├── 📁 components/           # React components
│   │   ├── 📁 ui/               # Reusable UI components (45+ components)
│   │   │   ├── button.tsx       # Button component
│   │   │   ├── card.tsx         # Card component
│   │   │   ├── chart.tsx        # Chart wrapper
│   │   │   ├── tabs.tsx         # Tab component
│   │   │   └── ...              # Many more UI components
│   │   ├── AchievementsSection.tsx      # Achievement tracking
│   │   ├── ControllerMessage.tsx        # High-priority alerts
│   │   ├── ControllerRecordsSection.tsx # Historical records
│   │   ├── DataVisualization.tsx        # Data visualization
│   │   ├── InputDataPanel.tsx           # Data input interface
│   │   ├── LanguageSwitcher.tsx         # Language selection
│   │   ├── PredictionDashboard.tsx      # Main prediction display
│   │   ├── ThemeToggle.tsx              # Dark/light mode toggle
│   │   ├── TrendsSection.tsx            # Trend analysis
│   │   └── VisualizationCharts.tsx      # Interactive charts
│   ├── 📁 contexts/             # React context providers
│   │   └── LanguageContext.tsx  # Internationalization context
│   ├── 📁 hooks/                # Custom React hooks
│   │   └── useTranslation.ts    # Translation hook
│   ├── 📁 pages/                # Application pages/routes
│   │   ├── Achievements.tsx     # Achievements page
│   │   ├── Analytics.tsx        # Analytics dashboard
│   │   ├── Configuration.tsx    # System configuration
│   │   ├── DashboardHomePage.tsx # Main dashboard
│   │   ├── Login.tsx            # Authentication page
│   │   ├── Records.tsx          # Records management
│   │   ├── SystemStatus.tsx     # System status monitoring
│   │   ├── Trends.tsx           # Trend analysis page
│   │   └── Upload.tsx           # Main application container
│   ├── 📁 styles/               # Global styles
│   │   └── globals.css          # Global CSS styles
│   ├── 📁 utils/                # Utility functions
│   │   └── translations.ts      # Translation utilities
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Base styles
│   └── main.tsx                 # Application entry point
├── 📄 index.html                # HTML template
├── 📄 LICENSE                   # MIT license
├── 📄 package.json              # Dependencies and scripts
├── 📄 README.md                 # Project documentation
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 tsconfig.node.json        # TypeScript Node configuration
└── 📄 vite.config.ts            # Vite build configuration
```

---

## 🎯 Key Components

### Machine Learning Pipeline
- **Multi-task Model**: Simultaneous prediction of delays, conflicts, and throughput
- **Feature Engineering**: Advanced preprocessing and scaling
- **Real-time Inference**: Fast prediction API for live decision support

### Control Center Dashboard
- **Live Operations View**: Real-time train status and system metrics
- **Predictive Insights**: AI-driven recommendations and alerts
- **Historical Analysis**: Trend tracking and performance analytics

### User Interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Accessibility**: WCAG-compliant components and keyboard navigation
- **Performance**: Optimized with lazy loading and efficient rendering

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### Predictions
- `POST /api/predict` - Generate ML predictions
- `GET /api/predictions/history` - Historical prediction data

### Data Management
- `POST /api/data/upload` - Upload training data
- `GET /api/data/export` - Export system data

---

## 🧪 Development

### Building for Production
```bash
npm run build
```

### Type Checking
```bash
npx tsc --noEmit
```

### Running Tests
```bash
npm test
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/Guidelines.md) for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Development workflow

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Indian Railways** for inspiration and domain expertise
- **Ministry of Railways** for supporting railway digitization initiatives
- Open source community for the amazing tools and libraries

For detailed attributions, see [Attributions.md](docs/Attributions.md).

---

<p align="center">
  <b>Built with ❤️ for smarter railway operations</b>
</p>
