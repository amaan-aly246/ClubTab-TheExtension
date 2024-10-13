let flag = 0;
let storedGroupsData;
let allGroupNames;
let urlHistoryMap = new Map();

const fetchStoredData = async () => {
    try {
      const data = await chrome.storage.local.get('storedGroupsData');
      return data.storedGroupsData ?? {};
    } catch (error) {
      console.error('Error fetching stored data:', error);
      return {};
    }
  };
  
  const fetchOpenedTabs = async () => {
    try {
      const data = await chrome.tabs.query({});
      const newUrlHistoryMap = new Map();
  
      for (const item of data) {
        const url = item.pendingUrl || item.url;
        newUrlHistoryMap.set(item.id, url);
      }
  
      return newUrlHistoryMap;
    } catch (error) {
      console.error('Error fetching opened tabs:', error);
      return new Map();
    }
  };


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
  
  
  const mainFunc = async () => {
    try {
      const [fetchedStoredData, fetchedUrlHistoryMap] = await Promise.all([
        fetchStoredData(),
        fetchOpenedTabs(),
      ]);
      storedGroupsData = fetchedStoredData;
      urlHistoryMap = fetchedUrlHistoryMap;
      allGroupNames = Object.keys(storedGroupsData);
  
      chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
          const newUrl = tab.url;
          const newTitle = tab.title;
          const oldUrl = urlHistoryMap.get(tabId) || '';
  
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
      });
    } catch (error) {
      console.error('Error in mainFunc:', error);
    }
  };
  
  mainFunc();