import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import MY_MESSAGE_CHANNEL from '@salesforce/messageChannel/myMessageChannel__c';
import LightningAlert from 'lightning/alert';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import abateQuantidadeItem from '@salesforce/apex/MyController.abateQuantidadeItem';

export default class CartItem extends LightningElement {
    subscription = null;
    @track cartItems = [];
    hasItems = false;
    @track totalPriceCart = 0;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            MY_MESSAGE_CHANNEL,
            (message) => this.handleCart(message)
        );

        console.log('se inscreveu ');
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
        console.log('connectedCallback ');
    }

    handleCart(message) {
        if (message) {
            const newItem = {
                name: message.data.name,
                productId: message.data.productId,
                imageUrl: message.data.imageUrl,
                preco: parseFloat(message.data.preco),
                productQtde: message.data.productQtde,
                quantidadeSelecionada: 1,
                totalPrice: parseFloat(message.data.preco)
            };

            const existingItemIndex = this.cartItems.findIndex(item => item.name === newItem.name);
            if (existingItemIndex !== -1) {
                if (this.cartItems[existingItemIndex].quantidadeSelecionada + 1 <= newItem.productQtde) {
                    this.cartItems[existingItemIndex].quantidadeSelecionada += 1;
                    this.cartItems[existingItemIndex].totalPrice += newItem.preco;
                }
                else{
                    this.openAlertModal();
                }
            } else {
                this.hasItems = true;
                this.cartItems.push(newItem);
            }
            this.calculateTotalPriceCart();
        }
    }

    calculateTotalPriceCart() {
        this.totalPriceCart = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
    }

    handleRemoveItem(event) {   
        const itemName = event.target.dataset.name;
        this.cartItems = this.cartItems.filter(item => item.name !== itemName);
        this.calculateTotalPriceCart()
        this.hasItems = this.cartItems.length > 0;
    }

    async openAlertModal(){
		const result = await LightningAlert.open({
			label: 'Alerta',
			message: 'Limite de estoque excedido!',
            theme: 'error'
		});
	}

    handleFinalizarCompra() {
        const itemsToAbate = this.cartItems.map(item => {
            return { itemName: item.name, quantidadeSelecionada: item.quantidadeSelecionada };
        });

        abateQuantidadeItem({ itemDataList: itemsToAbate })
            .then(() => {
                const event = new ShowToastEvent({
                    title: 'Sucesso!',
                    message: 'Compra finalizada com sucesso!',
                    variant: 'success'
                });
                this.dispatchEvent(event);

                this.cartItems = [];
                this.calculateTotalPriceCart();
                this.hasItems = this.cartItems.length > 0;
            })
            .catch(error => {
                const event = new ShowToastEvent({
                    title: 'Erro',
                    message: 'Ocorreu um erro ao finalizar a compra: ' + error.message,
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
    }
    

}
