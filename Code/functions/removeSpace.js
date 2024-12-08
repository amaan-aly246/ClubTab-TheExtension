const removeWhitespace = (str) => {
    console.log('before space removal', str)
    console.log('after '  ,str.replace(/\s+/g, '') )

    return str.replace(/\s+/g, '');
};

export default removeWhitespace;

