'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';

export default function AdminJobs() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    experienceRequired: '',
    type: 'portal',
    applyLink: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.email?.includes('admin')) {
      router.push('/');
      return;
    }
    fetchJobs();
  }, [isAuthenticated, user]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/jobs?limit=100');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/jobs', formData);
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        salary: '',
        experienceRequired: '',
        type: 'portal',
        applyLink: ''
      });
      setShowAddForm(false);
      fetchJobs();
      alert('Job created successfully!');
    } catch (error) {
      alert('Error creating job: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await api.delete(`/api/jobs/${jobId}`);
      fetchJobs();
      alert('Job deleted successfully!');
    } catch (error) {
      alert('Error deleting job');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : '+ Add Job'}
        </button>
      </div>

      {/* Add Job Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={formData.title}
                onChange={handleChange}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="salary"
                placeholder="Salary Range"
                value={formData.salary}
                onChange={handleChange}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="experienceRequired"
                placeholder="Experience Required"
                value={formData.experienceRequired}
                onChange={handleChange}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="portal">Apply on Portal</option>
                <option value="company">Company Website</option>
              </select>
            </div>
            
            {formData.type === 'company' && (
              <input
                type="url"
                name="applyLink"
                placeholder="Company Application URL"
                value={formData.applyLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            
            <textarea
              name="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Create Job
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Jobs ({jobs.length})</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {job.description.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        job.type === 'portal' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {job.type === 'portal' ? 'Portal Apply' : 'Company Website'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
