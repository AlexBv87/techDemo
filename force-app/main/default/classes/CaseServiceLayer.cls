/**
 * @description Service Layyer for the Case Obejct
 * @group Poject Classes
 * @see CaseTriggerHandler
 */
public class CaseServiceLayer {

    public static void completeMilestones(List<Case> newCases, Map<Id,Case> mapOldCases){

        Set <Id> setCaseIdsFirst = new Set <Id>(); //holds the Id's of the cases to complete the first milestone
        Set <Id> setCaseResolved = new Set <Id>(); //holds the Id's of the cases to complete the Case Complete Milestone
        
        for(Case cs : newCases){
            if(cs.Status == 'Working' && mapOldCases.get(cs.Id).Status =='New'){
                setCaseIdsFirst.add(cs.Id);
            }
            if(cs.Status == 'Closed' && mapOldCases.get(cs.Id).Status =='Working'){
                setCaseResolved.add(cs.Id);
            }
        }
        if(setCaseIdsFirst.size() >0){
            String firstResp = Service_Setting__mdt.getInstance('First_Reponse').Milestone_Name__c;
            MilestoneUtils.completeMilestone(setCaseIdsFirst, firstResp, System.now());
        }

        if(setCaseResolved.size() >0){
            String closeCase = Service_Setting__mdt.getInstance('Close_Case').Milestone_Name__c;
            MilestoneUtils.completeMilestone(setCaseResolved, closeCase, System.now());
        }
    } 
}
