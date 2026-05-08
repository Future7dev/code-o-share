import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CodeEditor({ socketRef, roomId }) {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('code-change', ({ code: newCode }) => {
        if (newCode !== null) {
          setCode(newCode);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('code-change');
      }
    };
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    setCode(value);
    socketRef.current.emit('code-change', { roomId, code: value });
  };

  const saveCode = async () => {
    try {
      // Connect this to your future backend API
      await axios.post('http://localhost:5000/api/code/save', { roomId, code, language });
      toast.success('Code saved to MongoDB successfully!');
    } catch (error) {
      toast.error('Failed to save code.');
    }
  };

  const runCode = async () => {
    const languageIds = { javascript: 63, python: 71, java: 71, cpp: 62 }; // Example Judge0 IDs
    
    try {
      setOutput('Executing...');
      // Example request to Judge0 RapidAPI or local instance
      const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        source_code: code,
        language_id: languageIds[language] || 63,
      }, {
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // REPLACE WITH YOUR KEY
          'Content-Type': 'application/json'
        },
        params: { wait: true }
      });
      
      setOutput(response.data.stdout || response.data.stderr || response.data.compile_output);
    } catch (err) {
      setOutput('Execution Error.');
    }
  };

  return (
    <div style={{ flex: 0.7, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#282c34', color: '#fff', display: 'flex', gap: '10px' }}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={saveCode}>Save</button>
        <button onClick={runCode}>Run Code</button>
      </div>
      
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={handleEditorChange}
        />
      </div>

      {/* Output Terminal */}
      <div style={{ height: '200px', background: '#1e1e1e', color: '#00ff00', padding: '10px', borderTop: '1px solid #333' }}>
        <h4>Output:</h4>
        <pre>{output}</pre>
      </div>
    </div>
  );
}