import React, { useEffect } from 'react';
import {Button, Form, Input} from 'antd';
import { getAll } from '../../data';
import { CommunityPresets } from './community-presets';

function Community() {

    const [layoutTitle, set_layoutTitle] = React.useState('');
    const [layoutDescription, set_layoutDescription] = React.useState('');
    const [tags, set_tags] = React.useState('');

    useEffect(() => {
      getAll().then(console.log);
    }, []);

    return (
        <div>
            <section>
                <h3>Submit your layout to the community</h3>
                <Form layout="vertical">
                    <Form.Item label="Title" labelAlign="left">
                        <Input onChange={e => set_layoutTitle(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Description" labelAlign="left" help="describe your layout">
                        <Input.TextArea onChange={e => set_layoutDescription(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Tags" labelAlign="left"
                               help="tag your beautiful layout so you can inspire others. Commas separated values, please.">
                        <Input onChange={e => set_tags(e.target.value)}/>
                    </Form.Item>
                    <Button type="text" onClick={() => console.log({
                        url: window.location.search,
                        title: layoutTitle,
                        tags: tags,
                        description: layoutDescription
                    })}>Submit</Button>
                </Form>
            </section>
            <section>
                <h3>Browse the community's layouts</h3>
                <CommunityPresets />
            </section>
        </div>
    );
}

export {Community};
