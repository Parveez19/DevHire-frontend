import { useState, useEffect } from 'react';

const JobFilters = ({ onFilter, totalJobs }) => {
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    location: '',
    experience: '',
    type: '',
    salary: ''
  });

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch filter options
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/jobs/filter-options');
      const data = await response.json();
      setCompanies(data.companies || []);
      setLocations(data.locations || []);
    } catch (error) {
      console.error('Filter options error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      company: '',
      location: '',
      experience: '',
      type: '',
      salary: ''
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Jobs
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Job title, skills, company..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Company */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company
        </label>
        <select
          value={filters.company}
          onChange={(e) => handleFilterChange('company', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Companies</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level
        </label>
        <select
          value={filters.experience}
          onChange={(e) => handleFilterChange('experience', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Levels</option>
          <option value="Fresher">Fresher (0-1 years)</option>
          <option value="Junior">Junior (1-3 years)</option>
          <option value="Mid">Mid Level (3-7 years)</option>
          <option value="Senior">Senior (7+ years)</option>
        </select>
      </div>

      {/* Job Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Type
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value=""
              checked={filters.type === ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="mr-2"
            />
            All Types
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="portal"
              checked={filters.type === 'portal'}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="mr-2"
            />
            Apply on Portal
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="company"
              checked={filters.type === 'company'}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="mr-2"
            />
            Company Website
          </label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{totalJobs}</span> jobs found
        </p>
      </div>
    </div>
  );
};

export default JobFilters;
