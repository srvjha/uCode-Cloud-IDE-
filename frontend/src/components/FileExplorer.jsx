import React, { useState,useEffect,useRef } from 'react'
import { FaChevronDown } from "react-icons/fa6";
import { FaFileMedical } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { PiFolderSimpleBold } from "react-icons/pi";
import Folder from '../utils/Folder';
import File from '../utils/File';
import { IoDocumentOutline } from "react-icons/io5";
import Input from '../utils/Input';

const FileExplorer = () => {
    const [searchItem,setSearchitem] = useState("");
    const [createFile,setCreateNewFile] = useState("");
    const [createFolder,setCreateNewFolder] = useState("");
    const [fileToggle,setFileToggle] = useState(false);
    const [folderToggle,setFolderToggle] = useState(false);
     const [activeFolder, setActiveFolder] = useState(null); 
    const fileInputRef = useRef();
    const folderInputRef = useRef();
    const socket = new WebSocket("ws://localhost:3000");
    const [folders, setFolders] = useState(() => {
      const savedData = localStorage.getItem('fileExplorerData');
      if (savedData) {
          try {
              return [JSON.parse(savedData)];
          } catch (e) {
              console.error('Error parsing localStorage data:', e);
              return [{ folders: [], files: [] }];
          }
      }
      return [{ folders: [], files: [] }];
  });

  useEffect(() => {
    try {
        localStorage.setItem('fileExplorerData', JSON.stringify(folders[0]));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}, [folders]);

  //  useEffect(()=>{
  //  const fileExplorerDetails = JSON.parse(localStorage.getItem('fileExplorerData'));
  //  setFolders(fileExplorerDetails);
  //  console.log({fileExplorerDetails})
  //  },[]);


  //console.log(localStorage.get('fileExplorerData'))
   
   useEffect(() => {
      if (fileToggle && fileInputRef.current) {
        fileInputRef.current.focus();
      }
  }, [fileToggle]);

  useEffect(() => {
    if (folderToggle && folderInputRef.current) {
      folderInputRef.current.focus();
    }
   }, [folderToggle]);


    // Helper function to find and update a folder by path
 const updateFolderStructure = (foldersList, path, updateFn) => {
  if (!path || path.length === 0) {
      return updateFn(foldersList);
  }

  return foldersList.map(item => {
      if (item.name === path[0]) {
          if (path.length === 1) {
              return updateFn(item);
          }
          return {
              ...item,
              folders: item.folders ? 
              updateFolderStructure(item.folders, path.slice(1), updateFn) : 
              item.folders
          };
      }
      return item;
  });
};
    
    const createNewFile = (e) =>{
     setCreateNewFile(e.target.value)
    }
    const createNewFolder = (e) =>{
      setCreateNewFolder(e.target.value)
     }
     const handleFileCreation = (e) => {
      if (e.key === "Enter" && createFile.trim()) {
          setFolders(prevFolders => {
              const updatedFolders = [...prevFolders];
                // Store updated folders in local storage
                console.log({file:updatedFolders[0]})
                 localStorage.setItem('fileExplorerData', JSON.stringify(updatedFolders[0]));

              // here will send the backend the file info and also create in backend
              const filePath  = activeFolder ? `${activeFolder}/${createFile}` : createFile;
              const command = `touch ${filePath}`;
              socket.send(JSON.stringify({ type: 'terminal', data: command }));
              
              if (!activeFolder) {
                  // Add to root if no active folder
                  if (updatedFolders[0]?.files) {
                      updatedFolders[0].files.push({ name: createFile });
                  } else {
                      updatedFolders[0].files = [{ name: createFile }];
                  }
                  return updatedFolders;
              }

              // Add to active folder
              const path = activeFolder.split('/');
              const newFolders = updateFolderStructure(updatedFolders[0].folders, path, (folder) => ({
                  ...folder,
                  files: [...(folder.files || []), { name: createFile }]
              }));
              
              return [{ ...updatedFolders[0], folders: newFolders }];
          });

          setCreateNewFile("");
          setFileToggle(false);
      }
  };

  const handleFolderCreation = (e) => {
      if (e.key === "Enter" && createFolder.trim()) {
          setFolders(prevFolders => {
              const updatedFolders = [...prevFolders];
              console.log({folder:updatedFolders})
              localStorage.setItem('fileExplorerData', JSON.stringify(updatedFolders[0]));


                // Send WebSocket message to create folder using node-pty
            const folderPath = activeFolder ? `${activeFolder}/${createFolder}` : createFolder;
            const command = `mkdir ${folderPath}`;
            socket.send(JSON.stringify({ type: 'terminal', data: command }));
             
              if (!activeFolder) {
                  // Add to root if no active folder
                  updatedFolders[0].folders.push({ 
                      name: createFolder,
                      folders: [],
                      files: []
                  });
                  return updatedFolders;
              }

              // Add to active folder
              const path = activeFolder.split('/');
              const newFolders = updateFolderStructure(updatedFolders[0].folders, path, (folder) => ({
                  ...folder,
                  folders: [...(folder.folders || []), { 
                      name: createFolder,
                      folders: [],
                      files: []
                  }]
              }));
              
              console.log({activeFolder,path,updatedFolders})
              return [{ ...updatedFolders[0], folders: newFolders }];
          });

          setCreateNewFolder("");
          setFolderToggle(false);
      }
  };

    const handleSetting = () =>{}
    

    const handleFolderClick = () =>{  
     if(fileToggle)  setFileToggle(false);
        
      setFolderToggle(true);
    }

    const handleFileClick = () =>{
        if(folderToggle) setFolderToggle(false);     
        setFileToggle(true)
      }
    
  
  return (
    <div>
    <div className='bg-[#0a0a0a] border-r border-gray-500 w-[279px]  p-2 h-[91vh] overflow-hidden'>
        <div>
            <input 
              type="text" 
              value={searchItem} 
              className='w-full bg-gray-900 p-2 rounded-md text-white'
              placeholder='Search'
              onChange={(e)=>setSearchitem(e.target.value)}
              />
        </div>
        <div className=' flex flex-row mt-4 space-x-36'>
            <div className=' flex flex-row space-x-2'>
        <div>
            <FaChevronDown className='mt-[6px] w-3 h-3 text-white cursor-pointer'/>
            </div>
            <div className = "font-medium text-white">Files</div>
        </div>

        <div className=' flex flex-row mt-1 space-x-2'>
            <FaFileMedical className='cursor-pointer text-white'onClick={handleFileClick} />
            <FaFolderPlus className='cursor-pointer text-white' onClick={handleFolderClick}/>
            <HiDotsVertical className='text-white cursor-pointer' onClick={handleSetting}/>
        </div>

        </div>
        {/* will add folders , subfolders and files */}

       <ul className='mt-4 ml-1'>
          {folders[0]?.folders &&(
            folders[0].folders.map((folder) => {
              return (          
                <Folder folder={folder} key={folder.name} setFolders = {setFolders} setActiveFolder={setActiveFolder}
                path={folder.name}/>           
             );
             })     
          )}
          {folders[0]?.files &&(
             folders[0].files.map((file) => {
              return (          
                <File file={file} key={file.name}/>           
             );
             })  
          )}
          
        </ul>

        <Input
        Toggle={fileToggle}
        value={createFile}
        ref={fileInputRef}
        onChange={createNewFile}
        onKeyUp={handleFileCreation}
        onBlur={() => setFileToggle(false)} 
        type="file"
        />

        <Input
        Toggle={folderToggle}
        value={createFolder}
        ref={folderInputRef}
        onChange={createNewFolder}
        onKeyUp={handleFolderCreation}
        onBlur={() => setFolderToggle(false)}
        type="folder"
        />       
      
    </div>      
    </div>
  )
}

export default FileExplorer
