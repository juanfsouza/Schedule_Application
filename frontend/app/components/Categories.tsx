'use client';

export default function Categories() {
  const categories = [
    { name: 'Work', bgColor: 'rgba(34, 197, 94, 0.7)', border: '2px', borderColor: 'rgb(21, 128, 61)' },
    { name: 'Personal', bgColor: 'rgba(139, 92, 246, 0.7)', borderColor: 'rgb(91, 60, 161)' },
    { name: 'Schedule', bgColor: 'rgba(59, 130, 246, 0.7)', borderColor: 'rgb(39, 86, 163)' },
    { name: 'Gaming', bgColor: 'rgba(234, 179, 8, 0.7)', borderColor: 'rgb(154, 118, 5)' },
  ];

  return (
    <div className="mt-2 mb-3">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{
                backgroundColor: category.bgColor,
                border: `1px solid ${category.borderColor}`,
              }}
            ></span>
            <span className="text-sm">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}