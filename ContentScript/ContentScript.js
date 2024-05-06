// this content script is dynamically injected to pause the youtube video launched when user click on tab group. 
console.log("hey from content script")
// let videoElement = document.querySelector('video');
// if(videoElement){
//     console.log(videoElement);
//     videoElement.pause();
//     videoElement = null;
// }

if(document.querySelector('video')){
    document.querySelector('video').pause();
}