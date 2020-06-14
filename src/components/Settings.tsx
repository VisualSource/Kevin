import React from 'react';
import Sidenav from './Sidenav';
import {Form, Slider} from 'shineout';

function handleSubmit(data: any){}
export default function Settings(){
    document.title = "Kevin Online - Settings";
    return <div id="settings">
        <div id="settings-content">
            <Form onSubmit={handleSubmit}>
                <Form.Item label="Audio" labelAlign="top">
                    <Slider value={100}/>
                </Form.Item>
            </Form>
        </div>
        <Sidenav activeTab={4}/>
    </div>

}