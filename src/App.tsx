import { EditorProvider } from './context/EditorContext';
import EditorPage from './components/EditorPage';
import './App.css';

function App() {
  return (
    <EditorProvider>
      <EditorPage />
    </EditorProvider>
  );
}

export default App;

