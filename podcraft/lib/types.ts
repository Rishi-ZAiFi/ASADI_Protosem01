export type Chapter={timestamp:string;title:string;summary:string};
export type Highlight={timestamp:string;title:string;text:string;reason:string;type:string};
export type Result={title:string;alternativeTitles:string[];description:string;chapters:Chapter[];highlights:Highlight[];demo?:boolean;notice?:string};
export const MIN_CHARS=200;
