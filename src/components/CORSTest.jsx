import { useState } from 'react';

const CORSTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testCORS = async () => {
    setTesting(true);
    setTestResult(null);

    const backendUrl = 'http://172.237.44.29:5000';
    
    try {
      // Test 1: Simple fetch to health endpoint
      console.log('Testing CORS with fetch...');
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          success: true,
          message: 'CORS is working correctly!',
          data: data
        });
      } else {
        setTestResult({
          success: false,
          message: `Server responded with status: ${response.status}`,
          error: `HTTP ${response.status}`
        });
      }
    } catch (error) {
      console.error('CORS Test Error:', error);
      
      let errorMessage = 'Unknown error';
      if (error.message.includes('CORS')) {
        errorMessage = 'CORS policy is blocking the request. Backend needs CORS configuration.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot reach the backend server. Check if it\'s running and accessible.';
      } else {
        errorMessage = error.message;
      }

      setTestResult({
        success: false,
        message: errorMessage,
        error: error.name || 'NetworkError'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">CORS Connection Test</h3>
        <button
          onClick={testCORS}
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      <div className="text-sm text-gray-300 mb-3">
        <p>Backend URL: <code className="bg-gray-700 px-2 py-1 rounded">http://172.237.44.29:5000</code></p>
      </div>

      {testing && (
        <div className="flex items-center space-x-2 text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span>Testing CORS connection...</span>
        </div>
      )}

      {testResult && (
        <div className={`mt-3 p-3 rounded-lg ${
          testResult.success 
            ? 'bg-green-500/10 border border-green-500/20 text-green-200' 
            : 'bg-red-500/10 border border-red-500/20 text-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <span>{testResult.success ? '✅' : '❌'}</span>
            <span className="font-medium">{testResult.message}</span>
          </div>
          
          {testResult.error && (
            <p className="text-sm opacity-80">Error: {testResult.error}</p>
          )}
          
          {testResult.data && (
            <div className="text-xs mt-2 opacity-80">
              <p>Server Response: {JSON.stringify(testResult.data, null, 2)}</p>
            </div>
          )}

          {!testResult.success && (
            <div className="mt-3 text-xs">
              <p className="font-medium mb-1">To fix this issue:</p>
              <ol className="list-decimal list-inside space-y-1 opacity-80">
                <li>SSH into your VM: <code className="bg-gray-700 px-1 rounded">ssh root@172.237.44.29</code></li>
                <li>Navigate to backend: <code className="bg-gray-700 px-1 rounded">cd ~/backend</code></li>
                <li>Add CORS headers to your Express server</li>
                <li>Restart the backend service</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CORSTest;