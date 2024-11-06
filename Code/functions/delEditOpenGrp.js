import displayGroup from "./displayGroup.js";

const viewSection = document.querySelector('.view-section');
const navigationSection = document.querySelector('.navigation-section');
const grpContainer = document.querySelector('.grp-container');
const deleteAlertContainer = document.querySelector('#delete-alert-container')
const deleteAlertNoBtn = document.querySelector('#delete-alert-no-btn')
const deleteAlertYesBtn = document.querySelector('#delete-alert-yes-btn')
const parentContainer = document.querySelector('#parentContainer')
const ul = document.createElement('ul');
viewSection.appendChild(ul)

const delEditOpen = async (element) => {

     // ###### delete the group  ######
    if (element.classList.contains('delete-btn')) {
        // open the delete group alert box
        deleteAlertContainer.style.display = 'block'
        parentContainer.style.opacity = '.5'

        // don't want to delete the group 
        deleteAlertNoBtn.addEventListener('click', () => {
            deleteAlertContainer.style.display = 'none'
            parentContainer.style.opacity = '1'

        })

        // delete the group
        deleteAlertYesBtn.addEventListener('click', async () => {
            const grpName = element.parentElement.previousElementSibling.textContent

            let storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {}
            delete storedGroupsData[grpName];
            await chrome.storage.local.set({ storedGroupsData });
            window.location.reload();
            displayGroup();
        })

    }

    //######## view which tabs are included in the group-button ##########

    else if (element.classList.contains('view-btn')) {
        const groupName = element.parentElement.previousElementSibling.id
        const groupData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData[groupName]
        const p = viewSection.firstElementChild.firstElementChild
        p.innerHTML = `Tab(s) included in <span style="color: purple">"${groupName}"</span> group`
        ul.innerHTML = groupData.map((tab) => {
            return `

            <li id =${tab.id}>--${tab.title}</li>
                `
        }).join('')

        document.addEventListener('click', (e) => {

            if (e.target.classList.contains('view-btn')) {

                viewSection.style.display = 'block';
                navigationSection.style.display = 'none';
                grpContainer.style.display = 'none';

            }
            else if (e.target.classList.contains('cross')) {
                viewSection.style.display = 'none';
                navigationSection.style.display = 'flex';
                grpContainer.style.display = 'block';
            }

        })
    }

    // open tabs by clicking group name
    else if (element.classList.contains('grp-name')) {
        const groupName = element.textContent
        const data = await chrome.storage.local.get()
        data.storedGroupsData[groupName].forEach((tabProp) => {
            chrome.tabs.create({ url: `${tabProp.url}` })
        })

    }
}




export default delEditOpen
