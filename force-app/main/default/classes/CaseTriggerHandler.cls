/**
 * @description trigger handler using framework
 * @group Triggers 
 * @see TriggerHandler
 */
public class CaseTriggerHandler extends TriggerHandler {
   
    private List<Case> triggerNew;
    private List<Case> triggerOld;
    private Map<Id, Case> triggerMapNew;
    private Map<Id, Case> triggerMapOld;

    @TestVisible
    private static Exception circuitBreaker;

    /**
     * @description Custom exception class
     */
    public class CaseTriggerHandlerException extends Exception {
    }

     /**
     * @description Constructor that sets class variables based on Trigger
     * context vars
     */
    public CaseTriggerHandler() {
        this.triggerOld = (List<Case>) Trigger.old;
        this.triggerNew = (List<Case>) Trigger.new;
        this.triggerMapNew = (Map<Id, Case>) Trigger.newMap;
        this.triggerMapOld = (Map<Id, Case>) Trigger.oldMap;
    }

    //Trigger Context

    /**
     * @description after update context method.
     * */
    @SuppressWarnings('PMD.ApexCRUDViolation')
    public override void afterUpdate() {
        CaseServiceLayer.completeMilestones(this.triggerNew, this.triggerMapOld);

    }
}
