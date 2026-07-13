export type RequestInterfaceQuery = {
    steamId: string;
    contextId: string;
    startAssetId?: string;
    count?: number;
}

export type AssetResponseInterface = {
    appid: number;
    contextid: string;
    assetid: string;
    classid: string;
    instanceid: string;
    amount: string;
};

export type DescResponseInterface = {
    type: string;
    value: string;
    color?: string;
    name: string;
};

export type ActionResponseInterface = {
    link: string;
    name: string;
};

export type MarketActionResponseInterface = {
    link: string;
    name: string;
};

export type TagResponseInterface = {
    category: string;
    internal_name: string;
    localized_category_name: string;
    localized_tag_name: string;
    color?: string;
};

export type DescriptionResponseInterface = {
    appid: number;
    classid: string;
    instanceid: string;
    currency: number;
    background_color: string;
    icon_url: string;
    descriptions: Array<DescResponseInterface>;
    tradable: boolean;
    actions?: Array<ActionResponseInterface>;
    name: string;
    name_color: string;
    type: string;
    market_name: string;
    market_hash_name: string;
    owner_descriptions?: Array<{
        value: string;
        type: string;
        color?: string;
    }>;
    market_actions?: Array<MarketActionResponseInterface>;
    commodity: boolean;
    market_tradable_restriction: number;
    market_marketable_restriction: number;
    marketable: boolean;
    tags: Array<TagResponseInterface>;
    sealed: number;
};

export type PropertyResponseInterface = {
    propertyid: number;
    int_value?: string;
    float_value?: string;
    string_value?: string;
    name?: string;
};

export type parentRelationShipPropResponseInterface = {
    propertyid: number;
    int_value?: string;
    float_value?: string;
    string_value?: string;
};

export type AccessoryResponseInterface = {
    classid: string;
    parent_relationship_properties?: Array<parentRelationShipPropResponseInterface>;
};

export type AssetPropertyResponseInterface = {
    appid: number;
    contextid: string;
    assetid: string;
    asset_properties?: Array<PropertyResponseInterface>;
    asset_accessories?: Array<AccessoryResponseInterface>;
};

export type SteamInventoryResponseInterface = {
    assets: Array<AssetResponseInterface>;
    descriptions: Array<DescriptionResponseInterface>;
    asset_properties?: Array<AssetPropertyResponseInterface>;
    more_items?: number;
    last_assetid?: string;
    total_inventory_count: number;
    success: boolean;
    rwgrsn: number;
};