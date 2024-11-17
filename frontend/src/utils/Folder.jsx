// Folder.jsx
import { PiFolderSimpleBold } from "react-icons/pi";
import { MdOutlineChevronRight } from "react-icons/md";
import { IoChevronDownOutline } from "react-icons/io5";
import { useState } from "react";
import File from "./File";
import { FaFolder } from "react-icons/fa";
import { FaFolderOpen } from "react-icons/fa";

export const Folder = ({ folder, setFolders, setActiveFolder, path }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCollapse = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        console.log(path)
        setActiveFolder(path); // Set the active folder using the full path
    };

    return (
        <li className='my-1' key={folder.name}>
            <span className='flex items-center gap-1.5'>
                {!isOpen ? (
                    <div className="flex cursor-pointer" onClick={handleCollapse}>
                        <MdOutlineChevronRight className="text-white w-[20px] h-[24px]" />
                        <FaFolder className='text-[#F8D775] w-[19px] h-[18px] mt-1' />
                        <span className='text-white ml-1'>{folder.name}</span>
                    </div>
                ) : (
                    <div className="flex gap-1 cursor-pointer" onClick={() => {
                        setIsOpen(false);
                        setActiveFolder(null); // Clear active folder when closing
                    }}>
                        <IoChevronDownOutline className="text-white" />
                        <FaFolderOpen className='text-[#F8D775] w-[19px] h-[18px]' />
                        <span className='text-white -mt-1'>{folder.name}</span>
                    </div>
                )}
            </span>

            {isOpen && folder.folders?.length > 0 && (
                <ul className='ml-4'>
                    {folder.folders.map((subfolder) => (
                        <Folder 
                            folder={subfolder} 
                            key={subfolder.name} 
                            setFolders={setFolders}
                            setActiveFolder={setActiveFolder}
                            path={`${path}/${subfolder.name}`} // Pass the full path to subfolders
                        />
                    ))}
                </ul>
            )}

            {folder.files?.length > 0 && isOpen && (
                <ul className="ml-6">
                    {folder.files.map((file) => (
                        <File file={file} key={file.name} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Folder;