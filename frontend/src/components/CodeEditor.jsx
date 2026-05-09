import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CodeEditor({ socketRef, roomId }) {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!socketRef.current) return;

    const handleCodeUpdate = ({ code: newCode }) => {
      if (newCode !== null) {
        setCode(newCode);
      }
    };

    socketRef.current.on('code-update', handleCodeUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('code-update', handleCodeUpdate);
      }
    };
  }, [socketRef]);

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
  const languageIds = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54
  };

  try {
    setOutput("Executing...");

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageIds[language],
        stdin: ""
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "043798940emsh81bd4b52a13e11fp122305jsn1f7b710ce565",
          "X-RapidAPI-Host": "judge029.p.rapidapi.com"
        }
      }
    );

    const result = response.data;

    setOutput(
      result.stdout ||
      result.stderr ||
      result.compile_output ||
      "No Output"
    );

  } catch (error) {
    console.error(error);
    setOutput("Execution Error");
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