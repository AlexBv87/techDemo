/**
* @description Trigger For Case
* @group Triggers 
* @see TriggerHandler
*/

trigger CaseTrigger on Case (before insert, before update, after insert, after update, before delete, after delete, after undelete) {
    
    //instantiante handler
     new CaseTriggerHandler().run();
}