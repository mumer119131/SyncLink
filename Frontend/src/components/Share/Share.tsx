import {Tab} from '@headlessui/react'
import Button from '../Button/Button'
import {useEffect, useRef, useState} from 'react'
const Share = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [text, setText] = useState<string>('')
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
  return (
    <div className="flex flex-col items-center justify-center">
        <Tab.Group>
            <Tab.List className='flex gap-2 bg-black bg-opacity-50 p-1 rounded-lg'>
                <Tab className={({selected})=> {
                    console.log(selected)
                    return `${selected ? 'bg-black text-white' : 'hover:bg-white hover:bg-opacity-20 hover:text-black'} dark:bg-black text-white px-10 rounded-lg py-2`
                }}>Text</Tab>
                <Tab className={({selected})=> {
                    console.log(selected)
                    return `${selected ? 'bg-black text-white' : 'hover:bg-white hover:bg-opacity-20 hover:text-black'} dark:bg-black text-white px-10 rounded-lg py-2`
                }}>Files</Tab>
            </Tab.List>
            <Tab.Panels className='mt-4'>
            <div className="shadow-lg rounded min-h-[30rem] min-w-[20rem] w-[40rem] p-4 ">
                <Tab.Panel className='w-full h-full'>
                    <textarea className='w-full h-[30rem] p-2' value={text} onChange={(e)=> setText(e.target.value)} placeholder='Enter the text...'  ></textarea>
                    <Button onClick={()=> saveText()} className='bg-black text-white w-full py-2 rounded'>Save</Button>
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