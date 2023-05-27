import React, { useState } from 'react';
import Modal from 'react-modal'
import Button from './Basic/Button';
interface Props {
  onClose:()=>void;
    onConfirm: (name: string) => {}
    loading?:boolean
}

export default function UsernameModal(props: Props) {
    const { loading } = props;
    const [ username, setUsername ] = useState("")
    return (
        <Modal  isOpen={true} contentLabel="Choose a Username"
            className="outline-none rounded-lg px-4 py-3 w-1/3 min-w-[400px] mx-auto mt-20 bg-secondary-300 dark:bg-secondary-800 border-highlight-800 dark:border-highlight-500 border-2 shadow-lg"
            overlayClassName="fixed inset-0 bg-white/50 dark:bg-black/50  flex items-center justify-center"
     >
        <h2  className='text-secondary-900 dark:text-white mb-2 text-lg' >Choose a Username</h2>
        <form className='text-secondary-900 dark:text-white flex flex-col justify-center items-center gap-5 w-full' >
          <div className="w-full">
              <label>
                Username:
                </label>
                <input  className="block p-2.5 w-full flex-1 text-sm text-black bg-secondary-50 rounded-lg border border-secondary-300 focus:ring-highlight-500 focus:border-highlight-500 dark:bg-secondary-900 dark:border-secondary-600 dark:placeholder-secondary-400 dark:text-white dark:focus:ring-highlight-500 dark:focus:border-highlight-500"
              type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
                <Button onClick={()=>props.onConfirm(username)} disabled={loading} >Confirm</Button>
        </form>
      </Modal>
  )
}