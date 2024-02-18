const coffeeController = require("./coffeeController");
const dripController = require("./dripController");
const merchController = require("./merchController");
const lemonadeController = require("./lemonadeController");
const fs = require('fs/promises');
const path = require("path");

class XmlController {
    async get(req, res) {
        try {
            const coffeeData = await coffeeController.getAllFeed();
            const dripData = await dripController.getAllFeed();
            const merchData = await merchController.getAllFeed();
            const lemonadeData = await lemonadeController.getAllFeed();
            if (!coffeeData || !dripData || !merchData || !lemonadeData) {
                console.error("Some data is undefined");
                return res.status(500).send('Internal Server Error');
            }
            const BASE_URL_IMG = 'https://bedoin.com.ua/'

            const generateDriptXML =(product) => {
                return `
                    <item>
                        <g:id>${product._id}</g:id>
                        <g:title>${product.title}</g:title>
                        <g:description><![CDATA[${product.description}]]</g:description>
                        <g:link>${BASE_URL_IMG + 'drip/' + product._id}</g:link>
                        <g:image_link>${BASE_URL_IMG + product.imgs[0]}</g:image_link>
                        <g:availability>${product.in_stock === true ? 'in stock' : 'out of stock'}</g:availability>
                        <g:price>${product.price.standart.regular + '.00 UAH'}</g:price>
                        <g:sale_price>${product.price.standart.opt + '.00 UAH'}</g:sale_price>
                        <g:condition>new</g:condition>
                        <g:brand>Bedoin</g:brand>
                    </item>
                `;
            }
        
            const generateMerchtXML =(product) => {
                return `
                    <item>
                        <g:id>${product._id}</g:id>
                        <g:title>${product.title}</g:title>
                        <g:description><![CDATA[${product.short_description}]]</g:description>
                        <g:link>${BASE_URL_IMG + 'merch/' + product._id}</g:link>
                        <g:image_link>${BASE_URL_IMG + product.imgs[0]}</g:image_link>
                        <g:availability>${product.in_stock === true ? 'in stock' : 'out of stock'}</g:availability>
                        <g:price>${product.price.standart.regular + '.00 UAH'}</g:price>
                        <g:sale_price>${product.price.standart.opt + '.00 UAH'}</g:sale_price>
                        <g:condition>new</g:condition>
                        <g:brand>Bedoin</g:brand>
                    </item>
                `;
            }
        
            const generateLemonadetXML =(product) => {
                return `
                    <item>
                        <g:id>${product._id}</g:id>
                        <g:title>${product.title}</g:title>
                        <g:description><![CDATA[${product.short_description}]]></g:description>
                        <g:link>${BASE_URL_IMG + 'lemonade/' + product._id}</g:link>
                        <g:image_link>${BASE_URL_IMG + product.imgs[0]}</g:image_link>
                        <g:availability>${product.in_stock === true ? 'in stock' : 'out of stock'}</g:availability>
                        <g:price>${product.price.standart.regular + '.00 UAH'}</g:price>
                        <g:sale_price>${product.price.standart.opt + '.00 UAH'}</g:sale_price>
                        <g:condition>new</g:condition>
                        <g:brand>Bedoin</g:brand>
                        <g:product_type>НАПІЙ</g:product_type>
                    </item>
                `;
            }

            const generateCoffeeXML = (product) => {
                return `
                    <item>
                        <g:id>${product._id}</g:id>
                        <g:title>${product.title}</g:title>
                        <g:description><![CDATA[${product.description}]]</g:description>
                        <g:link>${BASE_URL_IMG + 'coffee/' + product._id}</g:link>
                        <g:image_link>${BASE_URL_IMG + product.imgs[0]}</g:image_link>
                        <g:availability>${product.in_stock === true ? 'in stock' : 'out of stock'}</g:availability>
                        <g:price>${product.price.standart.regular + '.00 UAH'}</g:price>
                        <g:sale_price>${product.price.standart.opt + '.00 UAH'}</g:sale_price>
                        <g:condition>new</g:condition>
                        <g:brand>Bedoin</g:brand>
                    </item>
                `;
            }
            

            const generateXML = (coffee, drip, lemonade, merch) => {
                return `
                    <rss xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://base.google.com/cns/1.0" version="2.0">
                        <channel>
                            <title>BEDOIN coffee</title>
                            <link>https://bedoin.com.ua</link>
                            ${coffee.length > 0 && coffee.map(generateCoffeeXML).join('\n')}
                            ${drip.length > 0 && drip.map(generateDriptXML).join('\n')}
                            ${lemonade.length > 0 && lemonade.map(generateLemonadetXML).join('\n')}
                            ${merch.length > 0 && merch.map(generateMerchtXML).join('\n')}
                        </channel>
                    </rss>
                `;
            }

            const generatedXML = generateXML(coffeeData, dripData, lemonadeData, merchData);
            const filePath = path.join(__dirname, '..', 'product_feed.xml')
            await fs.writeFile(filePath, generatedXML);            
            return res.sendFile(filePath, {
                headers: {
                  'Content-Type': 'application/xml',
                  'Content-Disposition': 'attachment; filename=product_feed.xml',
                },
              });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new XmlController();