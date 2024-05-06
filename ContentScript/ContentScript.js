// this content script is dynamically injected to pause the youtube video launched when user click on tab group. 
console.log("hey from content script")
const video = document.querySelector('video');
if(video){
    console.log(video);
    video.pause();
}