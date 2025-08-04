import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ActionRequiredProps {
  shipmentId?: string;
}

const ActionRequired: React.FC<ActionRequiredProps> = ({ shipmentId }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Simple mock data for missing items
  const missingItems = [
    'Commercial Invoice',
    'Packing List', 
    'Certificate of Origin',
    'Customs Declaration'
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-800 text-sm font-medium">
            Action Required: {missingItems.length} items need to be completed - {missingItems.join(', ')}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ActionRequired; 