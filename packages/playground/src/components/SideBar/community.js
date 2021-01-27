import React, {useEffect} from 'react';
import {Button, Form, Input, message} from 'antd';
import {getAll, save} from '../../data';
import {CommunityPresets} from './community-presets';

function Community() {
    const initialLayoutItem = {title: '', description: '', tags: ''}
    const [layoutItem, set_layoutItem] = React.useState(initialLayoutItem)
    useEffect(() => {
        getAll().then(console.log);
    }, []);

    return (
        <div>
            <section>
                <h3>Submit your layout to the community</h3>
                <Form layout="vertical">
                    <Form.Item label="Title" labelAlign="left">
                        <Input value={layoutItem.title} onChange={e => set_layoutItem({...layoutItem, title: e.target.value})}/>
                    </Form.Item>
                    <Form.Item label="Description" labelAlign="left" help="describe your layout">
                        <Input.TextArea value={layoutItem.description} onChange={e => set_layoutItem({...layoutItem, description: e.target.value})}/>
                    </Form.Item>
                    <Form.Item label="Tags" labelAlign="left"
                               help="tag your beautiful layout so you can inspire others. Commas separated values, please.">
                        <Input value={layoutItem.tags} onChange={e => set_layoutItem({
                            ...layoutItem,
                            tags: e.target.value
                        })}/>
                    </Form.Item>
                    <Button type="text" onClick={() => {
                        save({
                            url: window.location.search,
                            ...layoutItem
                        }).then((res) => {
                            message.success('You have successfully shared your layout with the community', 6);
                        })
                        set_layoutItem(initialLayoutItem)
                    }}>Submit</Button>
                </Form>
            </section>
            <section>
                <h3>Browse the community's layouts</h3>
                <CommunityPresets/>
            </section>
        </div>
    );
}

export {Community};
