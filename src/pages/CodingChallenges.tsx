// pages/CodingChallenges.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Editor from '@monaco-editor/react';
import { usePyodide } from '../hooks/usePyodide';
import DataFrameViewer, { type TableData } from '../components/DataFrameViewer';

interface Challenge {
  title: string;
  description: string;
  problem_statement: string;
  example_code: {
    input: TableData;
    output: TableData;
  };
  constraints: string[];
  starter_code: string;
  validation_script: string;
  test_runner_script: string;
}

const CodingChallenge = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('Click "Run Code" to see your function\'s output here.');
  const [plotData, setPlotData] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<string>('');

  const { pyodide, isLoading: isPyodideLoading, error: pyodideError } = usePyodide();

  const [isChallengeLoading, setIsChallengeLoading] = useState(true);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallengeById = async () => {
      if (!challengeId) return;
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('title, description, problem_statement, example_code, constraints, starter_code, validation_script, test_runner_script')
          .eq('id', challengeId)
          .single();
        if (error) throw new Error('Could not find the requested challenge.');
        setChallenge(data);
        setCode(data.starter_code || '');
      } catch (err: any) {
        setChallengeError(err.message);
      } finally {
        setIsChallengeLoading(false);
      }
    };
    fetchChallengeById();
  }, [challengeId]);

  const runCode = async () => {
    if (!pyodide || !challenge) return;
    setOutput('Running code...');
    setPlotData(null);
    setValidationResult('');
    try {
      // First, execute the user's code from the editor
      await pyodide.runPythonAsync(code);

      // Now, run the test runner script from the database
      let testRunnerCode = challenge.test_runner_script;
      // Inject the example data into the test runner script
      testRunnerCode = testRunnerCode.replace('${challenge_input_data}', JSON.stringify(challenge.example_code.input));
      
      let capturedOutput = '';
      pyodide.globals.set('print', (s: any) => { capturedOutput += String(s) + '\n'; });
      
      await pyodide.runPythonAsync(code);   
         
      setOutput(capturedOutput || 'Code executed without printing anything.');
    } catch (e: any) {
      setOutput(e.toString());
    }
  };

  const submitAndValidate = async () => {
    if (!pyodide || !challenge) return;
    setValidationResult('Validating...');
    try {
      // First, execute the user's code to make their 'solve' function available
      await pyodide.runPythonAsync(code);

      // Get the validation script from the database
      let validationCode = challenge.validation_script;
      
      // Inject the dynamic input and output data into the script
      validationCode = validationCode.replace('${challenge_input_data}', JSON.stringify(challenge.example_code.input));
      validationCode = validationCode.replace('${challenge_output_data}', JSON.stringify(challenge.example_code.output));

      const result = await pyodide.runPythonAsync(validationCode);
      setValidationResult(result);
    } catch (e: any) {
      setValidationResult(`❌ Validation failed with an error: ${e.message}`);
    }
  };
  
  if (isChallengeLoading || isPyodideLoading) {
    return <p className="text-center p-8 dark:text-white">Loading challenge environment... This may take a moment.</p>;
  }
  if (challengeError || pyodideError) {
    return <p className="text-red-500 text-center p-8">{challengeError || pyodideError?.message}</p>;
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col h-full overflow-y-auto pr-4">
        <header className="mb-8 flex-shrink-0">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{challenge?.title}</h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {challenge?.description}
          </p>
        </header>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Problem Description</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              {challenge?.problem_statement}
            </p>
          </div>
          
          {challenge && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Example</h3>
              <p className="mb-2 text-text-muted-light dark:text-text-muted-dark">Given the following DataFrame:</p>
              <DataFrameViewer tableData={challenge.example_code.input} />

              <p className="mt-4 mb-2 text-text-muted-light dark:text-text-muted-dark">Your function should return:</p>
              <DataFrameViewer tableData={challenge.example_code.output} />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Constraints</h3>
            <ul className="list-disc list-inside text-text-muted-light dark:text-text-muted-dark">
              {challenge?.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[85vh]">
        <div className="flex-grow border rounded-md">
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{ minimap: { enabled: false } }}
          />
        </div>
        <div className="flex-shrink-0 my-4 flex items-center gap-4">
            <button onClick={runCode} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Run Code
            </button>
            <button onClick={submitAndValidate} className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">
                Submit Solution
            </button>
        </div>
        <div className="flex-shrink-0 bg-gray-800 text-white font-mono text-sm rounded-md p-4 h-48 overflow-y-auto">
          <h3 className="font-sans font-bold text-lg mb-2">Output:</h3>
          <pre className="whitespace-pre-wrap">{output}</pre>
          {plotData && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <h3 className="font-sans font-bold text-lg mb-2">Plot:</h3>
              <img src={`data:image/png;base64,${plotData}`} alt="Matplotlib plot" className="bg-white rounded" />
            </div>
          )}
          {validationResult && <pre className="mt-2 pt-2 border-t border-gray-600 whitespace-pre-wrap">{validationResult}</pre>}
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;