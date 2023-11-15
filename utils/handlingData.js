const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

function saveImg(img){
    let fileName = uuid.v4() + '.jpg'
    img.mv(path.resolve(__dirname, '..', 'static', fileName))
    return fileName;
}

function deleteStaticPhoto(photoPath) {
    try {
        fs.unlinkSync(photoPath); // Удалить файл по указанному пути
    } catch (error) {
        console.error(`Ошибка при удалении файла: ${error}`);
    }
}

function checkAndUpdateImg( old, product, obj){
    let arrImg = [];

    const oldImgArray = JSON.parse(old);
    const removedImages = product.imgs.filter((img) => !oldImgArray.includes(img));
    if(removedImages.length > 0){
        removedImages.forEach(item=>{
            deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
        })
    }
    arrImg = [...oldImgArray];

    if(obj !== null && obj.img){
        if(Array.isArray(obj.img)){
            obj.img.forEach(img=>{
                arrImg.push(saveImg(img))
            })
        }else{
            arrImg.push(saveImg(obj.img))
        } 
    }

    return arrImg;
}

function parseInfo(info){
    let infoArr = [];

    if (info) {
        info = JSON.parse(info);
        info.forEach(i => {
            infoArr.push({
                name: i.name,
                text: i.text
            });
        });
    }    
    return infoArr;
}

function parseImg(img){
    let arrImg = [];
    if(Array.isArray(img)){
        img.forEach(img=>{
            arrImg.push(saveImg(img))
        })
    }else{
        arrImg.push(saveImg(img))
    }
    return arrImg;
}

 


module.exports = {
    saveImg,
    deleteStaticPhoto,
    checkAndUpdateImg,
    parseImg, 
    parseInfo

};