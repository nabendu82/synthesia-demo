import { useEffect, useState } from "react"
import axios from "axios"
import { ClipLoader } from 'react-spinners'
import { Button, Container, DownloadLink, DownloadSection, Form, Headline, Input, Label, ResetButton, SpinnerContainer, Textarea } from "./SynthesiaStyled"

const SynthesiaApi = () => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [script, setScript] = useState('')
    const [videoId, setVideoId] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("useEffect running videoId ", videoId)
        if (videoId) {
            setLoading(true);
            const intervalId = setInterval(async () => {
                const videoInfo = await getVideo(videoId);
                console.log(videoInfo);
                if (videoInfo.status === 'complete') {
                    setDownloadUrl(videoInfo.download);
                    setLoading(false);
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
                setVideoId(response.data.id);
            })
            .catch(error => {
                console.error(error);
            });
        setTitle('')
        setDesc('')
        setScript('')
    }

    const resetForm = () => {
        setTitle('');
        setDesc('');
        setScript('');
        setVideoId('');
        setDownloadUrl('');
    };

    return (
        <Container>
            <Headline>Synthesia Videos</Headline>
            <Form onSubmit={submitForm}>
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                <Label htmlFor="description">Description</Label>
                <Input type="text" id="description" value={desc} onChange={e => setDesc(e.target.value)} />
                <Label htmlFor="script">Script</Label>
                <Textarea id="script" value={script} onChange={e => setScript(e.target.value)} />
                <Button type="submit">Submit</Button>
            </Form>
            {loading && (
                <SpinnerContainer>
                    <ClipLoader color="#007BFF" loading={loading} size={50} />
                </SpinnerContainer>
            )}
            {downloadUrl && (
                <DownloadSection>
                    <h3>Download Your Video</h3>
                    <DownloadLink href={downloadUrl} download>Download Video</DownloadLink>
                    <ResetButton onClick={resetForm}>Reset Form</ResetButton>
                </DownloadSection>
            )}
        </Container>
    )
}
export default SynthesiaApi