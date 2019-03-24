let getTemplate = (tid) => {
    return document.querySelector(`template#${tid}`).content.querySelector(`#${tid}`);
};
export default getTemplate ;