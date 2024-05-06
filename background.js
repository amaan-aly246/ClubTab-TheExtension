let allGroupNames = [];
let storedGroupsData = {}
const urlHistoryMap = new Map();

const fetchStoredData = async () => {
    try {
        storedGroupsData = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {};
        allGroupNames = Object.keys(storedGroupsData);
    } catch (error) {
        console.log(error);
    }
};


// url and tabID of the opened tabs
const fetchOpenedTabs = async () => {
    try {
        urlHistoryMap.clear();
        const response = await chrome.tabs.query({});
        const data = await response;
        data.map((item) => {
            if (!Array.from(urlHistoryMap.values()).includes(item.url)) {
                urlHistoryMap.set(item.id, item.url)
            }
        })
        // console.log(urlHistoryMap);

    } catch (error) {
        console.log(error);
    }
}


fetchStoredData();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        fetchOpenedTabs();
        // console.log('changeInfo')
        // url in which the change happened 
        const oldUrl = urlHistoryMap.get(tabId);
        const newUrl = tab.url;
        const newTitle = tab.title;

        allGroupNames.map((groupName) => {
            storedGroupsData[groupName].forEach((tabProp, index) => {
                if (oldUrl == tabProp.url) {
                    // pause the video  
                    console.log('oldUrl ')
                    chrome.scripting
                        .executeScript({
                            target: { tabId: tabId },
                            files: ["./ContentScript/ContentScript.js"],
                        })
                        .then(() => console.log("script injected")).catch((error) => console.log(error))
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
                            // console.log({ storedGroupsData })
                        })
                }
            })
        })
        urlHistoryMap.set(tabId, newUrl);
    }
    return
});



