import { LightningElement,wire, api, track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import { getPicklistValues } from "lightning/uiObjectInfoApi";
import STATUS_FIELD from "@salesforce/schema/Case.Status";
import PRIORITY_FIELD from "@salesforce/schema/Case.Priority";

import getCases from "@salesforce/apex/ServiceOperations.getCases";

export default class ServiceOperations extends NavigationMixin (LightningElement) {

    @track data;
    searchable = [];
    wiredCaseCount;
    wiredCases;

    doneTypingInterval = 0;
    statusPickListValues;
    priorityPickListValues;

    searchAllValue;

    caseNumber = "";
    contactName = "";
    subject = "";
    status = null;
    priority = null;

    records;
    sortedColumn;
    sortedDirection;

    @wire(getCases, {
        caseNumber: "$caseNumber",
        contactName: "$contactName",
        subject: "$subject",
        status: "$status",
        priority: "$priority"
    })
    wiredSObjects(result) {
        console.log("wire getting called");
        this.wiredCases = result;
        console.log('data is '+JSON.stringify(this.wiredCases));
        if (result.data) {
            this.searchable = this.data = result.data.map((caseObj, index) => ({
                caseData: { ...caseObj },
                index: index + 1,
                rowIndex: index
            }));

        } else if (result.error) {
            console.error("Error", error);
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "0127Q000000EmrWQAS", //bad hardcoded value -should be moved to another functin or custom label
        fieldApiName: STATUS_FIELD
    })
    statusPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            console.log('data is' +JSON.stringify(data));
            this.statusPickListValues = [
                { label: "All", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "0127Q000000EmrWQAS", //bad hardcoded value -should be moved to another functin or custom label
        fieldApiName: PRIORITY_FIELD
    })
    priorityPickListPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.priorityPickListValues = [
                { label: "All", value: null },
                ...data.values
            ];
        }
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
        console.log("change", this[event.target.name]);
    }

    handleKeyUp(event) {
        clearTimeout(this.typingTimer);
        let value = event.target.value;
        let name = event.target.name;

        this.typingTimer = setTimeout(() => {
            this[name] = value;
        }, this.doneTypingInterval);
    }

    clearSearch() {
        this.caseNumber = "";
        this.contactName = "";
        this.subject = "";
        this.status = null;
        this.priority = null;
        this.searchable = this.data;
        this.searchAllValue = "";
        this.searchAll();
    }

    handleSearchAll(event) {
        this.searchAllValue = event.target.value;
        this.searchAll();
    }

    sortRecs(event){
        console.log('called sort');
        let colName = event ? event.target.name : undefined;
        console.log( 'Column Name is ' + colName );

        if ( this.sortedColumn === colName )
            this.sortedDirection = ( this.sortedDirection === 'asc' ? 'desc' : 'asc' );
        else
            this.sortedDirection = 'asc';

        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;

        if ( colName )
            this.sortedColumn = colName;
        else
            colName = this.sortedColumn;

        console.log('this data '+JSON.stringify(this.data.subject));
        this.wiredCases = JSON.parse( JSON.stringify( this.wiredCases) ).sort( ( a, b ) => {
            a = a[ colName ] ? a[ colName ].toLowerCase() : 'z';
            b = b[ colName ] ? b[ colName ].toLowerCase() : 'z';
            return a > b ? 1 * isReverse : -1 * isReverse;
        });
    }

    handleNavigate(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                actionName: "view",
                recordId: event.target.dataset.id
            }
        });
    }

    handlePDF(){
    	window.print();
	}
}