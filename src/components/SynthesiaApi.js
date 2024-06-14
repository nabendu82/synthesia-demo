import { useEffect, useState } from "react"
import axios from "axios"
import { ClipLoader } from 'react-spinners'
import { Button, Container, DownloadLink, DownloadSection, Form, Headline, Input, Label, ResetButton, SpinnerContainer, Textarea } from "./SynthesiaStyled"

const SynthesiaApi = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [script, setScript] = useState('');
    const [videoId, setVideoId] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);

    useEffect(() => {
        if (videoId) {
            setLoading(true);
            const intervalId = setInterval(async () => {
                const videoInfo = await getVideo(videoId);
                if (videoInfo.status === 'complete') {
                    setDownloadUrl(videoInfo.download);
                    setLoading(false);
                    clearInterval(intervalId);
                }
            }, 15000); // Poll every 15 seconds

            return () => clearInterval(intervalId); // Clean up on unmount
        }
    }, [videoId]);

    const getVideo = async (videoId) => {
        try {
            const response = await axios.get(`https://api.synthesia.io/v2/videos/${videoId}`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_API_KEY}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('error in getVideo ', error);
        }
    };

    const truncateScript = (text) => {
        if (text.length > 180) {
            const newText = text.slice(0, 180);
            return newText
        }
        return text;
    };

    const submitForm = async e => {
        e.preventDefault();
        setFormDisabled(true); // Disable form and submit button
        setLoading(true);

        let truncStr = truncateScript(script);
        
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
                    scriptText: truncStr,
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

        try {
            const response = await axios(config);
            console.log(response.data);
            setVideoId(response.data.id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDesc('');
        setScript('');
        setVideoId('');
        setDownloadUrl('');
        setFormDisabled(false); // Enable form and submit button
    };

    return (
        <Container>
            <Headline>Synthesia Videos</Headline>
            <Form onSubmit={submitForm}>
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} disabled={formDisabled} />
                <Label htmlFor="description">Description</Label>
                <Input type="text" id="description" value={desc} onChange={e => setDesc(e.target.value)} disabled={formDisabled} />
                <Label htmlFor="script">Script</Label>
                <Textarea id="script" value={script} onChange={e => setScript(e.target.value)} disabled={formDisabled} />
                <Button type="submit" disabled={formDisabled}>Submit</Button>
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
    );
};

export default SynthesiaApi;