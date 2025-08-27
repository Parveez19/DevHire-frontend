'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/api';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Check if user is admin (you can enhance this check)
    if (!user?.email?.includes('admin')) {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your job portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats.totalJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardData?.stats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboardData?.stats.totalUsers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/admin/jobs" className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors">
          <h3 className="text-xl font-semibold mb-2">📋 Manage Jobs</h3>
          <p>Add, edit, or delete job postings</p>
        </Link>
        <Link href="/admin/applications" className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors">
          <h3 className="text-xl font-semibold mb-2">📄 View Applications</h3>
          <p>Review and manage job applications</p>
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
        <div className="space-y-4">
          {dashboardData?.recentJobs.map((job) => (
            <div key={job._id} className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company} • {job.location}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
