let allGroupNames = [];
let storedGroupsData = {}
const urlHistoryMap = new Map();

// url and tabID of the opened tabs
const fetchOpenedTabs = async () => {
    try {
        const response = await chrome.tabs.query({});
        const data = await response;
        data.map((item) => {
            urlHistoryMap.set(item.id, item.url)

        })
    } catch (error) {
        console.log(error);
    }
}


const fetchStoredData = async () => {
    try {
        storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {};
        allGroupNames = Object.keys(storedGroupsData);
    } catch (error) {
        console.log(error);
    }
};

fetchStoredData();
fetchOpenedTabs();


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        console.log({ urlHistoryMap });
        // url in which the change happened 
        const oldUrl = urlHistoryMap.get(tabId);
        const newUrl = tab.url;
        const newTitle = tab.title;

        console.log({ tabId });

        console.log({ oldUrl });
        // console.log(storedGroupsData);
        allGroupNames.map((groupName) => {
            storedGroupsData[groupName].forEach((tabProp, index) => {
                if (oldUrl == tabProp.url) {
                    console.log({ oldUrl });
                    const tabData = {
                        groupName: `${groupName}`,
                        // title of the new url 
                        title: `${newTitle}`,
                        // new url
                        url: `${newUrl}`,
                        muted: false
                    };
                    storedGroupsData[groupName][index] = tabData;
                    chrome.storage.local.set({ 'storedGroupsData': storedGroupsData }).then(
                        () => {
                            console.log({ storedGroupsData })
                        })
                }
            })
        })
        urlHistoryMap.set(tabId, newUrl);
    }
    return
});



