import React from 'react';
import { DataProvider } from './Provider/DataProvider';
import AppRouter from './Routes/Index';
import './styles/fluent.css';
import './App.css';

function App() {
  return (
    <DataProvider>
      <div className="App">
        <AppRouter />
      </div>
    </DataProvider>
  );
}

export default App;
