// this is grp edit page 

const page3Btn = document.querySelector('#page-3-btn')
const page3 = document.querySelector('#page-3')
const selectedTabsList = document.querySelector('#selectedTabsList')
const availableTabsList = document.querySelector('#availableTabsList')
const homeBtn = document.querySelector('#home-btn')

let grpTabUrl = []
page3Btn.addEventListener('click', async (e) => {
    console.log("btn clicked")
    // all tabs opened by the user
    const allOpenedTabs = await chrome.tabs.query({});
    const parentContainer = document.querySelector('#parentContainer')

    const grpName = e.target.parentElement.parentElement.firstElementChild.id
    const data = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData
    const grpData = data[grpName]
    selectedTabsList.innerHTML = grpData.map((tab) => {
        grpTabUrl.push(tab.url)
        return `<div class="link">
                        <span class="add-tab-btn">
                        ❌</span>
                    <li id ="${tab.id}">${tab.title}</li>
                </div>`
    }).join(' ')

    availableTabsList.innerHTML = allOpenedTabs.map((tab)=>{
        if(grpTabUrl.includes(tab.url) ){
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

    // console.log(grpTabUrl)
    if (page3.style.display != 'block') {
        page3.style.display = 'block'
        parentContainer.style.display = 'none'
    }

})

homeBtn.addEventListener('click', ()=>{
    console.log("Hello")
    page3.style.display = 'none'
    parentContainer.style.display = 'block'

})