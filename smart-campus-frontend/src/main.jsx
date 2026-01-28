import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx' // <--- Import this

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>  {/* <--- Wrap App */}
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)

