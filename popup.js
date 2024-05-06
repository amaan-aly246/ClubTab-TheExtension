import displayTabs from "./functions/displayTabs.js";
import deleteGroup from './functions/deleteGroup.js'
import displayGroup from "./functions/displayGroup.js";
import delEditOpen from "./functions/delEditOpenGrp.js";

const deleteBtn = document.querySelector('.delete');
const btnClubTabs = document.querySelector('.btn-Club-tabs');
const tabsContainer = document.querySelector('.tabs-container');

const page1Btn = document.querySelector('#page-1-btn')
export const grpContainer = document.querySelector('.grp-container')


page1Btn.addEventListener('click', () => {
    const element = document.querySelector('#page-1');
    const element2 = document.querySelector('#page-2');
    if (element.style.display == 'none') {
        element.style.display = 'block'
        element2.style.display = 'none'
    }

})

//display available groups
const flag = await displayGroup(grpContainer)

if (flag == -1) {
    grpContainer.append(Object.assign(document.createElement('h2'), { textContent: "No groups" }))
}

grpContainer.addEventListener('click', (e) => {
    delEditOpen(e.target, e);
})


// display opened tabs
displayTabs(tabsContainer)

// delete btn for testing purposes 
// deleteBtn.addEventListener('click', () => {
//     deleteGroup()
// })


// retrieve data btn  for testing purposes 
// btnClubTabs.addEventListener('click', () => {
//     chrome.storage.local.get(null).then((data) => {
//         console.log(data);
//     })
// })






