const { readFile } = require('fs/promises')

class BaseRepository {
    constructor({ file }) {
        this.file = file
    }

    async find(itemId) {
       const content = JSON.parse(await readFile(this.file));

        if (!itemId) {
            return content;
        }

       return content.find(({ id }) => id === itemId);
    }

    async findByAttribute(attributeName, attributeValue) {
        const content = JSON.parse(await readFile(this.file));
 
         if (!attributeName || !attributeValue) {
            return content;
         }
 
        return content.find((item) => item[attributeName] === attributeValue);
     }
}

module.exports = BaseRepository