import type { TableDef } from '../classes/Table/types.js';
import type { AttributeDefinitions, EntityConstructor, PureAttributeDefinition, Readonly } from '../classes/Entity/types.js';
export interface TrackingInfo {
    fields: string[];
    defaults: any;
    required: any;
    linked: Linked;
    keys: any;
}
export interface Linked {
    [key: string]: string[];
}
export interface TrackingInfoKeys {
    partitionKey?: string;
    sortKey?: string;
}
export declare type ParsedEntity<EntityTable extends TableDef | undefined = TableDef | undefined, Name extends string = string, AutoExecute extends boolean = boolean, AutoParse extends boolean = boolean, TypeAlias extends string = string, TypeHidden extends boolean = boolean> = {
    name: Name;
    schema: {
        keys: any;
        attributes: Record<string, PureAttributeDefinition>;
    };
    _etAlias: TypeAlias;
    typeHidden: TypeHidden;
    autoParse: AutoParse | undefined;
    autoExecute: AutoExecute | undefined;
    linked: Linked;
    defaults: any;
    required: any;
    table?: EntityTable | undefined;
    setTable?: <NextTable extends EntityTable | undefined>(table: NextTable) => ParsedEntity<NextTable, Name, AutoExecute, AutoParse, TypeAlias, TypeHidden>;
};
export declare function parseEntity<EntityTable extends TableDef | undefined, Name extends string, AutoExecute extends boolean, AutoParse extends boolean, Timestamps extends boolean, CreatedAlias extends string, ModifiedAlias extends string, TypeAlias extends string, TypeHidden extends boolean, ReadonlyAttributeDefinitions extends Readonly<AttributeDefinitions> = Readonly<AttributeDefinitions>>(entity: EntityConstructor<EntityTable, Name, AutoExecute, AutoParse, Timestamps, CreatedAlias, ModifiedAlias, TypeAlias, TypeHidden, ReadonlyAttributeDefinitions>): ParsedEntity<EntityTable, Name, AutoExecute, AutoParse, TypeAlias>;
export default parseEntity;
