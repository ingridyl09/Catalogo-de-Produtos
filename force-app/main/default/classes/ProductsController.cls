public with sharing class ProductsController {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() {
        return [SELECT Id, Imagem__c, QuantidadeEmEstoque__c, Preco__c, Name, Description FROM Product2 WHERE Imagem__c != null LIMIT 150];
    }
}