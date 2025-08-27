'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../utils/api';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs...'); // Debug log
      const response = await api.get('/api/jobs');
      console.log('Jobs response:', response.data); // Debug log
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchJobs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600">
          Discover thousands of opportunities from top companies
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No jobs found.</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            Add Jobs (Admin) →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

// Job Card Component
function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>
            <p className="text-lg text-blue-600 font-medium mb-1">
              {job.company}
            </p>
            <p className="text-gray-600">
              📍 {job.location}
            </p>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm ${
            job.type === 'portal' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {job.type === 'portal' ? '📝 Apply on Portal' : '🔗 Company Website'}
          </span>
        </div>

        {job.salary && (
          <p className="text-green-600 font-medium mb-2">💰 {job.salary}</p>
        )}

        <p className="text-gray-700 mb-4">
          {job.description.substring(0, 200)}...
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </span>
          <span className="text-blue-600 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
