const deleteGroup = () => {
    chrome.storage.local.clear(() => {
        console.log('All data cleared ');
    });
}

export default deleteGroup