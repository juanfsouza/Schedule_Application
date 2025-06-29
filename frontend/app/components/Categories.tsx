'use client';

export default function Categories() {
  return (
    <div className="mt-2 mb-3">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm">Work</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
          <span className="text-sm">Personal</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-sm">Schedule</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          <span className="text-sm">Gaming</span>
        </div>
      </div>
    </div>
  );
}