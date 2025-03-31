import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import NomadicLogo from "@/components/NomadicLogo";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register form schema
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Login() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { login, register, signInWithGoogle, signInWithTwitter } = useAuth();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.email, values.password);
      toast({
        title: "Login successful",
        description: "Welcome back to DashMetrics!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle register form submission
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await register(values.email, values.password, values.fullName);
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to DashMetrics!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle Twitter sign in
  const handleTwitterSignIn = async () => {
    try {
      await signInWithTwitter();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Twitter sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Initialize the client-side window object for the AnimatedShapes component
  const [windowLoaded, setWindowLoaded] = useState(false);
  
  useEffect(() => {
    setWindowLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-nomadic-darkblue/90 to-nomadic-purple/70 overflow-hidden flex flex-col md:flex-row">
      {/* Floating elements */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-16 h-16 rounded-full bg-nomadic-blue/20 backdrop-blur-md z-0"
        animate={{
          y: [0, -15, 0],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-nomadic-crystal/20 backdrop-blur-md z-0"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute top-[30%] left-[25%] w-24 h-24 rounded-full bg-nomadic-leaf/10 backdrop-blur-md z-0"
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Left side - Brand section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        <div className="absolute inset-0">
          {/* Crystal pattern background */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                 backgroundSize: '180px 180px',
               }}>
          </div>
          
          {/* Add a darker overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl md:mx-8 md:my-12"></div>
        </div>
        
        <motion.div 
          className="relative z-10 max-w-md w-full bg-black/40 p-8 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NomadicLogo className="h-16 w-auto" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-4 text-white crystal-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            DashMetrics
          </motion.h1>
          
          <motion.p 
            className="text-lg font-medium text-white mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover insights from your social media with our AI-powered analytics platform.
          </motion.p>
          
          <div className="hidden md:block">
            <motion.div 
              className="crystal-separator my-8"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, delay: 0.5 }}
            />
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="w-10 h-10 rounded-full bg-nomadic-blue/30 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">Advanced Analytics</h3>
                  <p className="text-sm text-white">Comprehensive data analysis across all your social channels</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="w-10 h-10 rounded-full bg-nomadic-purple/30 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">AI-Powered Insights</h3>
                  <p className="text-sm text-white">Intelligent recommendations to optimize your content</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="w-10 h-10 rounded-full bg-nomadic-leaf/30 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">Unified Dashboard</h3>
                  <p className="text-sm text-white">All your metrics in one customizable interface</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Form section */}
      <div className="md:w-1/2 bg-nomadic-darkblue/30 backdrop-blur-md flex items-center justify-center p-8 md:p-12 relative">
        {/* Crystal decoration */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-nomadic-crystal/20 filter blur-xl"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-nomadic-blue/20 filter blur-xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md relative z-10 crystal-card p-8"
        >
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-1 text-nomadic-darkblue">Welcome Explorer</h2>
            <p className="text-nomadic-darkblue/70">Begin your journey with DashMetrics</p>
          </motion.div>
          
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="crystal-tabs grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="login" 
                className="text-sm font-medium"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-sm font-medium"
              >
                Create account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-5">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-nomadic-darkblue text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your@email.com" 
                            {...field} 
                            className="bg-white/60 border border-nomadic-blue/20 py-5 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-nomadic-blue/40 text-nomadic-darkblue shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-nomadic-darkblue text-sm font-medium">Password</FormLabel>
                          <a href="#" className="text-xs text-nomadic-blue hover:text-nomadic-blue/80">Forgot password?</a>
                        </div>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="bg-white/60 border border-nomadic-blue/20 py-5 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-nomadic-blue/40 text-nomadic-darkblue shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2"
                  >
                    <Button 
                      type="submit"
                      className="w-full py-5 rounded-md font-medium" 
                      style={{
                        background: "linear-gradient(135deg, #8C6EA9 0%, #6A6BCC 100%)",
                        color: "white",
                        boxShadow: "0 4px 15px rgba(106,107,204,0.3)",
                        border: "none"
                      }}
                    >
                      Sign in
                    </Button>
                  </motion.div>
                </form>
              </Form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-nomadic-darkblue/20"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-nomadic-darkblue/70 uppercase tracking-wider text-[10px] font-medium">
                    or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="crystal-button w-full py-5 rounded-md"
                    style={{
                      backgroundColor: "white", 
                      color: "#2c2e6d", 
                      border: "1px solid rgba(106,107,204,0.3)",
                      boxShadow: "0 3px 10px rgba(106,107,204,0.15)"
                    }}
                  >
                    <svg 
                      className="h-5 w-5 mr-2" 
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTwitterSignIn}
                    className="crystal-button w-full py-5 rounded-md"
                    style={{
                      backgroundColor: "white", 
                      color: "#2c2e6d", 
                      border: "1px solid rgba(106,107,204,0.3)",
                      boxShadow: "0 3px 10px rgba(106,107,204,0.15)"
                    }}
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-[#1DA1F2]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-5">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-nomadic-darkblue text-sm font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className="bg-white/60 border border-nomadic-blue/20 py-5 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-nomadic-blue/40 text-nomadic-darkblue shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-nomadic-darkblue text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your@email.com" 
                            {...field} 
                            className="bg-white/60 border border-nomadic-blue/20 py-5 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-nomadic-blue/40 text-nomadic-darkblue shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-nomadic-darkblue text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="bg-white/60 border border-nomadic-blue/20 py-5 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-nomadic-blue/40 text-nomadic-darkblue shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-nomadic-darkblue text-sm font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="bg-white/60 border border-nomadic-blue/20 py-5 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-nomadic-blue/40 text-nomadic-darkblue shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2"
                  >
                    <Button 
                      type="submit"
                      className="w-full py-5 rounded-md font-medium"
                      style={{
                        background: "linear-gradient(135deg, #8C6EA9 0%, #6A6BCC 100%)",
                        color: "white",
                        boxShadow: "0 4px 15px rgba(106,107,204,0.3)",
                        border: "none"
                      }}
                    >
                      Create account
                    </Button>
                  </motion.div>
                </form>
              </Form>
              
              <div className="text-center mt-4">
                <p className="text-xs text-nomadic-darkblue/60">
                  By creating an account, you agree to our <a href="#" className="text-nomadic-blue hover:text-nomadic-blue/70">Terms of Service</a> and <a href="#" className="text-nomadic-purple hover:text-nomadic-purple/70">Privacy Policy</a>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}