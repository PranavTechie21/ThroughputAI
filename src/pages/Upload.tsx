
import { useState, useEffect } from 'react';
import { VisualizationCharts } from '../components/VisualizationCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Activity, AlertTriangle, Settings } from 'lucide-react';
import { InputDataPanel } from '../components/InputDataPanel';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '../components/ui/menubar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import { ControllerMessage } from '../components/ControllerMessage';
import { PredictionDashboard } from '../components/PredictionDashboard';
import { Toaster } from '../components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import LandingPage from './LandingPage';

// Mock data for demonstration
const mockPredictionData = {
  delay: {
    minutes: 14,
    confidence: 95.2,
    status: 'warning' as const // green, warning, danger
  },
  conflict: {
    probability: 25,
    risk: 'medium' as const, // low, medium, high
    confidence: 88.9
  },
  throughput: {
    target: 92,
    current: 85,
    trend: '+7.2%'
  }
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


// Placeholder components for new sections
const SystemStatus = () => (
  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">System Status</CardTitle>
      <CardDescription className="text-slate-600 dark:text-slate-400">Overview of current system status</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Detailed system status information would be displayed here.</p>
    </CardContent>
  </Card>
);

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [predictions, setPredictions] = useState(mockPredictionData);
  const [controllerMessage] = useState(mockControllerMessage);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight variations in predictions
      setPredictions(prev => ({
        delay: {
          ...prev.delay,
          minutes: Math.max(0, prev.delay.minutes + (Math.random() - 0.5) * 2),
          confidence: Math.max(70, Math.min(99, prev.delay.confidence + (Math.random() - 0.5) * 5))
        },
        conflict: {
          ...prev.conflict,
          probability: Math.max(0, Math.min(100, prev.conflict.probability + (Math.random() - 0.5) * 5)),
          confidence: Math.max(70, Math.min(99, prev.conflict.confidence + (Math.random() - 0.5) * 3))
        },
        throughput: {
          ...prev.throughput,
          current: Math.max(60, Math.min(100, prev.throughput.current + (Math.random() - 0.5) * 3)),
          target: Math.max(70, Math.min(100, prev.throughput.target + (Math.random() - 0.5) * 2))
        }
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn && (window.location.hash === '#/login' || window.location.hash === '')) {
      window.location.hash = '#/';
    }

    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.hash = '#/login';
    setIsLoggedIn(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (!isLoggedIn) {
    if (currentPath === '#/login') {
      return <Login onLoginSuccess={() => {
        setIsLoggedIn(true);
        window.location.hash = '#/';
      }} />;
    }
    // Show landing page when not logged in and not on login page
    return <LandingPage />;
  }

  if (currentPath === '#/login') {
    window.location.hash = '#/';
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500 scroll-smooth"
    >
      {/* Modern Header */}
      <motion.header 
        variants={itemVariants}
        className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  {/* Replace the Train icon with the Ministry of Railways logo */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Indian_Railways.svg/1200px-Indian_Railways.svg.png"
                    alt="Ministry of Railways Logo"
                    className="h-10 w-auto"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Railway Control Center
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    AI-Powered Operations Dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-700">
                Live • {lastUpdated.toLocaleTimeString()}
              </div>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
              <ThemeToggle isDark={isDarkMode} onToggle={toggleDarkMode} />
            </div>
          </div>

          {/* Navbar with many options and a menubar */}
          <div className="mt-4 flex items-center justify-between">
            <nav className="flex flex-wrap items-center gap-2">
              <a href="#/" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">Home</a>
              <a href="#configuration" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">Configuration</a>
              <a href="#analytics" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">Analytics</a>
              <a href="#status" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition">System Status</a>
              {/* Removed Trends, Achievements, and Controller Records from nav */}
            </nav>
            <div className="hidden md:flex">
              <Menubar className="bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md">
                <MenubarMenu>
                  <MenubarTrigger>Insights</MenubarTrigger>
                  <MenubarContent align="end">
                    {/* Removed Trends, Achievements, and Controller Records from Upload Menubar */}
                    <MenubarSeparator />
                    <MenubarItem asChild>
                      <a href="#analytics">Open Analytics</a>
                    </MenubarItem>
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
          <div id="top"></div>
          {/* Critical Alert Section */}
          <motion.div variants={itemVariants}>
            <ControllerMessage message={controllerMessage} />
          </motion.div>

          {/* Core Dashboard */}
          <motion.div variants={itemVariants}>
            <PredictionDashboard predictions={predictions} />
          </motion.div>

          {/* Secondary Features */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-1">
              <TabsTrigger id="configuration" value="input" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white" onClick={() => setActiveTab('input')}>
                <Settings className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
              <TabsTrigger id="analytics" value="charts" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white" onClick={() => setActiveTab('charts')}>
                <Activity className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger id="status" value="status" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white" onClick={() => setActiveTab('status')}>
                <AlertTriangle className="h-4 w-4" />
                <span>System Status</span>
              </TabsTrigger>
              {/* Removed Trends, Achievements, and Controller Records tabs */}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="input" className="mt-8">
                  <InputDataPanel onPredict={(data) => console.log('Predicting with:', data)} />
                </TabsContent>

                <TabsContent value="charts" className="mt-8">
                  <VisualizationCharts predictions={predictions} />
                </TabsContent>

                <TabsContent value="status" className="mt-8">
                  <SystemStatus />
                </TabsContent>

              </motion.div>
            </AnimatePresence>
            </Tabs>
          </motion.div>
          
          {/* New Sections */}
          {/* Removed Trends, Achievements, and Controller Records sections */}
        </motion.div>
        <Toaster />
      </motion.div>
    );
  }
