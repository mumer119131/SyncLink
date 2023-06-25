import {Tab} from '@headlessui/react'
import Button from '../Button/Button'
import {useEffect, useRef, useState} from 'react'
import {IoCopy} from 'react-icons/io5'

const Share = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [text, setText] = useState<string>('')
    const [isCopied, setIsCopied] = useState<boolean>(false)
    const saveText = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/text', {
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
            const response = await fetch('http://localhost:5000/api/text')
            const data = await response.json()
            setText(data.text)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        getText()
    }, [])

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(()=> setIsCopied(false), 1000)
    }
  return (
    <div className="flex flex-col items-center justify-center">
        <Tab.Group>
            <Tab.List className='flex gap-2 bg-black bg-opacity-50 p-1 rounded-lg'>
                <Tab className={({selected})=> {
                    return `${selected ? 'bg-black text-white' : 'hover:bg-white hover:bg-opacity-20 hover:text-black'} dark:bg-black text-white px-10 rounded-lg py-2`
                }}>Text</Tab>
                <Tab className={({selected})=> {
                    return `${selected ? 'bg-black text-white' : 'hover:bg-white hover:bg-opacity-20 hover:text-black'} dark:bg-black text-white px-10 rounded-lg py-2`
                }}>Files</Tab>
            </Tab.List>
            <Tab.Panels className='mt-4'>
            <div className="shadow-lg rounded min-h-[30rem] min-w-[50rem] w-[40rem] p-4 ">
                <Tab.Panel className='w-full h-full'>
                    <textarea className='w-full h-[30rem] p-2 outline-none' value={text} onChange={(e)=> setText(e.target.value)} placeholder='Enter the text...'  ></textarea>
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
                        <div className='flex-grow'></div>
                        <Button onClick={()=> clickInput()} className='bg-black text-white w-full py-2 rounded'>Upload</Button>
                        <input type="file" className='hidden' ref={inputRef} multiple={true}/>
                    </div>
                </Tab.Panel>
            </div>
            </Tab.Panels>
        </Tab.Group>
    </div>
  )
}

export default Share