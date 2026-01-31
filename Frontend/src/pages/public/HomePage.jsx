import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import Button from '../../components/common/Button';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Comprehensive employee lifecycle management from onboarding to offboarding',
    },
    {
      icon: Clock,
      title: 'Attendance Tracking',
      description: 'Real-time attendance monitoring with automated punch-in/out system',
    },
    {
      icon: Calendar,
      title: 'Leave Management',
      description: 'Streamlined leave application and approval process',
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reports',
      description: 'Powerful insights and reports for data-driven decisions',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control',
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Monitor and evaluate employee performance effectively',
    },
  ];

  const stats = [
    { value: '500+', label: 'Companies Trust Us' },
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  const benefits = [
    'Automated attendance and leave management',
    'Comprehensive recruitment pipeline',
    'Real-time workforce analytics',
    'Mobile-friendly interface',
    'Customizable workflows',
    'Advanced reporting capabilities',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={24} />
              </div>
              <span className="text-sm md:text-xl font-bold text-gray-800">HR Nexus</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-gray-600 hover:text-primary-600 transition-colors">
                Benefits
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                Contact
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center *:text-xs *:md:text-base gap-3">
              <Button
                variant="outline"
                icon={LogIn}
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button
                variant="primary"
                icon={UserPlus}
                onClick={() => navigate('/apply')}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-6">
                <Zap size={16} />
                <span>Powering Modern HR Management</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Simplify Your
                <span className="text-primary-600"> HR Operations</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                All-in-one HR management platform designed to streamline employee lifecycle, 
                attendance, leaves, and recruitment processes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  variant="primary"
                  size="lg"
                  icon={UserPlus}
                  onClick={() => navigate('/apply')}
                  className="text-lg"
                >
                  Apply for a Position
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={LogIn}
                  onClick={() => navigate('/login')}
                  className="text-lg"
                >
                  Employee/HR Login
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-2 transition-transform">
                      <Users className="text-primary-600 mb-2" size={32} />
                      <p className="font-semibold text-gray-800">Employee Management</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-2 transition-transform delay-75">
                      <Clock className="text-green-600 mb-2" size={32} />
                      <p className="font-semibold text-gray-800">Attendance</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-2 transition-transform delay-150">
                      <Calendar className="text-blue-600 mb-2" size={32} />
                      <p className="font-semibold text-gray-800">Leave Management</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-2 transition-transform delay-200">
                      <TrendingUp className="text-purple-600 mb-2" size={32} />
                      <p className="font-semibold text-gray-800">Analytics</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern HR
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your workforce efficiently in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Choose HR Nexus?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your HR operations with our comprehensive platform designed 
                for businesses of all sizes.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => navigate('/apply')}
                >
                  Join Our Team
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Employee Onboarding</p>
                      <p className="text-sm text-gray-500">Streamlined process</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Attendance Rate</p>
                      <p className="text-sm text-gray-500">This month</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-800">98.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Submit your application today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              icon={UserPlus}
              onClick={() => navigate('/apply')}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Apply for a Position
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={LogIn}
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Login to Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">hr@hrnexus.com</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Business Ave, Suite 100</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Building2 className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">HR Nexus</span>
              </div>
              <p className="text-gray-400">
                Empowering organizations with modern HR solutions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="/apply" className="hover:text-white transition-colors">Apply Now</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: hr@hrnexus.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Business Ave</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HR Nexus. All rights reserved. Built by Shubham Raj</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;