import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Editor from "./Components/Editor";
import Home from "./Components/Home";
import SocketWrapper from './SocketWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Home />} />
        <Route path = '/room/:username/:roomId' element = {<SocketWrapper><Editor /></SocketWrapper>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;