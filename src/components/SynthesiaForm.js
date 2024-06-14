import { useState, useEffect } from "react";
import { Button, Form, Input, Label, Textarea } from "./SynthesiaStyled";

const SynthesiaForm = ({ onSubmit, formDisabled }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [script, setScript] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Check if all fields are filled
        setIsFormValid(title.trim() !== '' && desc.trim() !== '' && script.trim() !== '');
    }, [title, desc, script]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, desc, script });
        setTitle('');
        setDesc('');
        setScript('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} disabled={formDisabled} />
            <Label htmlFor="description">Description</Label>
            <Input type="text" id="description" value={desc} onChange={e => setDesc(e.target.value)} disabled={formDisabled} />
            <Label htmlFor="script">Script</Label>
            <Textarea id="script" value={script} onChange={e => setScript(e.target.value)} disabled={formDisabled} />
            <Button type="submit" disabled={formDisabled || !isFormValid}>Submit</Button>
        </Form>
    );
};

export default SynthesiaForm;
