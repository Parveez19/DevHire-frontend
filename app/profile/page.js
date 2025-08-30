'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/api';  // <- Correct import (default)

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchApplications();
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications'); // <- Use 'api' not 'apiFetch'
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        
        {/* User Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Applications</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven&apos;t applied to any jobs yet.</p>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Browse Jobs →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        <Link 
                          href={`/jobs/${application.jobId._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {application.jobId.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600">{application.jobId.company}</p>
                      <p className="text-sm text-gray-500">
                        📍 {application.jobId.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
