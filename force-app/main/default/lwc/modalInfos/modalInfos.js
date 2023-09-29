import { api, wire} from 'lwc';
import LightningModal from 'lightning/modal';
import { publish, MessageContext } from 'lightning/messageService';
import MY_MESSAGE_CHANNEL from '@salesforce/messageChannel/myMessageChannel__c';
import LightningAlert from 'lightning/alert';

export default class ModalInfos extends LightningModal {
    @api content;

    @wire(MessageContext)
    messageContext;

    handleOkay() {
        this.close('okay');
    }

    async openAlertModal(){
		const result = await LightningAlert.open({
			label: 'Alerta',
			message: 'Limite de estoque excedido!',
            theme: 'error'
		});
	}

    handleAddToCart() {
        const message = {
            data: this.content
        };

        if(this.content.productQtde === null ||this.content.productQtde === undefined || this.content.productQtde === 0){
                 this.openAlertModal();
        }else{      
            publish(
                this.messageContext, 
                MY_MESSAGE_CHANNEL, 
                message
                );
            }
    }
}
