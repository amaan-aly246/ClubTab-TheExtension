// ########## grp edit page ###########

import getTabData from "../functions/getTabData.js"

const page3Btn = document.querySelector('#page-3-btn')
const page3 = document.querySelector('#page-3')
const selectedTabsList = document.querySelector('#selectedTabsList')
const availableTabsList = document.querySelector('#availableTabsList')
const homeBtn = document.querySelector('#home-btn')
const saveChangesBtn = document.querySelector('#saveChangesBtn')
//  tabs that are present in the group
let grpTabInfo = new Map()
let selectedTabsInfo = new Map()

export const page3Func = async (e) => {
    // all tabs opened by the user
    const allOpenedTabs = await chrome.tabs.query({});
    const parentContainer = document.querySelector('#parentContainer')
    const grpName = e.target.parentElement.parentElement.firstElementChild.id
    document.querySelector('#grpNameInputBox').value = grpName
    const data = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData
    const grpData = data[grpName]
    selectedTabsList.innerHTML = grpData.map((tab) => {
        selectedTabsInfo.set(`${tab.title}`, tab)
        grpTabInfo.set(tab.title, tab)
        return `<div class="link">
                        <span class="remove-tab-btn">
                        ❌</span>
                    <li id ="${tab.title}">${tab.title}</li>
                </div>`
    }).join(' ')


    availableTabsList.innerHTML = allOpenedTabs.map((tab) => {
        if (grpTabInfo.has(tab.title)) {
            return
        }
        return `
            <div class="link">
                        <span class="add-tab-btn">
                        ➕</span>
                    <li id ="${tab.id}">${tab.title}</li>
                </div>
        `
    }).join(' ')


    // Add event listeners to "❌" spans in the selected tabs list
    document.querySelectorAll('#selectedTabsList .remove-tab-btn').forEach((span) => {
        span.addEventListener('click', function (e) {
            const element = e.target.nextElementSibling
            const btn = e.target
            // add tab to the group 
            if (btn.classList.contains('add-tab-btn')) {
                btn.textContent = '❌'
                btn.classList.add("remove-tab-btn");
                btn.classList.remove("add-tab-btn");
                selectedTabsInfo.set(element.textContent, grpTabInfo.get(element.textContent))
                console.log('tab added', selectedTabsInfo)
            }
            else if (btn.classList.contains('remove-tab-btn')) {
                btn.textContent = '➕'
                btn.classList.remove("remove-tab-btn");
                btn.classList.add("add-tab-btn");
                selectedTabsInfo.delete(element.textContent)
                console.log('tab removed', selectedTabsInfo)

            }

        });
    });

    // Add event listeners to "➕" spans in the available tabs list
    document.querySelectorAll('#availableTabsList .add-tab-btn').forEach((span) => {
        span.addEventListener('click', async (e) => {
            const element = e.target.nextElementSibling
            const btn = e.target
            // add tab to the group 
            if (btn.classList.contains('add-tab-btn')) {
                btn.textContent = '❌'
                btn.classList.add("remove-tab-btn");
                btn.classList.remove("add-tab-btn");
                const data = await getTabData(element.id, grpName)
                // console.log(data)

                selectedTabsInfo.set(element.textContent, data)

            }
            else if (btn.classList.contains('remove-tab-btn')) {
                btn.textContent = '➕'
                btn.classList.remove("remove-tab-btn");
                btn.classList.add("add-tab-btn");
                selectedTabsInfo.delete(element.textContent)
            }
        });
    });

    if (page3.style.display != 'block') {
        page3.style.display = 'block'
        parentContainer.style.display = 'none'
    }
    // move back to home page 
    homeBtn.addEventListener('click', () => {
        page3.style.display = 'none'
        parentContainer.style.display = 'block'

    })

    // save changes 
    saveChangesBtn.addEventListener('click', async () => {
        const updatedGrpName = document.querySelector('#grpNameInputBox').value
        const updatedGrpData = []
        if (updatedGrpName) {
            selectedTabsInfo.forEach((value, key) => {
                value.groupName = updatedGrpName
                updatedGrpData.push(value)

            });
            // delete the old group
            let storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData

            delete storedGroupsData[grpName];
            // Update the group with changed information
            storedGroupsData[updatedGrpName] = updatedGrpData;
            // update grp with changed information 
            await chrome.storage.local.set({ storedGroupsData }, () => {
                window.location.reload();
            });
        }
        else {
            alert('empty group name is not possible ')
        }
    })

}



