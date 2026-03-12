import { useState, useEffect } from 'react';
import { healthAPI } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('checking');
      setError(null);
      
      console.log('Testing backend connection...');
      const response = await healthAPI.check();
      
      if (response.data.status === 'OK') {
        setStatus('connected');
        setDetails(response.data);
        console.log('✅ Backend connection successful:', response.data);
      } else {
        setStatus('error');
        setError('Backend returned unexpected response');
      }
    } catch (err) {
      console.error('❌ Backend connection failed:', err);
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'checking') {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-blue-200">Testing backend connection...</span>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
        <div className="text-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400">✅</span>
            <span className="font-medium">Backend Connected Successfully</span>
          </div>
          {details && (
            <div className="text-sm text-green-300">
              <p>Server: {details.message}</p>
              <p>Environment: {details.environment}</p>
              <p>Time: {new Date(details.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
      <div className="text-red-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">❌</span>
            <span className="font-medium">Backend Connection Failed</span>
          </div>
          <button
            onClick={testConnection}
            className="text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition-colors"
          >
            Retry
          </button>
        </div>
        <p className="text-sm text-red-300">{error}</p>
        <div className="mt-2 text-xs text-red-400">
          <p>Make sure the backend server is running on port 5000</p>
          <p>Run: <code className="bg-red-500/20 px-1 rounded">npm run dev</code></p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;