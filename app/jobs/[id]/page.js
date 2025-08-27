'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // ← Import React's use hook
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

export default function JobDetails({ params }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  // ✅ FIX: Unwrap params using React.use()
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      fetchJob();
      checkApplicationStatus();
    }
  }, [id, isAuthenticated]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${id}`); // ← Use 'id' instead of 'params.id'
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/api/applications');
      const hasApplied = response.data.applications.some(
        app => app.jobId._id === id // ← Use 'id' instead of 'params.id'
      );
      setApplied(hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (job.type === 'company') {
      window.open(job.applyLink, '_blank');
      return;
    }

    router.push(`/apply/${job._id}`);
  };

  // ... rest of your component remains the same
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Job not found</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Job Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-blue-600">
                {job.company}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{job.location}</span>
            </div>
            {job.salary && (
              <div className="flex items-center text-green-600 font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>{job.salary}</span>
              </div>
            )}
            {job.experienceRequired && (
              <div className="flex items-center text-purple-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                </svg>
                <span>{job.experienceRequired}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.type === 'portal' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {job.type === 'portal' ? 'Apply on Portal' : 'Company Website'}
            </span>
            <span className="text-gray-500 text-sm">
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Job Description */}
        <div className="prose max-w-none mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {applied ? (
              <div className="flex items-center justify-center bg-green-100 text-green-800 px-6 py-3 rounded-lg font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Application Submitted
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  job.type === 'portal'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {applying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : (
                  job.type === 'portal' ? 'Apply Now' : 'Apply on Company Website'
                )}
              </button>
            )}
            
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
