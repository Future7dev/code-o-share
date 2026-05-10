import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CodeEditor({ socketRef, roomId, username, onLeaveRoom }) {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef({}); // Map decorations by username

  const getUserColor = (name) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#33FFF0', '#FF33A1', '#FFC733'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorSelection((e) => {
      socketRef.current.emit('cursor-change', {
        roomId,
        username,
        selection: e.selection
      });
    });
  };

  useEffect(() => {
    if (!socketRef.current) return;

    const handleCodeUpdate = ({ code: newCode }) => {
      if (newCode !== null) {
        setCode(newCode);
      }
    };

    const handleCursorChange = ({ username: sender, selection }) => {
      if (sender === username || !editorRef.current || !monacoRef.current) return;

      const color = getUserColor(sender);
      const safeSender = sender.replace(/[^a-zA-Z0-9]/g, '_');
      
      let styleEl = document.getElementById(`cursor-style-${safeSender}`);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = `cursor-style-${safeSender}`;
        styleEl.innerHTML = `
          .remote-cursor-${safeSender} {
            border-left: 2px solid ${color} !important;
            box-sizing: border-box;
          }
          .remote-cursor-${safeSender}::before {
            content: '${sender}';
            position: absolute;
            top: -18px;
            left: 0;
            background-color: ${color};
            color: white;
            font-size: 10px;
            padding: 1px 4px;
            border-radius: 2px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 100;
          }
          .remote-selection-${safeSender} {
            background-color: ${color}40;
          }
        `;
        document.head.appendChild(styleEl);
      }

      // Apply changes with a slight delay to allow incoming code changes to process first
      setTimeout(() => {
        if (!editorRef.current || !monacoRef.current) return;

        const newDecorations = [
          {
            range: new monacoRef.current.Range(selection.positionLineNumber, selection.positionColumn, selection.positionLineNumber, selection.positionColumn),
            options: { className: `remote-cursor-${safeSender}`, stickiness: 1 } // stickiness 1 = NeverGrowsWhenTypingAtEdges
          }
        ];

        const selectionRange = new monacoRef.current.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
        if (!selectionRange.isEmpty()) {
          newDecorations.push({
            range: selectionRange,
            options: { className: `remote-selection-${safeSender}`, stickiness: 1 }
          });
        }

        const oldDecorations = decorationsRef.current[sender] || [];
        decorationsRef.current[sender] = editorRef.current.deltaDecorations(oldDecorations, newDecorations);
      }, 10);
    };

    socketRef.current.on('code-update', handleCodeUpdate);
    socketRef.current.on('cursor-change', handleCursorChange);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('code-update', handleCodeUpdate);
        socketRef.current.off('cursor-change', handleCursorChange);
      }
    };
  }, [socketRef, username]);

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

const styles = {

  editorContainer: {
    flex: 0.7,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#1e1e1e',
    overflow: 'hidden'
  },

  // ================= TOP BAR =================

  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: '14px 20px',

    background: 'rgba(30, 30, 30, 0.95)',

    backdropFilter: 'blur(10px)',

    borderBottom: '1px solid #333',

    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  },

  leftControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },



  // ================= SELECT =================

  select: {
    padding: '10px 16px',

    borderRadius: '10px',

    border: '1px solid #444',

    background: '#252526',

    color: '#fff',

    fontSize: '15px',

    fontWeight: '500',

    cursor: 'pointer',

    outline: 'none',

    transition: 'all 0.2s ease',

    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
  },



  // ================= SAVE BUTTON =================

  saveButton: {
    padding: '10px 18px',

    borderRadius: '10px',

    border: 'none',

    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',

    color: '#fff',

    fontWeight: '600',

    fontSize: '14px',

    cursor: 'pointer',

    transition: 'all 0.25s ease',

    boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
  },



  // ================= RUN BUTTON =================

  runButton: {
    padding: '10px 18px',

    borderRadius: '10px',

    border: 'none',

    background: 'linear-gradient(135deg, #16a34a, #15803d)',

    color: '#fff',

    fontWeight: '600',

    fontSize: '14px',

    cursor: 'pointer',

    transition: 'all 0.25s ease',

    boxShadow: '0 4px 12px rgba(22,163,74,0.4)'
  },


  // ================= LEAVE BUTTON =================

  leaveButton: {
    padding: '10px 18px',

    borderRadius: '10px',

    border: 'none',

    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',

    color: '#fff',

    fontWeight: '600',

    fontSize: '14px',

    cursor: 'pointer',

    transition: 'all 0.25s ease',

    boxShadow: '0 4px 12px rgba(220,38,38,0.4)'
  },

  // ================= EDITOR =================

  editorWrapper: {
    flex: 1,
    overflow: 'hidden',
    
  },
  outputContainer: {
  height: '200px',

  background: '#1e1e1e',

  color: '#00ff88',

  padding: '14px',

  borderTop: '1px solid #333',

  overflowY: 'auto',

  overflowX: 'auto',

  textAlign: 'left',

  fontFamily: 'Consolas, monospace',
  margin: 0,

  whiteSpace: 'pre-wrap',

  wordBreak: 'break-word',

  textAlign: 'left',

  lineHeight: '1.5',

  fontSize: '14px'
},

outputTitle: {
  margin: '0 0 10px 0',

  color: '#ffffff',

  fontSize: '16px',

  fontWeight: '600',

  textAlign: 'left'
},

outputText: {
  margin: 0,

  whiteSpace: 'pre-wrap',

  wordBreak: 'break-word',

  textAlign: 'left',

  lineHeight: '1.5',

  fontSize: '14px'
}

};

  return (
    <div style={styles.editorContainer}>
       <div style={styles.topBar}>

    <div style={styles.leftControls}>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={styles.select}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>

    </div>

    <div style={styles.rightControls}>

      <button
        onClick={saveCode}
        style={styles.saveButton}
      >
        Save
      </button>

      <button
        onClick={runCode}
        style={styles.runButton}
      >
        ▶ Run Code
      </button>

      <button
        onClick={onLeaveRoom}
        style={styles.leaveButton}
      >
        Leave Room
      </button>

    </div>

  </div>
      
      <div style={styles.editorWrapper}>
        <Editor
          height="100%"
          
          theme="vs-dark"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
        />
      </div>

      {/* Output Terminal */}
      <div style={styles.outputContainer}>

      <h4 style={styles.outputTitle}>
        Output
      </h4>

      <pre style={styles.outputText}>
        {output}
      </pre>

    </div>

    </div>
    );
  
} 
// import
