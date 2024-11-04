import React, {useState} from 'react';
import axios from 'axios';
import './App.css';
import {ResponseItem} from "./types";

function App() {
  const [error, setError] = useState<string>()
  const [concurrency, setConcurrency] = useState<number>();
  const [results, setResults] = useState<ResponseItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const startRequests = async () => {
    if (!concurrency || isNaN(concurrency) || concurrency <= 0 || concurrency > 100) {
      setError('Please enter a valid number between 1 and 100');
      return;
    }else{
      setError(undefined)
    }

    setIsRunning(true);
    setResults([]);

    const totalRequests = 1000;
    let requestIndex = 1;
    let activeRequests = 0;

    const sendRequest = async (index:number) => {
      activeRequests++;
      try {
        const response = await axios.post('http://localhost:4000/api', { index });
        setResults(prevResults => [
          ...prevResults,
          {
            success: true,
            text: `Response ${response.data.index}`
          }
        ]);
      } catch (error: any) {
        console.log(error)
        setResults(prevResults => [
          ...prevResults,
          {
            success: false,
            text: `Response ${index} Error`
          }
        ]);
      } finally {
        activeRequests--;
        if (requestIndex <= totalRequests) {
          sendRequest(requestIndex++);
        }
      }
    };

    while (requestIndex <= totalRequests && activeRequests < concurrency) {
      sendRequest(requestIndex++);
    }

    const interval = setInterval(() => {
      while (activeRequests < concurrency && requestIndex <= totalRequests) {
        sendRequest(requestIndex++);
      }
      if (requestIndex > totalRequests && activeRequests === 0) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000/concurrency);
  };

  return (
    <main className="main">
      <div className="container">
        <div className="input__block">
          <h1 className="input__text">Concurrency </h1>
          <div className="input__wrapper">
            <input
              type="number"
              value={concurrency || ""}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              min="0"
              max="100"
              required
              className="input"
              placeholder="0"
            />
            <button
              onClick={startRequests}
              disabled={isRunning}
              className="button"
            >
              Start
            </button>
          </div>
        </div>
        {
          error
          ? <div className="error">
              {error}
            </div>
          : <ul className="list">
            {results.map((result, index) => (
              <li key={index} className={!result.success ? "list__item-error" : "" }>{
                result.text
              }</li>
            ))}
          </ul>
        }
      </div>
    </main>
  );
}

export default App;
