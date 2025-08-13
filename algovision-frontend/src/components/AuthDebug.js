import React, { useState } from 'react';
import { authAPI } from '../api/auth';

const AuthDebug = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authAPI.login({
        username: 'testuser2',
        password: 'testpass123'
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await authAPI.register({
        username: `debuguser_${Date.now()}`,
        email: `debug_${Date.now()}@example.com`,
        password: 'debugpass123',
        full_name: 'Debug User'
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testAuthCheck = async () => {
    setLoading(true);
    try {
      const response = await authAPI.isAuthenticated();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Authentication Debug</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Login
        </button>
        
        <button
          onClick={testRegister}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          Test Register
        </button>
        
        <button
          onClick={testAuthCheck}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 ml-2"
        >
          Test Auth Check
        </button>
      </div>

      {loading && (
        <div className="text-blue-600">Testing...</div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-x-auto">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
