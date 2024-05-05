import createGroup from "../functions/createGroup.js";
const page2Btn = document.querySelector('#page-2-btn')
const createBtn = document.querySelector('.create-btn')
const titleInput = document.querySelector('#title');
const listContainer = document.querySelector('.tabs-container')
let selectedTabs = new Set();


// add the clicked tab to selectedTabs.
listContainer.addEventListener('click', (event) => {
    const element = event.target.nextElementSibling || event.target
    const icon = element.parentElement.firstElementChild

    if (icon.classList.contains('add')) {
        icon.textContent = '❌'
        selectedTabs.add(element.id);
        // console.log(element)

        icon.classList.toggle("add");
    }
    else {
        icon.textContent = '➕'
        selectedTabs.delete(element.id);
        icon.classList.toggle('add')
    }

})

//
page2Btn.addEventListener('click', () => {
    const element2 = document.querySelector('#page-2');
    const element = document.querySelector('#page-1');

    if (element2.style.display != 'block') {
        element2.style.display = 'block'
        element.style.display = 'none'
    }

})

// create group of tabs
createBtn.addEventListener('click', (event) => {
    const groupName = titleInput.value
    // console.log(groupName);
    // console.log('btn clicked ')
    createGroup(selectedTabs, groupName);
})
