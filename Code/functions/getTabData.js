const getTabData = (tabId, groupName) => {
    return new Promise((resolve) => {
        chrome.tabs.get(parseInt(tabId), (item) => {
            // console.log(item);
            const tabData = {
                groupName: `${groupName}`,
                title: `${item.title}`,
                url: `${item.url}`,
                muted: item.mutedInfo.muted
            };
            resolve(tabData);
        });
    });
};

export default getTabData