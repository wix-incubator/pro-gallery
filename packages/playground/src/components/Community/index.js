import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { getAll, save } from '../../data';
import { CommunityPresets } from './community-presets';

function Community() {
    const initialLayoutItem = { title: '', description: '', tags: '' }
    const [layoutItem, set_layoutItem] = React.useState(initialLayoutItem)
    const [showModal, set_showModal] = React.useState(false)
    useEffect(() => {
        getAll().then(console.log);
    }, []);

    return (
        <div>
            <section>
                <CommunityPresets />
            </section>
            <br/>
            <section>
                <Button shape="round" block onClick={() => set_showModal(true)}>
                    Submit your layout
                </Button>
                <Modal title="Submit your layout to the community" visible={showModal} onOk={() => {
                    save({
                        url: window.location.search,
                        ...layoutItem
                    }).then((res) => {
                        message.success('You have successfully shared your layout with the community', 6);
                    })
                    set_layoutItem(initialLayoutItem)
                }} onCancel={() => set_showModal(false)}>
                    <Form layout="vertical">
                        <Form.Item label="Title" labelAlign="left">
                            <Input value={layoutItem.title} onChange={e => set_layoutItem({ ...layoutItem, title: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Description" labelAlign="left" help="describe your layout">
                            <Input.TextArea value={layoutItem.description} onChange={e => set_layoutItem({ ...layoutItem, description: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Tags" labelAlign="left"
                            help="tag your beautiful layout so you can inspire others. Commas separated values, please.">
                            <Input value={layoutItem.tags} onChange={e => set_layoutItem({
                                ...layoutItem,
                                tags: e.target.value
                            })} />
                        </Form.Item>
                    </Form>
                </Modal>
            </section>
        </div >
    );
}

export { Community };
export default Community;
