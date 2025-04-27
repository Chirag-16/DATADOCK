import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Globe, Zap, ShieldCheck, BarChart2, RefreshCw, Server, AlertCircle } from 'lucide-react';
import dashboard from "../../dashboard.png"
import { useNavigate } from 'react-router-dom';


const stats = [
  { value: "99.98%", label: "Uptime Accuracy" },
  { value: "379ms", label: "Avg. Response Time" },
  { value: "24/7", label: "Monitoring" },
  { value: "98.39%", label: "Global Uptime" }
];

const features = [
  {
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    title: "Real-time Monitoring",
    description: "Get instant alerts when your website goes down or performance degrades."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
    title: "Security Checks",
    description: "Monitor SSL certificates, domain expiration, and security headers."
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-purple-400" />,
    title: "Performance Metrics",
    description: "Track response times, uptime history, and performance trends."
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-orange-400" />,
    title: "Scheduled Checks",
    description: "Configure monitoring intervals from 1 minute to 1 hour."
  },
  {
    icon: <Server className="w-8 h-8 text-red-400" />,
    title: "Multi-region Checks",
    description: "Monitor from multiple global locations for accurate results."
  },
  {
    icon: <AlertCircle className="w-8 h-8 text-yellow-400" />,
    title: "Active Alerts",
    description: "Get notified immediately when issues are detected."
  }
];

const monitoredWebsites = [
  { url: "example.com", status: "UP", responseTime: 124, uptime: "99.95%", lastChecked: "2 min ago" },
  { url: "prod-server.io", status: "UP", responseTime: 89, uptime: "99.95%", lastChecked: "3 min ago" },
  { url: "demo-app.com", status: "DOWN", responseTime: 533, uptime: "98.2%", lastChecked: "5 min ago" },
  { url: "dev-server.io", status: "UP", responseTime: 110, uptime: "99.7%", lastChecked: "4 min ago" },
  { url: "api.test.org", status: "DOWN", responseTime: 1243, uptime: "92.5%", lastChecked: "1 min ago" },
  { url: "marketing.company.com", status: "UP", responseTime: 178, uptime: "99.95%", lastChecked: "2 min ago" }
];

const Landing = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black-950 text-black-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black-900 to-gray-800 border-b border-gray-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:100px_100px]"></div>
        </div>
        
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
             <div><span className="font-bold tracking-wider 
              bg-[length:200%_auto] 
              bg-gradient-to-r from-cyan-300 via-purple-500 to-violet-600 
              text-transparent bg-clip-text
              drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]
              hover:drop-shadow-[0_0_20px_rgba(167,139,250,0.9)]
              animate-[gradientShift_3s_ease_infinite]">
    DATADOCK
</span></div> 
               Website Monitoring <span className="text-violet-400">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-black-300 mb-10">
              Get real-time insights into your website's performance and uptime with our powerful monitoring platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-violet-700 hover:bg-violet-700 text-lg px-8 py-6" 
              onClick={() => navigate("/dashboard")}>
                Get Started - It's Free
              </Button>
              
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
        />
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 py-16 border-b border-black-800">
        <div className="container mx-auto px-6">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-center p-6 bg-black-800 rounded-lg border border-black-700 hover:border-violet-500 transition-colors"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStat === index ? stat.value : "empty"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-violet-400 mb-2"
                  >
                    {currentStat === index ? stat.value : ""}
                  </motion.div>
                </AnimatePresence>
                <p className="text-black-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-950 py-20 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Monitoring Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to ensure your websites are always available and performing optimally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-gray-800 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Demo Section */}
      <div className="bg-gray-950 py-20 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Real-time Status Dashboard</h2>
              <p className="text-xl text-gray-400 mb-8">
                Monitor all your websites from a single, intuitive dashboard with detailed performance metrics.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mr-4 mt-1">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Global Monitoring Network</h3>
                    <p className="text-gray-400">Checks from multiple locations worldwide for accurate results</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mr-4 mt-1">
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instant Alerts</h3>
                    <p className="text-gray-400">Get notified immediately via email, SMS, or Slack when issues arise</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mr-4 mt-1">
                    <BarChart2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Historical Data</h3>
                    <p className="text-gray-400">Track performance trends and uptime history over time</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800"
            >
              <div className="p-4 bg-gray-800 flex items-center border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-sm text-gray-400">dashboard.monitorservice.com</div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-medium">Website Status Overview</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-400 bg-green-900/30 px-2 py-1 rounded">4 UP</span>
                    <span className="text-sm text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">1 DEGRADED</span>
                    <span className="text-sm text-red-400 bg-red-900/30 px-2 py-1 rounded">1 DOWN</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {monitoredWebsites.map((site, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${site.status === "UP" ? "bg-green-500" : "bg-red-500"}`}></div>
                        <div>
                          <div className="text-white">{site.url}</div>
                          <div className="text-xs text-gray-500">Uptime: {site.uptime}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${site.status === "UP" ? "text-green-400" : "text-red-400"}`}>
                          {site.responseTime}ms
                        </span>
                        <span className="text-sm text-gray-500">{site.lastChecked}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Last updated: Just now</span>
                  <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                    View detailed analytics <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dashboard Screenshots Section */}
      <div className="bg-gray-950 py-20 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Monitoring Dashboard</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our intuitive dashboard gives you complete visibility into your website's health and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Dashboard Screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800"
            >
              <div className="p-4 bg-gray-800 flex items-center border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-sm text-gray-400">datadock.com</div>
              </div>
              <div className="p-4">
                <img 
                  src="/screenshots/websiteD.png"
                  alt="WebMonitor Dashboard"
                  className="w-full h-auto rounded-lg border border-gray-700"
                />
                <div className="mt-4 text-center text-gray-400">
                  Comprehensive overview of all monitored websites with status indicators
                </div>
              </div>
            </motion.div>

            {/* Secondary Screenshots in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Performance Monitoring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
              >
                <div className="p-3 bg-gray-800 border-b border-gray-700 text-sm text-gray-400">
                  Performance Monitoring
                </div>
                <div className="p-3">
                  <img 
                    src="/screenshots/performance.png"
                    alt="Performance Monitoring"
                    className="w-full h-auto rounded border border-gray-700"
                  />
                  <div className="mt-2 text-sm text-center text-gray-400">
                    Detailed response time metrics and history
                  </div>
                </div>
              </motion.div>

              {/* Website Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
              >
                <div className="p-3 bg-gray-800 border-b border-gray-700 text-sm text-gray-400">
                  Website Analytics
                </div>
                <div className="p-3">
                  <img 
                    src="/screenshots/dashboard1.png"
                    alt="Website Details"
                    className="w-full h-auto rounded border border-gray-700"
                  />
                  <div className="mt-2 text-sm text-center text-gray-400">
                    Individual website performance breakdown
                  </div>
                </div>
              </motion.div>

              {/* Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 md:col-span-2"
              >
                <div className="p-3 bg-gray-800 border-b border-gray-700 text-sm text-gray-400">
                  Alert Management
                </div>
                <div className="p-3">
                  <img 
                    src="/screenshots/alerts.png"
                    alt="Alert Management"
                    className="w-full h-20 rounded border border-gray-700"
                  
                  />
                  <div className="mt-2 text-sm text-center text-gray-400">
                    Centralized alert management with severity indicators
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-black-900 to-gray-800 py-20 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Monitor Your Websites?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses who trust our platform to keep their websites online and performing well.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8 py-6"
              onClick={() => navigate("/dashboard")}>
                Start Trial
              </Button>
             
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black-900 py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Website Monitoring Service. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Landing;