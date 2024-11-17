import { FileIcon, defaultStyles } from 'react-file-icon';

const File = ({ file }) => {
  const extension = file.name.split('.').pop(); // Get the file extension
  
  return (
    <li className='my-1' key={file.name}>
      <span className='flex items-center gap-1.5'>
        <div className='w-4 h-4'>
        <FileIcon extension={extension} {...defaultStyles[extension]}  />
        </div>
        <span className='text-white'>{file.name}</span>
      </span>
    </li>
  );
};

export default File;
