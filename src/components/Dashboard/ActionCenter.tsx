import React from 'react';

const ActionCenter: React.FC = () => {
  const actions = [
    {
      title: 'Freeze Assets',
      description: 'Immediately freeze suspicious assets across all chains',
      icon: '🔒',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => console.log('Freeze assets')
    },
    {
      title: 'Emergency Stop',
      description: 'Halt all cross-chain operations temporarily',
      icon: '⏹️',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => console.log('Emergency stop')
    },
    {
      title: 'Update Rules',
      description: 'Modify security rules and thresholds',
      icon: '⚙️',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => console.log('Update rules')
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive security report',
      icon: '📊',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => console.log('Generate report')
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Action Center</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`w-full ${action.color} text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3`}
          >
            <span className="text-xl">{action.icon}</span>
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-blue-600">24</div>
            <div className="text-gray-600">Active Alerts</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-green-600">98%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span className="text-sm font-medium text-yellow-800">System Notice</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Enhanced AI threat detection is now active. Monitor for improved accuracy.
        </p>
      </div>
    </div>
  );
};

export default ActionCenter; 