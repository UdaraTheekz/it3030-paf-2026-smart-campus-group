import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center glass-morphism p-12 rounded-3xl max-w-md">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-slate-400 mb-8">
          You do not have the necessary permissions to view this page.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-8 rounded-xl transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
