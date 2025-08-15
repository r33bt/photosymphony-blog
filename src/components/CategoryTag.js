import Link from 'next/link';

export function CategoryBadge({ category, count }) {
  return (
    <Link 
      href={`/category/${category.slug}`}
      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors mr-2 mb-2"
    >
      📁 {category.name}
      {count && <span className="ml-1 text-xs">({count})</span>}
    </Link>
  );
}

export function TagBadge({ tag, count }) {
  return (
    <Link 
      href={`/tag/${tag.slug}`}
      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors mr-1 mb-1"
    >
      🏷️ {tag.name}
      {count && <span className="ml-1">({count})</span>}
    </Link>
  );
}
