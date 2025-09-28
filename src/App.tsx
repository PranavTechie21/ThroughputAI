import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, Outlet } from 'react-router-dom';
import { VisualizationCharts } from './components/VisualizationCharts';
import { Train, Activity, AlertTriangle, TrendingUp, Settings, Award, FileText } from 'lucide-react';
import { InputDataPanel } from './components/InputDataPanel';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from './components/ui/menubar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { ThemeToggle } from './components/ThemeToggle';
import { ControllerMessage } from './components/ControllerMessage';
import { PredictionDashboard } from './components/PredictionDashboard';
import { Toaster } from './components/ui/toaster';
import { motion } from 'framer-motion';
import { TrendsSection } from './components/TrendsSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ControllerRecordsSection } from './components/ControllerRecordsSection';
import Login from './pages/Login';
import { ConfigurationPage } from './pages/Configuration';
import { AnalyticsPage } from './pages/Analytics';
import { SystemStatusPage } from './pages/SystemStatus';
import { TrendsPage } from './pages/Trends';
import { AchievementsPage } from './pages/Achievements';
import { RecordsPage } from './pages/Records';
import { DashboardHomePage } from './pages/DashboardHomePage';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTranslation } from './hooks/useTranslation';

// Mock data for demonstration
const mockPredictionData = {
  delay: { minutes: 14, confidence: 95.2, status: 'warning' },
  conflict: { probability: 25, risk: 'medium', confidence: 88.9 },
  throughput: { current: 85, potential: 92, trend: '+7.2%' }
};

const mockControllerMessage = {
  priority: 'High Priority',
  title: 'Recommendation: Let other Train Pass',
  body: 'Delay is about 14 mins. Let other Train Pass if its arrival time falls before the departure time.',
  expectedResult: 'average network delay reduced by ~2.5 minutes; throughput ↑ 7.2%.',
  reason: 'Allowing the other train to pass now prevents a longer hold later and reduces cascading delays.',
  confidence: 95,
  computeTime: 280,
  timestamp: new Date()
};

const mockTrendsMessage = {
  title: "Operational Trends",
  description: "Analysis of recent operational data shows a positive trend in on-time arrivals. Further details and historical data are available in the analytics section."
};

function Dashboard({ onLogout, isDarkMode, toggleDarkMode, predictionResult, handlePrediction, controllerMessage }) {
    const { t } = useTranslation();
    const [predictions, setPredictions] = useState(mockPredictionData);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        if (predictionResult) {
            setPredictions(predictionResult);
        }
    }, [predictionResult]);

    // Simulate real-time updates
    useEffect(() => {
        if (predictionResult) return; // Don't simulate if we have a real prediction
        const interval = setInterval(() => {
            setPredictions(prev => ({
                delay: { ...prev.delay, minutes: Math.max(0, prev.delay.minutes + (Math.random() - 0.5) * 2), confidence: Math.max(70, Math.min(99, prev.delay.confidence + (Math.random() - 0.5) * 5)) },
                conflict: { ...prev.conflict, probability: Math.max(0, Math.min(100, prev.conflict.probability + (Math.random() - 0.5) * 5)), confidence: Math.max(70, Math.min(99, prev.conflict.confidence + (Math.random() - 0.5) * 3)) },
                throughput: { ...prev.throughput, current: Math.max(60, Math.min(100, prev.throughput.current + (Math.random() - 0.5) * 3)), potential: Math.max(70, Math.min(100, prev.throughput.potential + (Math.random() - 0.5) * 2)) }
            }));
            setLastUpdated(new Date());
        }, 5000);
        return () => clearInterval(interval);
    }, [predictionResult]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500 scroll-smooth"
        >
            <motion.header
                variants={itemVariants}
                className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm"
            >
                <div className="container mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-xl shadow-lg">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Indian_Railways.svg/1200px-Indian_Railways.svg.png"
                                        alt="Ministry of Railways Logo"
                                        className="h-10 w-auto"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                        {t('railwayControlCenter')}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {t('aiPoweredDashboard')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-700">
                                {t('live')} • {lastUpdated.toLocaleTimeString()}
                            </div>
                            <LanguageSwitcher />
                            <Button onClick={onLogout} variant="outline">{t('logout')}</Button>
                            <ThemeToggle isDark={isDarkMode} onToggle={toggleDarkMode} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <nav className="flex flex-wrap items-center gap-2">
                            <Link to="/" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('home')}</Link>
                            <Link to="/configuration" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('configuration')}</Link>
                            <Link to="/analytics" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('analytics')}</Link>
                            <Link to="/status" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('systemStatus')}</Link>
                            <Link to="/trends" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('trends')}</Link>
                            <Link to="/achievements" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('achievements')}</Link>
                            <Link to="/records" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">{t('controllerRecords')}</Link>
                        </nav>
                        <div className="hidden md:flex">
                            <Menubar className="bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md">
                                <MenubarMenu>
                                    <MenubarTrigger>{t('insights')}</MenubarTrigger>
                                    <MenubarContent align="end">
                                        <MenubarItem asChild><Link to="/trends">{t('trends')}</Link></MenubarItem>
                                        <MenubarItem asChild><Link to="/achievements">{t('previousAchievements')}</Link></MenubarItem>
                                        <MenubarItem asChild><Link to="/records">{t('controllerRecords')}</Link></MenubarItem>
                                        <MenubarSeparator />
                                        <MenubarItem asChild><Link to="/analytics">{t('openAnalytics')}</Link></MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    </div>
                </div>
            </motion.header>
            <motion.div
                variants={containerVariants}
                className="container mx-auto px-6 py-8 space-y-8"
            >
                <Outlet context={{ predictions, controllerMessage, mockTrendsMessage, itemVariants, handlePrediction }} />
            </motion.div>
            <Toaster />
        </motion.div>
    );
}

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });
    const navigate = useNavigate();
    const [predictionResult, setPredictionResult] = useState(null);
    const [controllerMessage, setControllerMessage] = useState(mockControllerMessage);

    const handlePrediction = (result) => {
        const predictionData = JSON.parse(result.prediction);
        const newResult = {
            delay: { minutes: parseFloat(predictionData.predicted_delay), confidence: 95.2, status: 'warning' },
            conflict: { probability: parseFloat(predictionData.predicted_conflict_probability) * 100, risk: 'medium', confidence: 88.9 },
            throughput: { current: 85, potential: parseFloat(predictionData.predicted_throughput), trend: '+7.2%' }
        };
        setPredictionResult(newResult);

        if (predictionData.ai_recommendations && predictionData.ai_recommendations.length > 0) {
            const newControllerMessage = {
                ...mockControllerMessage,
                priority: 'High Priority',
                title: 'AI Recommendation',
                body: predictionData.ai_recommendations.join('\n'),
                timestamp: new Date(),
                confidence: newResult.conflict.confidence,
            };
            setControllerMessage(newControllerMessage);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/" element={isLoggedIn ? <Dashboard onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} predictionResult={predictionResult} handlePrediction={handlePrediction} controllerMessage={controllerMessage} /> : <Navigate to="/login" />}>
                <Route index element={<DashboardHomePage />} />
                <Route path="configuration" element={<ConfigurationPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="status" element={<SystemStatusPage />} />
                <Route path="trends" element={<TrendsPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="records" element={<RecordsPage />} />
            </Route>
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
        </Routes>
    );
}


export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}