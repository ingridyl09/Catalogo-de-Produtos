public with sharing class MyController {
    // Método público para abater a quantidade dos itens
    @AuraEnabled
    public static void abateQuantidadeItem(List<ItemData> itemDataList) {
        try {
            if (itemDataList != null && !itemDataList.isEmpty()) {
                List<Product2> itemsToUpdate = new List<Product2>();

                for (ItemData itemData : itemDataList) {
                    Product2 item = [SELECT Id, QuantidadeEmEstoque__c FROM Product2 WHERE Name = :itemData.itemName];

                    if (item != null) {
                        if (itemData.quantidadeSelecionada <= item.QuantidadeEmEstoque__c) {
                            item.QuantidadeEmEstoque__c -= itemData.quantidadeSelecionada;
                            itemsToUpdate.add(item);
                        } else {
                            throw new AuraHandledException('Quantidade selecionada maior que a quantidade em estoque para o item ' + itemData.itemName);
                        }
                    } else {
                        throw new AuraHandledException('Item não encontrado: ' + itemData.itemName);
                    }
                }
                update itemsToUpdate;
            }
        } catch (Exception e) {
            throw new AuraHandledException('Erro ao abater a quantidade dos itens: ' + e.getMessage());
        }
    }

    public class ItemData {
        @AuraEnabled
        public String itemName { get; set; }
        @AuraEnabled
        public Integer quantidadeSelecionada { get; set; }
    }
}
