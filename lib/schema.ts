import {z} from "zod";
export const Concept=z.object({name:z.string(),strategy:z.string(),visualDirection:z.string(),creatorPlacement:z.string(),facialExpression:z.string(),background:z.string(),supportingVisuals:z.string(),text:z.string(),textPlacement:z.string(),composition:z.string(),aesthetic:z.string(),whyItWorks:z.string()});
export const Analysis=z.object({contentType:z.string(),visualHook:z.string(),emotionalHook:z.string(),creatorImportance:z.enum(["high","medium","low"]),recommendedStrategy:z.string(),textLevel:z.enum(["NONE","MINIMAL","HEADLINE"]),reason:z.string()});
export const Result=z.object({analysis:Analysis,concepts:z.array(Concept).length(3)});
export const Refined=z.object({concept:Concept});
export type TConcept=z.infer<typeof Concept>; export type TResult=z.infer<typeof Result>;
