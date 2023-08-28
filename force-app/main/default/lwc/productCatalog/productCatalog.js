import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductsController.getProducts';
import modalInfos from 'c/modalInfos';

export default class ProductCatalog extends LightningElement {
    products = [];

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
        } else if (error) {
            console.error('Error retrieving products:', error);
        }
    }
    
    handleOpenProduct(event) {
        const productName = event.target.dataset.productName;
        const productDescription = event.target.dataset.productDescription;
        const productImageUrl = event.target.dataset.productImageUrl;
        const productPreco = event.target.dataset.productPreco;
        const productQtde = event.target.dataset.productQtde;
        const productId = event.target.dataset.productId;
        

        this.handleOpenModal(productName, productDescription, productImageUrl, productPreco, productId,productQtde);
    }

    handleOpenModal(productName, productDescription, productImageUrl, productPreco, productId, productQtde) {
        const productData = {
            name: productName,
            description: productDescription,
            preco: productPreco,
            imageUrl: productImageUrl,
            productId: productId,
            productQtde: productQtde
        };

        modalInfos.open({
            content: productData
        });
    } 
}
