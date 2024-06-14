import { useEffect, useState } from "react"
import axios from "axios"

const SynthesiaApi = () => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [script, setScript] = useState('')
    const [videoId, setVideoId] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')

    useEffect(() => {
        console.log("useEffect running videoId ", videoId)
        if (videoId) {
            const intervalId = setInterval(async () => {
                const videoInfo = await getVideo(videoId);
                console.log(videoInfo);
                if (videoInfo.status === 'complete') {
                    setDownloadUrl(videoInfo.download);
                    clearInterval(intervalId);
                }
            }, 15000);

            return () => clearInterval(intervalId);
        }
    }, [videoId]);

    const getVideo = async(videoId) => {
        try {
            const response = await axios.get(`https://api.synthesia.io/v2/videos/${videoId}`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_API_KEY}`
                }
            })
            return response.data
        } catch (error) {
            console.log('error in getVideo ', error)
        }
    }

    const submitForm = async e => {
        e.preventDefault()
        console.log({ title, desc, script })
        const data = {
            test: 'false',
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
                console.log(response.data.id);
                setVideoId(response.data.id);
            })
            .catch(error => {
                console.error(error);
            });
        setTitle('')
        setDesc('')
        setScript('')
    }

    return (
        <>
            <form onSubmit={submitForm}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                <label htmlFor="description">Description</label>
                <input type="text" id="description" value={desc} onChange={e => setDesc(e.target.value)} />
                <label htmlFor="script">Script</label>
                <input type="text" id="script" value={script} onChange={e => setScript(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            {downloadUrl && (
                <div>
                    <h3>Download Your Video</h3>
                    <a href={downloadUrl} download>Download Video</a>
                </div>
            )}
        </>
    )
}
export default SynthesiaApi