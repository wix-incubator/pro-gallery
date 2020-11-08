import React from 'react';
import {Table, Modal, Button} from 'antd';
import {settingsManager } from '../../constants/settings';

function StylesList() {

  const [modalVisible, set_modalVisible] = React.useState(false);

  const dataSource = Object.entries(settingsManager).map(([option, settings], idx) => ({
      key: option,
      idx: idx + 1,
      name: settings.title,
      type: settings.type,
      desc: settings.description,
    })
  );
  
  const columns = [
    {
      title: '#',
      dataIndex: 'idx',
      key: 'idx',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
  ];
  
    return (
    <div>
      <Modal
        title="Pro Gallery Styles List"
        centered
        width={window.innerWidth > 600 ? window.innerWidth - 200 : window.innerWidth}
        height={window.innerHeight - 200}
        visible={modalVisible}
        onOk={() => set_modalVisible(false)}
        onCancel={() => set_modalVisible(false)}
      >
          <Table dataSource={dataSource} columns={columns} pagination={{
            current: 1,
            pageSize: 100,
          }}
/>
      </Modal>
      <Button type="primary" icon="code" shape="round" size="large" disabled={modalVisible} onClick={() => set_modalVisible(true)} block>
        Full Styles List 
      </Button>
    </div>
  );
}
export {StylesList};
