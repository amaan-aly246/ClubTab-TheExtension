
let storedGroupsData = {}
let urlHistoryMap = new Map()

let changedUrl = ""
let changedTitle = ""

const fetchStoredData = async () => {
  try {
    const data = await chrome.storage.local.get('storedGroupsData');
    return data.storedGroupsData ?? {};
  } catch (error) {
    console.error('Error fetching stored data:', error);
    return {};
  }
}
const updateStoredData = async (tabId, newUrl, newTitle, groupName, index) => {
  try {
    const tabData = {
      groupName,
      title: newTitle,
      url: newUrl,
      muted: false,
    };
    storedGroupsData[groupName][index] = tabData;
    await chrome.storage.local.set({ 'storedGroupsData': storedGroupsData });
    console.log('Updated stored data:', storedGroupsData);
  } catch (error) {
    console.error('Error updating stored data:', error);
  }
};
const mapOpenedTabs = async () => {
  // first time creating urlHistoryMap 
  if (urlHistoryMap.size == 0) {
    const data = await chrome.tabs.query({});
    for (const item of data) {
      const url = item.pendingUrl || item.url;
      urlHistoryMap.set(item.id, url);
    }
    return
  }
}
const mainFunc = async () => {
  storedGroupsData = await fetchStoredData()
  await mapOpenedTabs()
  const allGroupNames = Object.keys(storedGroupsData);

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      changedUrl = changeInfo.url
    }
    if (changeInfo.title) {
      changedTitle = changeInfo.title
    }
    if (changedUrl && changedTitle) {
      changedTitle = ""
      changedUrl = ""
      const newUrl = tab.url;
      const newTitle = tab.title;
      const oldUrl = urlHistoryMap.get(tabId) || ' ';

      if (newUrl !== oldUrl) {
        urlHistoryMap.set(tabId, newUrl);

        allGroupNames.forEach((groupName) => {
          storedGroupsData[groupName].forEach((tabProp, index) => {
            if (tabProp.url === oldUrl) {
              updateStoredData(tabId, newUrl, newTitle, groupName, index);
            }
          });
        });
      }

    }
  })

}

mainFunc()