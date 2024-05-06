import displayGroup from "./displayGroup.js";

import { grpContainer } from "../popup.js";

const delEditOpen = async (element, e) => {

    // ###### delete the group  ######
    if (element.classList.contains('delete-btn')) {
        const grpName = element.parentElement.previousElementSibling.textContent

        let storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {}
        delete storedGroupsData[grpName];
        await chrome.storage.local.set({ storedGroupsData });
        window.location.reload();
        displayGroup();

    }

    //######## edit button ##########

    // else if (element.classList.contains('edit-btn')) {
    //     console.log(element, 'edit')

    // }

    // open tabs by clicking group name
    else if (element.classList.contains('grp-name')) {
        const groupName = element.textContent
        const data = await chrome.storage.local.get()
        data.storedGroupsData[groupName].forEach((tabProp) => {
            chrome.tabs.create({ url: `${tabProp.url}` })
        })

    }

    //######## open Tabs by clicking group section  ##########

    else if (element.classList.contains('grp')) {


        const groupName = element.firstElementChild.textContent
        const data = await chrome.storage.local.get()
        data.storedGroupsData[groupName].forEach((tabProp) => {
            console.log({tabProp});
            chrome.tabs.create({ url: `${tabProp.url}` })
        })

    }
}

export default delEditOpen
