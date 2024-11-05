import getTabData from "./getTabData.js";

const createGroup = async (selectedTabs, groupName) => {
    const groupData = [];
    let storedGroupsData;

        storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {};



    for (const tabId of selectedTabs) {
        const tabInfo = await getTabData(tabId, groupName);
        groupData.push(tabInfo);
    }

    const newGroup = {
        [groupName]: groupData
    };

    try {

        storedGroupsData = { ...storedGroupsData, ...newGroup };

        await chrome.storage.local.set({ storedGroupsData: storedGroupsData });
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
};

export default createGroup;


