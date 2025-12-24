import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'react-toastify';

function Preview(props) {

    const [mJson, setmJson] = useState(null)
    const [index, setIndex] = useState(0)
    const [current, setcurrent] = useState(-1)
    const [backStack, setBackStack] = useState([])

    useEffect(() => {
        if (props.data != null || props.data != undefined) {
            let json = JSON.parse(props.data)
            setmJson(json)
        }
    }, [props.data])



    function getRadioItem(val, key) {
        return (
            <div style={{ display: 'flex', width: '100%' }}
                onClick={() => { setcurrent(key) }}
            >
                <input
                    onChange={() => {

                    }}
                    checked={key == current}
                    type='radio' />
                <p style={{ marginLeft: '8px', font: '20px' }}>{val.option}</p>
            </div>

        )
    }

    function getCheckBoxItem(val, key) {
        return (
            <div
                onClick={() => {

                }}
                style={{ display: 'flex', width: '100%'}}>
                <input

                    defaultChecked={false}
                    type='checkbox' />
                <p style={{ marginLeft: '8px', font: '20px' }}>{val.option}</p>
            </div>
        )

    }

    return (
        <div className="preview-modal" 
        >
            <div className='preview-content'>
                <div className='close-button'>
                        <span 
                            onClick={() => {
                                props.closePreview()
                            }} 
                            className='bi bi-x-circle'>
                        </span>
                </div>

                {
                    mJson != null ?
                        <div>
                            <p
                                style={{
                                    margin: '12px',
                                    maxWidth: '400px',
                                    textAlign: 'center',
                                    fontWeight:'bold',
                                    fontSize:'18px'
                                }}
                            >{mJson[index].question}</p>
                            {
                                mJson[index].options.map((val, key) => {
                                    return (
                                        <div key={key} style={{
                                            display: 'flex', padding: '4px',
                                            cursor: 'pointer',
                                            border: '1px solid #e6e7ec',
                                            margin:'8px'
                                        }} >
                                            {
                                                mJson[index].type == 'radio' ?
                                                    getRadioItem(val, key)
                                                    : getCheckBoxItem(val, key)
                                            }
                                        </div>
                                    )
                                })
                            }
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>

                                {
                                    backStack.length != 0 ?
                                        <p
                                            onClick={() => {
                                                let mArr = [...backStack]
                                                let lastNum = backStack[backStack.length - 1]
                                                console.log(lastNum)
                                                setIndex(lastNum)
                                                mArr.pop()
                                                setBackStack(mArr)

                                            }}
                                            style={{ cursor: 'pointer' }}>Back</p> : <div></div>
                                }

                                <button style={{
                                    width: '120px',
                                    outline: 'none',
                                    borderRadius: '4px',
                                    borderWidth: '0px',
                                    cursor: 'pointer',
                                    marginTop: '12px',
                                    backgroundColor: '#2d79f1',
                                    color: 'white', padding: '12px',
                                    fontFamily: "'Poppins', sans-serif"
                                }}

                                    onClick={() => {
                                        let type = mJson[index].type
                                        if (type == 'radio') {
                                            if (current == -1) {
                                                toast.error("Please Select a Option")
                                                return
                                            }
                                            let nextpage = mJson[index].options[current].page
                                            console.log(nextpage)
                                            if (nextpage != -1 && nextpage != null) {
                                                let mStack = [...backStack]
                                                mStack.push(index)
                                                setBackStack(mStack)
                                                setIndex(nextpage)
                                                setcurrent(-1)
                                            } else {
                                                toast.success("Completed")
                                                props.closePreview()
                                            }
                                        } else {
                                            let nextpage = mJson[index].options[0].page
                                            console.log(nextpage)
                                            if (nextpage != -1 && nextpage != null) {
                                                let mStack = [...backStack]
                                                mStack.push(index)
                                                setBackStack(mStack)
                                                setIndex(nextpage)
                                                setcurrent(-1)
                                            } else {
                                                toast.success("Completed")
                                                props.closePreview()
                                            }
                                        }

                                    }}>Submit</button>
                            </div>
                        </div> : null
                }

            </div>
        </div>

    )
}

export default Preview