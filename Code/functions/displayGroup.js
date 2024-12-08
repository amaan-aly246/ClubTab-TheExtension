import { page3Func } from "../js/page3.js"
const displayGroup = async (grpContainer) => {
    try {

        const data = (await chrome.storage.local.get('storedGroupsData')).storedGroupsData || {}
        if (Object.keys(data).length != 0) {

            const groupNameArray = Object.keys(data);
            if (grpContainer) {
                grpContainer.innerHTML = groupNameArray.map((groupName) => {
                    return ` <div class="grp">
                    <p class="grp-name" id ="${groupName}">${groupName}</p>
                    <p class="grp-btns">
                        <i class="fa-regular fa-pen-to-square  edit-btn" id="page-3-btn" style="color: #2ec11a;"></i>
                        <i  id = "view-btn" class="fa-solid fa-eye view-btn" " style="color: #3da1ff;"></i>
                        <i class="fa fa-trash delete-btn" aria-hidden="true"></i>
                        
                    </p>
                </div>`
                }).join('');
            }
            // Add event listeners after setting innerHTML
            document.querySelectorAll('#page-3-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    console.log('btn clicked', e.target);
                    page3Func(e);
                });
            });


        }
        else {
            return -1
        }


    } catch (error) {
        console.error(error);
    }
};

export default displayGroup;


