'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // ← Important for Next.js 15
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

export default function ApplyJob({ params }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // ✅ Fix for Next.js 15 params
  const { id } = use(params);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeFile: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (id) {
      fetchJob();
    }
  }, [id, isAuthenticated]);

  const fetchJob = async () => {
    try {
      console.log('Fetching job with ID:', id); // Debug log
      const response = await api.get(`/api/jobs/${id}`);
      setJob(response.data);
      
      // Check if user already applied
      const applicationsResponse = await api.get('/api/applications');
      const hasApplied = applicationsResponse.data.applications.some(
        app => app.jobId._id === id
      );
      setApplied(hasApplied);
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Job not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resumeFile: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (job.type === 'company') {
      // Redirect to company website
      window.open(job.applyLink || 'https://jobs.netflix.com/', '_blank');
      return;
    }

    setApplying(true);
    try {
      // Upload resume if provided
      let resumeUrl = null;
      if (applicationData.resumeFile) {
        const formData = new FormData();
        formData.append('resume', applicationData.resumeFile);
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/resume`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          resumeUrl = uploadData.resumeUrl;
        }
      }

      // Submit application
      await api.post('/api/applications', { 
        jobId: job._id,
        coverLetter: applicationData.coverLetter,
        resumeUrl 
      });
      
      setApplied(true);
      alert('Application submitted successfully! Check your email for confirmation.');
    } catch (error) {
      alert(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

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
        <p className="text-gray-500">Job not found</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  if (applied) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Already Submitted!</h1>
          <p className="text-gray-600 mb-6">You have already applied for this position.</p>
          <div className="space-y-4">
            <Link 
              href="/profile" 
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
            >
              View My Applications
            </Link>
            <Link 
              href="/" 
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Job</h1>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg">{job.title}</h2>
            <p className="text-gray-600">{job.company} • {job.location}</p>
            {job.salary && <p className="text-green-600 font-medium">💰 {job.salary}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              rows={6}
              value={applicationData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell the employer why you're interested in this position and what makes you a great fit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {/* Application Type Info */}
          {job.type === 'company' ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800">
                <strong>Note:</strong> This job requires applying on the company website. 
                Clicking submit will redirect you to their application page.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Portal Application:</strong> Your application will be submitted through JobPortal 
                and you'll receive an email confirmation.
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={applying}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                job.type === 'portal'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {applying ? 'Submitting...' : 
               job.type === 'portal' ? 'Submit Application' : 'Apply on Company Website'}
            </button>
            
            <Link
              href={`/jobs/${job._id}`}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
