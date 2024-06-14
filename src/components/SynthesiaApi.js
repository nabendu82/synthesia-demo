import { useState } from "react"
import axios from "axios"

const SynthesiaApi = () => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [script, setScript] = useState('')

    const submitForm = async e => {
        e.preventDefault()
        console.log({ title, desc, script })
        const data = {
            test: 'true',
            visibility: 'private',
            title: title,
            description: desc,
            input: [
                {
                    avatarSettings: { horizontalAlign: 'center', scale: 1, style: 'rectangular', seamless: false },
                    backgroundSettings: {
                        videoSettings: {
                            shortBackgroundContentMatchMode: 'freeze',
                            longBackgroundContentMatchMode: 'trim'
                        }
                    },
                    scriptText: script,
                    avatar: 'anna_costume1_cameraA',
                    background: 'luxury_lobby'
                }
            ]
        };

        const config = {
            method: 'post',
            url: 'https://api.synthesia.io/v2/videos',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `${process.env.REACT_APP_API_KEY}`
            },
            data: data
        };

        axios(config)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        setTitle('')
        setDesc('')
        setScript('')
    }

    return (
        <form onSubmit={submitForm}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
            <label htmlFor="description">Description</label>
            <input type="text" id="description" value={desc} onChange={e => setDesc(e.target.value)} />
            <label htmlFor="script">Script</label>
            <input type="text" id="script" value={script} onChange={e => setScript(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    )
}
export default SynthesiaApi