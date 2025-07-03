import React, { useState } from 'react';
import { Clock, ExternalLink, Bookmark, BookmarkCheck, Filter, ChevronDown } from 'lucide-react';

const IndustryNews = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const filters = ['All', 'Ocean Freight', 'Customs', 'Disruption', 'Innovation'];

  const newsItems = [
    {
      id: 1,
      source: 'FreightWaves',
      headline: 'Port of LA sees 12% volume jump in May amid trade recovery',
      fullHeadline: 'Port of Los Angeles sees 12% volume jump in May amid ongoing trade recovery and increased consumer demand',
      timestamp: '3h ago',
      category: 'Port',
      tag: 'Market',
      summary: 'The Port of Los Angeles reported a significant 12% increase in container volume for May 2025, marking the strongest growth in the past 18 months as trade continues to recover.',
      url: '#'
    },
    {
      id: 2,
      source: 'JOC',
      headline: 'New EU customs regulations take effect July 2025',
      fullHeadline: 'New EU customs regulations take effect July 2025, impacting import documentation requirements',
      timestamp: '5h ago',
      category: 'Customs',
      tag: 'Alert',
      summary: 'The European Union will implement new customs documentation requirements starting July 1, 2025, affecting all import shipments into EU member states.',
      url: '#'
    },
    {
      id: 3,
      source: 'Maritime Executive',
      headline: 'AI-powered route optimization reduces fuel costs by 15%',
      fullHeadline: 'AI-powered route optimization technology reduces shipping fuel costs by 15% in recent pilot program',
      timestamp: '1d ago',
      category: 'Innovation',
      tag: 'Tech',
      summary: 'A new AI-driven route optimization system has demonstrated 15% fuel cost savings in a six-month pilot program with major shipping lines.',
      url: '#'
    },
    {
      id: 4,
      source: 'PortWatch',
      headline: 'Suez Canal traffic delays expected through weekend',
      fullHeadline: 'Suez Canal traffic delays expected through weekend due to maintenance operations',
      timestamp: '2d ago',
      category: 'Disruption',
      tag: 'Alert',
      summary: 'Planned maintenance operations at the Suez Canal are causing delays of 6-12 hours for transit vessels through the weekend.',
      url: '#'
    },
    {
      id: 5,
      source: 'Trade News',
      headline: 'Singapore-US trade route sees record container volumes',
      fullHeadline: 'Singapore-US trade route sees record container volumes in Q2 2025',
      timestamp: '3d ago',
      category: 'Ocean Freight',
      tag: 'Market',
      summary: 'The Singapore-US trade corridor has recorded its highest container volumes in Q2 2025, driven by increased electronics and manufacturing exports.',
      url: '#'
    }
  ];

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Alert': return 'bg-red-100 text-red-700 border-red-200';
      case 'Tech': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Port': return 'bg-green-100 text-green-700 border-green-200';
      case 'Market': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleBookmark = (id: unknown) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedItems(newBookmarks);
  };

  const filteredNews = selectedFilter === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedFilter);

  const handleHeadlineClick = (itemId: number) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-md font-semibold text-gray-900">Insights</h2>
        <div className="relative">
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filters.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-700 ">
                    {item.source}
                  </span>
                </div>

                <h3 
                  className="text-xs font-semibold text-gray-900 leading-tight mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleHeadlineClick(item.id)}
                >
                  {expandedItem === item.id ? item.fullHeadline : item.headline}
                  {item.headline.length < item.fullHeadline.length && expandedItem !== item.id && '...'}
                </h3>

                {expandedItem === item.id && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-700 mb-2">{item.summary}</p>
                    <a 
                      href={item.url}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read more <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {item.timestamp}
                </div>
              </div>

              <button
                onClick={() => toggleBookmark(item.id)}
                className={`flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors ${
                  bookmarkedItems.has(item.id) ? 'text-gray-600'
                        : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarkedItems.has(item.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full text-sm text-white bg-[#007bff] px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          See All
        </button>
      </div>
    </div>
  );
};

export default IndustryNews;