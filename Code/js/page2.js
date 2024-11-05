import createGroup from "../functions/createGroup.js";
import removeSpace from "../functions/removeSpace.js";
const page2Btn = document.querySelector('#page-2-btn')
const createBtn = document.querySelector('.create-btn')
const titleInput = document.querySelector('#title');
const listContainer = document.querySelector('.tabs-container')
let selectedTabs = new Set();


// add the clicked tab to selectedTabs.
listContainer.addEventListener('click', (event) => {
    const element = event.target.nextElementSibling || event.target
    const icon = element.parentElement.firstElementChild

    if (icon.classList.contains('add-tab-btn')) {
        icon.textContent = '❌'
        selectedTabs.add(element.id);
        icon.classList.add("remove-tab-btn");
        icon.classList.remove("add-tab-btn");
    }
    else if (icon.classList.contains('remove-tab-btn')) {
        icon.textContent = '➕'
        selectedTabs.delete(element.id);
        icon.classList.remove("remove-tab-btn");
        icon.classList.add("add-tab-btn");
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

// Event listener to create a new group of tabs
createBtn.addEventListener('click', async (event) => {
    // Retrieve stored groups data from Chrome's local storage
    const storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {};

    const existingGroupNames = Object.keys(storedGroupsData);

    // Normalize the input title to create a unique, whitespace-free group name key
    const normalizedGroupName = removeSpace(titleInput.value.toLowerCase());

    if (titleInput.value) {
        // Check for any existing group with the same normalized name
        const groupExists = existingGroupNames.some((name) => 
            normalizedGroupName === removeSpace(name.toLowerCase())
        );

        if (groupExists) {
            alert("A group with the same name already exists. Please choose a different name.");
            return;
        }

        // Use the original title input (preserving capitalization and spaces) as the group name
        const finalGroupName = titleInput.value;
        createGroup(selectedTabs, finalGroupName);
    }
});

