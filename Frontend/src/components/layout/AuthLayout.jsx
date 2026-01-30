import React from 'react';
import { Building2 } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4 shadow-lg">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">HR Nexus</h1>
          <p className="text-gray-600 mt-2">Employee Management System</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 HR Nexus. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;