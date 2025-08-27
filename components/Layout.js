// src/components/Layout.js
'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout, isAuthenticated, loading } = useAuth();

  // Show loading while auth is being initialized
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              JobPortal
            </Link>
            
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Jobs
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                    Profile
                  </Link>
                  
                  {/* 🆕 ADD THIS: Admin link for admin users */}
                  {user?.email?.includes('admin') && (
                    <Link href="/admin" className="text-red-600 hover:text-red-700 font-medium">
                      Admin
                    </Link>
                  )}
                  
                  <span className="text-gray-500">Hi, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
