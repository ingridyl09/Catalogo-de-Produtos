import { api, wire} from 'lwc';
import LightningModal from 'lightning/modal';
import { publish, MessageContext } from 'lightning/messageService';
import MY_MESSAGE_CHANNEL from '@salesforce/messageChannel/myMessageChannel__c';

export default class ModalInfos extends LightningModal {
    @api content;

    @wire(MessageContext)
    messageContext;

    handleOkay() {
        this.close('okay');
    }

    handleAddToCart() {

        const message = {
            data: this.content
        };
        
        publish(
            this.messageContext, 
            MY_MESSAGE_CHANNEL, 
            message
            );
    }
}
