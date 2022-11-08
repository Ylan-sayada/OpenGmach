import React from 'react'
import { useRecoilValue } from 'recoil';
import { sysConfig } from '../data/atoms/landingAtoms';
import GmachDetailsForm from './GmachDetailsForm'

export default function DashboardsGmachSettings() {
    let sysConfigData = useRecoilValue(sysConfig);
    return (<div id="dashboard_gmach_settings_container">
        <h3>Gmach Settings</h3>
        {sysConfigData && <GmachDetailsForm btnTxt="Update my gmach details!" defaultValue={sysConfigData} />}
    </div >

    )
}
