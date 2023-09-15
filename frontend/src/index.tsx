import { MathJaxContext } from 'better-react-mathjax';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { configStore } from './redux/store';
import reportWebVitals from './reportWebVitals';
import './index.css';

const store = configStore();

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <MathJaxContext
        config={{
          tex: {
            macros: {
              degree: ['^\\circ', 0],
              textcirc: ['\\enclose{circle}{\\kern .06em \\text{#1}\\kern .06em}', 1],
            },
          },
        }}
      >
        <App />
      </MathJaxContext>
    </BrowserRouter>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
