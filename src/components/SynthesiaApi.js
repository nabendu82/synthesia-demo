import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from 'react-spinners';
import { Container, Headline, SpinnerContainer } from "./SynthesiaStyled";
import SynthesiaForm from "./SynthesiaForm";
import DownloadComponent from "./DownloadSection";

const SynthesiaApi = () => {
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

    const submitForm = async ({ title, desc, script }) => {
        setFormDisabled(true); // Disable form and submit button
        setLoading(true);

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
                    scriptText: script.length > 180 ? script.slice(0, 180) : script,
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
        setVideoId('');
        setDownloadUrl('');
        setFormDisabled(false);
    };

    return (
        <Container>
            <Headline>Synthesia Videos</Headline>
            <SynthesiaForm onSubmit={submitForm} formDisabled={formDisabled} />
            {loading && (
                <SpinnerContainer>
                    <ClipLoader color="#007BFF" loading={loading} size={50} />
                </SpinnerContainer>
            )}
            {downloadUrl && (
                <DownloadComponent downloadUrl={downloadUrl} onReset={resetForm} />
            )}
        </Container>
    );
};

export default SynthesiaApi;
