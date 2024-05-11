let flag = 0;
let storedGroupsData;
let allGroupNames;
let urlHistoryMap = new Map();
const fetchStoredData = async () => {
    const data = await chrome.storage.local.get('storedGroupsData');
    return data.storedGroupsData ?? {};
}

// url and tabID of the opened tabs
const fetchOpenedTabs = async () => {
    try {


        const data = await chrome.tabs.query({});
        for (const item of data) {
            // tabs who takes time to load google,send tab obj with additional prop called "pendingUrl" whose value is the url of the website and url prob empty.
            if (item.pendingUrl) {
                urlHistoryMap.set(item.id, item.pendingUrl);

            }
            else {
                urlHistoryMap.set(item.id, item.url);
            }

        }
        // console.log('fetchOpenedTabs func called')

        return urlHistoryMap

    } catch (error) {
        console.log(error);
    }
}


const mainFunc = async () => {


    try {

        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if (changeInfo.status == 'complete') {

                // populated the values only the first time
                if (flag == 0) {
                    const promise = Promise.all([fetchStoredData(), fetchOpenedTabs()]);
                    [storedGroupsData, urlHistoryMap] = await promise;
                    allGroupNames = Object.keys(storedGroupsData);
                    console.log('storedData', storedGroupsData)
                    console.log('firstTime only ', urlHistoryMap);
                    flag = 1;

                }

                const newUrl = tab.url;
                const newTitle = tab.title;

                const oldUrl = urlHistoryMap.get(tabId);
                console.log('tabId', tabId);
                console.log('oldUrl', oldUrl);
                console.log('newUrl', newUrl);

                allGroupNames.map((groupName) => {
                    storedGroupsData[groupName].forEach((tabProp, index) => {

                        if (oldUrl == tabProp.url && newUrl != oldUrl) {

                            console.log('when old Url exist in the database: tabProp.url', tabProp.url)

                            const tabData = {
                                groupName: `${groupName}`,
                                // title of the new url 
                                title: `${tab.title}`,
                                // new url
                                url: `${newUrl}`,
                                muted: false
                            };
                            storedGroupsData[groupName][index] = tabData;
                            chrome.storage.local.set({ 'storedGroupsData': storedGroupsData }).then(
                                () => {
                                    console.log('updated the database: ', storedGroupsData);
                                })
                        }
                    })
                })
                // update the change in url to the urlHistoryMap
                if (urlHistoryMap.get(tabId) && newUrl != oldUrl) {
                    urlHistoryMap.set(tabId, newUrl);

                    console.log("updated one of the url");
                    console.log(urlHistoryMap);
                }
                // add url of the new tab to the urlHistoryMap.
                else if (urlHistoryMap.get(tabId) == undefined) {
                    fetchOpenedTabs();
                    console.log("updated the urlHistoryMap")
                    console.log(urlHistoryMap)

                }
            }

            return
        });

    } catch (error) {

    }

}

mainFunc();

