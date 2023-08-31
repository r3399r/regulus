import { MathJax } from 'better-react-mathjax';

function App() {
  return (
    <div className="bg-yellow-50">
      <div>hello world</div>
      <MathJax dynamic>{'\\[a+b=3\\]'}</MathJax>
    </div>
  );
}

export default App;
