import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "./components/ui/provider"
import './assets/css/index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
    
  </React.StrictMode>
);
