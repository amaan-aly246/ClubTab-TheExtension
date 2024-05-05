
const displayTabs = async (tabsContainer) => {
    try {

        const response = await chrome.tabs.query({});
        const tabData = await response
        const ul = document.createElement('ul');
        tabsContainer.appendChild(ul)
        if (tabData) {
            ul.innerHTML = tabData.map((tab) => {
                return `<div class="link">
                        <div class="add-tab-btn add">
                        ➕</div>
                    <li id =${tab.id}>${tab.title}</li>
                        </div>`
            }).join('')
        }
        // console.log(tabData[0]);
        return tabData
    } catch (error) {
        console.log(error);
    }
}
export default displayTabs

