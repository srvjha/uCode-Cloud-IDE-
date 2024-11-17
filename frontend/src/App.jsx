import CodeEditor from "./components/CodeEditor";
import FileExplorer from "./components/FileExplorer";
import NewTerminal from "./components/Terminal";
import {Cloud} from 'lucide-react'

function App() {
  return (
    <div className="bg-black w-screen h-screen flex flex-col">
      <div className="text-white flex   p-4 h-[70px]">
      <span className="cursor-pointer p-2 font-playfair text-2xl font-bold rounded-md ">
        Cloud <span className="text-blue-700 ">IDE</span>
      </span>
      <Cloud className="mt-[15px] text-gray-500"/>
      </div>
      <hr className="border-1 border-gray-600 w-full" />
      
      <div className="flex flex-row  overflow-hidden">
        {/* File Explorer */}
        <FileExplorer />
        
        {/* Main content area */}
        <div className=" flex flex-col w-full h-[950px]">
          <CodeEditor/>
          
          {/* Terminal */}
          <NewTerminal />
        </div>
      </div>
    </div>
  );
}

export default App;