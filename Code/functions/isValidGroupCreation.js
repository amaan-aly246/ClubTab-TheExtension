import removeSpace from "../functions/removeSpace.js";
const isValidGroupCreation = async (selectedTabs, groupName) => {
    // Check if at least one tab is selected
    if (selectedTabs.size === 0) {
        alert('Please select at least one tab!');
        return false;
    }

    // Retrieve stored groups data from Chrome's local storage
    const storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {};
    const existingGroupNames = Object.keys(storedGroupsData);



    // Check if the title input is not empty
    if (groupName) {
        // Normalize the input title to create a unique, whitespace-free group name key
        const normalizedGroupName = removeSpace(groupName.toLowerCase());
        const groupExists = existingGroupNames.some((name) =>
            normalizedGroupName === removeSpace(name.toLowerCase())
        );

        // Alert if a group with the same name already exists
        if (groupExists) {
            alert("A group with the same name already exists. Please choose a different name.");
            return false;
        }

        // If all validations pass
        return true;
    }

    return false; // If the title input is empty
}

export default isValidGroupCreation