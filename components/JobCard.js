import { useState } from 'react';
import Link from 'next/link';
// import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ jobId: job._id })
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>
            <p className="text-lg text-blue-600 font-medium mb-1">
              {job.company}
            </p>
            <p className="text-gray-600 mb-2">
              📍 {job.location}
            </p>
          </div>
          
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.salary && (
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              💰 {job.salary}
            </span>
          )}
          {job.experienceRequired && (
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              🎯 {job.experienceRequired}
            </span>
          )}
          <span className={`text-sm px-3 py-1 rounded-full ${
            job.type === 'portal' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {job.type === 'portal' ? '📝 Apply on Portal' : '🔗 Company Website'}
          </span>
        </div>

        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
          <span className="text-blue-600 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
