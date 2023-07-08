import {Tab} from '@headlessui/react'
import Button from '../Button/Button'
import {useEffect, useRef, useState} from 'react'
import {IoCopy} from 'react-icons/io5'
import {Progress} from '@material-tailwind/react'
import {AiFillFile} from 'react-icons/ai'
import axios from 'axios'
import {AiOutlineCloudDownload} from 'react-icons/ai'
const Share = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [text, setText] = useState<string>('')
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
    const [isCopied, setIsCopied] = useState<boolean>(false)
    const [uploadFileIndex, setUploadFileIndex] = useState<number>(0)
    const [files, setFiles] = useState<File[]>([])
    const [uploadFileProgress, setUploadFileProgress] = useState<number>(0)
    // const baseUrl = 'https://synclink.onrender.com'
    const baseUrl = 'http://localhost:5000'
    const saveText = async () => {
        try{
            const response = await fetch(`${baseUrl}/api/text`, {
                method: 'POST',
                body: JSON.stringify({text: text}),
                headers: {
                    'Content-Type': 'application/json'
                }

            })
            console.log(response)
        }catch(err){
            console.log(err)
        }
    }
    const clickInput = () =>{
        if(inputRef.current !== null){
            inputRef.current.click()
        }
    }
    const getText = async () => {
        try{
            const response = await fetch(`${baseUrl}/api/text`)
            const data = await response.json()
            setText(data.text)
        }catch(err){
            console.log(err)
        }
    }
    const getFiles = async () => {
        try{
            const response = await fetch(`${baseUrl}/api/files`)
            const data = await response.json()
            console.log(data)
            setFiles(data.files)
        }catch(err){
            console.log(err)
            setFiles([])
        }
    }
    useEffect(()=>{
        getText()
        getFiles()
    }, [])

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(()=> setIsCopied(false), 1000)
    }
    const handleSelectedFile = async(e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;
        console.log(e.target.files)
        setSelectedFiles(e.target.files)
        for(let i = 0; i < e.target.files.length; i++){
            setUploadFileIndex(i)
            const file = e.target.files[i]
            await uploadFile(file)
        }
        setUploadFileIndex(0)
        setSelectedFiles(null)
        getFiles()
        
    }
    const uploadFile = async (file: File) => {
        try{
            const formData = new FormData()
            formData.append('file', file)
            const response = await axios.post(`${baseUrl}/api/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ? progressEvent.total : 1))
                    setUploadFileProgress(progress)
                }
            })
            console.log(response)
        }catch(err){
            console.log(err)
        }
    }
    const handleDownload = (filename : string) => {
        axios
          .get(`${baseUrl}/api/files/${filename}`, {
            responseType: 'blob',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
          })
          .then(response => {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
          })
          .catch(error => {
            console.error('Error downloading file:', error);
          });
    }
  return (
    <div className="flex flex-col items-center justify-center">
        <Tab.Group>
            <Tab.List className='flex gap-2 bg-black bg-opacity-20 p-1 rounded-lg'>
                <Tab className={({selected})=> {
                    return `${selected ? 'bg-black text-white' : 'hover:bg-white hover:bg-opacity-20 hover:text-black text-black'} dark:bg-black px-10 rounded-lg py-2`
                }}>Text</Tab>
                <Tab className={({selected})=> {
                    return `${selected ? 'bg-black text-white' : 'hover:bg-white hover:bg-opacity-20 hover:text-black text-black'} dark:bg-black px-10 rounded-lg py-2`
                }}>Files</Tab>
            </Tab.List>
            <Tab.Panels className='mt-4'>
            <div className="shadow-lg rounded min-h-[30rem] min-w-[50rem] w-[40rem] p-4 ">
                <Tab.Panel className='w-full h-full'>
                    <textarea className='dark:text-black w-full h-[30rem] p-2 outline-none' value={text} onChange={(e)=> setText(e.target.value)} placeholder='Enter the text...'  ></textarea>
                    <div className='flex w-full flex-row justify-end items-center gap-4 px-4'>
                        <Button onClick={()=> saveText()} className='bg-black text-white w-full py-3 rounded'>Save</Button>
                        {text && <div className='flex flex-col flex-row items-center'>
                                <IoCopy onClick={()=> copyTextToClipboard()} title='copy' className='text-2xl'/>
                                {isCopied && <p className='text-[0.5rem]'>Copied!</p>}
                            </div>}
                    </div>
                </Tab.Panel>
                <Tab.Panel className='w-full h-[30rem]'>
                    <div className='flex flex-col h-full'>
                        <div className='flex flex-wrap gap-2 flex-grow'>
                            {
                                files && Array.from(files).map((file, index)=> {
                                    return <div key={index} className='flex flex-col h-max gap-4 rounded-lg min-w-[10rem] max-w-[10rem] bg-gray-100 justify-between items-center px-4 py-2'>
                                        <AiFillFile className='text-5xl' />
                                        <p className='w-full whitespace-nowrap text-sm overflow-hidden text-overflow-ellipsis'>{file.name}</p>
                                        <AiOutlineCloudDownload className='cursor-pointer' onClick={()=> handleDownload(file.name)} />
                                        <p>{Math.trunc(file.size / 1000).toLocaleString()} kb</p>
                                    </div>
                                })
                            }
                        </div>
                        <div className='flex flex-wrap gap-2 flex-grow'>
                            {
                                selectedFiles && Array.from(selectedFiles).map((file, index)=> {
                                    return <div key={index} className='flex flex-col h-max gap-4 rounded-lg min-w-[10rem] max-w-[10rem] bg-gray-100 justify-between items-center px-4 py-2'>
                                        <AiFillFile className='text-5xl' />
                                        <p className='w-full whitespace-nowrap text-sm overflow-hidden text-overflow-ellipsis'>{file.name}</p>
                                        <Progress value={index == uploadFileIndex ? uploadFileProgress : (uploadFileIndex > index ? 100 : 0)} />
                                        <p>{Math.trunc(file.size / 1000).toLocaleString()} kb</p>
                                    </div>
                                })
                            }
                        </div>
                        <Button onClick={()=> clickInput()} className='bg-black text-white w-full py-2 rounded'>Upload</Button>
                        <input type="file" className='hidden' ref={inputRef} multiple={true} onChange={handleSelectedFile}/>
                    </div>
                </Tab.Panel>
            </div>
            </Tab.Panels>
        </Tab.Group>
    </div>
  )
}

export default Share