import { Dictionary } from "@salesforce/ts-types";
import { SteedosDataSourceType, SteedosActionType, SteedosTriggerType, SteedosFieldType } from ".";
import _ = require("underscore");
import { SteedosFieldTypeConfig } from "./field";


export type SteedosObjectTypeConfig = {
    name: String
    datasource?: SteedosDataSourceType
    fields: Dictionary<SteedosFieldTypeConfig>
    actions?: Dictionary<SteedosActionType>
    triggers?: Dictionary<SteedosTriggerType>
}

export class SteedosObjectType {

    _name: String
    _datasource: SteedosDataSourceType
    _fields: Dictionary<SteedosFieldType> = {}
    _actions: Dictionary<SteedosActionType> = {}
    _triggers: Dictionary<SteedosTriggerType> = {}

    constructor(config: SteedosObjectTypeConfig) {
        this._name = config.name
        this._datasource = config.datasource

        _.each(config.fields, (field, field_name) =>{
            this.setField(field_name, field)
        }) 

        this._actions = config.actions
        this._triggers = config.triggers
    }

    setField(field_name: string, fieldConfig: SteedosFieldTypeConfig){
        let field = new SteedosFieldType(field_name, this, fieldConfig)
        this._fields[field_name] = field
    }

    extend(config: SteedosObjectTypeConfig){
        if (this._name != config.name)
            throw new Error("You can not extend on different object");
        
        // override datasource
        if (config.datasource)
            this._datasource = config.datasource;

        // override each fields
        _.each(config.fields, (field, field_name) =>{
            this.setField(field_name, field)
        }) 
        
        // override each actions
        if (config.actions) {
            _.each(config.actions, (action) =>{
                this._actions[action.name] = action
            }) 
        }
        
        // override each triggers
        if (config.triggers) {
            _.each(config.triggers, (trigger) =>{
                this._triggers[trigger.name] = trigger
            }) 
        }
    }
}
