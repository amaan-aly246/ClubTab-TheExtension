const  generateUniqueId =  ()=> {
    // Generate a random number between 10000 (inclusive) and 99999 (exclusive)
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return randomNumber;
  }

  export default generateUniqueId